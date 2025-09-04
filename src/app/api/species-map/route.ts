import { NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.REGION;
const TABLE_NAME = process.env.SPECIES_TABLE_NAME;

const ddb = new DynamoDBClient({ region: REGION });
const doc = DynamoDBDocumentClient.from(ddb);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("device_id") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 200, 1000) : 200;

    let items: Record<string, unknown>[] = [];

    if (deviceId) {
      // If device_id is partition key
      const resp = await doc.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "device_id = :d",
        ExpressionAttributeValues: { ":d": deviceId },
        Limit: limit,
      }));
      items = (resp.Items ?? []) as Record<string, unknown>[];
    } else {
      const resp = await doc.send(new ScanCommand({
        TableName: TABLE_NAME,
        Limit: limit,
      }));
      items = (resp.Items ?? []) as Record<string, unknown>[];
    }

    const data = items.map((x) => ({
      device_id: String(x.device_id ?? ""),
      species: String(x.species ?? ""),
      city: String(x.city ?? ""),
      lat: toNumber(x.lat),
      lng: toNumber(x.lng),
    })).filter(x => Number.isFinite(x.lat) && Number.isFinite(x.lng));

    return new Response(JSON.stringify({ data }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("/api/species-map error", err);
    return new Response(JSON.stringify({ error: "Failed to read species map" }), { status: 500 });
  }
}

function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}


