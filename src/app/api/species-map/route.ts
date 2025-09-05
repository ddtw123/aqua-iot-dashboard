import { dynamoClient } from "@/lib/aws-config";
import { QueryCommand, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest } from "next/server";

const TABLE_NAME = process.env.SPECIES_TABLE_NAME;

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
      const resp = await dynamoClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "device_id = :d",
        ExpressionAttributeValues: { ":d": deviceId },
        Limit: limit,
      }));
      items = (resp.Items ?? []) as Record<string, unknown>[];

      // Auto-create default record if missing
      if (items.length === 0) {
        const defaultItem = {
          device_id: deviceId,
          species: "",
          city: "",
          lat: 0,
          lng: 0,
        };
        await dynamoClient.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: defaultItem,
        }));
        items = [defaultItem];
      }
    } else {
      const resp = await dynamoClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        Limit: limit,
      }));
      items = (resp.Items ?? []) as Record<string, unknown>[];
    }

    const data = items.map((x) => ({
      device_id: String(x.device_id ?? ""),
      species: String(x.species ?? ""),
      city: String(x.city ?? ""),
      lat: Number.isFinite(toNumber(x.lat)) ? toNumber(x.lat) : 0,
      lng: Number.isFinite(toNumber(x.lng)) ? toNumber(x.lng) : 0,
    }));

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { device_id, species, city, lat, lng } = body;

    if (!device_id) {
      return new Response(JSON.stringify({ error: "device_id is required" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const item = {
      device_id: String(device_id),
      species: String(species || ""),
      city: String(city || ""),
      lat: Number(lat) || 0,
      lng: Number(lng) || 0,
    };

    await dynamoClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    return new Response(JSON.stringify({ 
      message: "Species map data updated successfully",
      data: item 
    }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (err) {
    console.error("/api/species-map POST error", err);
    return new Response(JSON.stringify({ error: "Failed to update species map" }), { status: 500 });
  }
}


