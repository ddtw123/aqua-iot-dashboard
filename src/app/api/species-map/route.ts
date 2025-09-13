import { dynamoClient } from "@/lib/aws-config";
import { QueryCommand, ScanCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest } from "next/server";
import { SPECIES_TABLE_NAME } from "@/util/constant";

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
        TableName: SPECIES_TABLE_NAME,
        KeyConditionExpression: "device_id = :d",
        ExpressionAttributeValues: { ":d": deviceId },
        Limit: limit,
      }));
      items = (resp.Items ?? []) as Record<string, unknown>[];

      // Auto-create default record if missing
      if (items.length === 0) {
        const now = new Date().toISOString();
        const defaultItem = {
          device_id: deviceId,
          species: "",
          city: "",
          lat: 0,
          lng: 0,
          updated_at: now,
          version: 1,
        };
        await dynamoClient.send(new PutCommand({
          TableName: SPECIES_TABLE_NAME,
          Item: defaultItem,
        }));
        items = [defaultItem];
      }
    } else {
      const resp = await dynamoClient.send(new ScanCommand({
        TableName: SPECIES_TABLE_NAME,
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
      updated_at: String(x.updated_at ?? ""),
      version: Number(x.version) || 0,
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

    const now = new Date().toISOString();

    await dynamoClient.send(new UpdateCommand({
      TableName: SPECIES_TABLE_NAME,
      Key: { device_id: String(device_id) },
      UpdateExpression: "SET #species = :species, #city = :city, #lat = :lat, #lng = :lng, #u = :u, #v = if_not_exists(#v, :zero) + :one",
      ExpressionAttributeNames: {
        "#species": "species",
        "#city": "city", 
        "#lat": "lat",
        "#lng": "lng",
        "#u": "updated_at",
        "#v": "version"
      },
      ExpressionAttributeValues: {
        ":species": String(species || ""),
        ":city": String(city || ""),
        ":lat": Number(lat) || 0,
        ":lng": Number(lng) || 0,
        ":u": now,
        ":zero": 0,
        ":one": 1
      },
    }));

    const updatedItem = {
      device_id: String(device_id),
      species: String(species || ""),
      city: String(city || ""),
      lat: Number(lat) || 0,
      lng: Number(lng) || 0,
      updated_at: now,
    };

    return new Response(JSON.stringify({ 
      message: "Species map data updated successfully",
      data: updatedItem 
    }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (err) {
    console.error("/api/species-map POST error", err);
    return new Response(JSON.stringify({ error: "Failed to update species map" }), { status: 500 });
  }
}


