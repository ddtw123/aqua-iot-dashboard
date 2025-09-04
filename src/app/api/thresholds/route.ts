import { NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.REGION;
const TABLE_NAME = process.env.THRESHOLDS_TABLE_NAME || "thresholds";

const ddb = new DynamoDBClient({ region: REGION });
const doc = DynamoDBDocumentClient.from(ddb);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULTS: Array<{ parameter: string; min: number; max: number }> = [
  { parameter: 'temp', min: 15, max: 30 },
  { parameter: 'ph', min: 5, max: 9 },
  { parameter: 'ammonia', min: 0, max: 0.25 },
  { parameter: 'turbidity', min: 25, max: 60 },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("device_id");
    const autoSeed = searchParams.get("auto_seed") === '1' || searchParams.get("auto_seed") === 'true';
    if (!deviceId) {
      return new Response(JSON.stringify({ error: "device_id is required" }), { status: 400 });
    }

    let resp = await doc.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "device_id = :d",
      ExpressionAttributeValues: { ":d": deviceId },
    }));

    // Auto-seed defaults if no rows exist and requested
    if ((resp.Items?.length || 0) === 0 && autoSeed) {
      const now = new Date().toISOString();
      for (const def of DEFAULTS) {
        await doc.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { device_id: deviceId, parameter: def.parameter },
          UpdateExpression: "SET #min = :min, #max = :max, #u = :u, #v = if_not_exists(#v, :zero) + :one",
          ExpressionAttributeNames: { "#min": "min", "#max": "max", "#u": "updated_at", "#v": "version" },
          ExpressionAttributeValues: { ":min": def.min, ":max": def.max, ":u": now, ":zero": 0, ":one": 1 },
        }));
      }
      resp = await doc.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "device_id = :d",
        ExpressionAttributeValues: { ":d": deviceId },
      }));
    }

    const items = (resp.Items || []).map((x) => ({
      device_id: String(x.device_id),
      parameter: String(x.parameter),
      min: Number(x.min),
      max: Number(x.max),
      updated_at: String(x.updated_at),
      version: Number(x.version) || 0,
    }));

    return new Response(JSON.stringify({ items }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("/api/thresholds GET error", err);
    return new Response(JSON.stringify({ error: "Failed to get thresholds" }), { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const device_id: string = body?.device_id;
    let items: Array<{ parameter: string; min: number; max: number }>= body?.items || [];
    if (!device_id) {
      return new Response(JSON.stringify({ error: "device_id is required" }), { status: 400 });
    }
    // If no items provided, seed defaults
    if (!Array.isArray(items) || items.length === 0) {
      items = DEFAULTS;
    }
    const now = new Date().toISOString();

    for (const it of items) {
      await doc.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { device_id, parameter: it.parameter },
        UpdateExpression: "SET #min = :min, #max = :max, #u = :u, #v = if_not_exists(#v, :zero) + :one",
        ExpressionAttributeNames: { "#min": "min", "#max": "max", "#u": "updated_at", "#v": "version" },
        ExpressionAttributeValues: { ":min": it.min, ":max": it.max, ":u": now, ":zero": 0, ":one": 1 },
      }));
    }

    return new Response(JSON.stringify({ ok: true, updated_at: now }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("/api/thresholds PUT error", err);
    return new Response(JSON.stringify({ error: "Failed to save thresholds" }), { status: 500 });
  }
}


