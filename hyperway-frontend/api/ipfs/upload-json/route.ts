import { NextRequest, NextResponse } from "next/server";
import { uploadJSON } from "@/lib/ipfs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, name, metadata } = body;

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Request body must include a 'data' object" },
        { status: 400 },
      );
    }

    const result = await uploadJSON(data, name, metadata);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /ipfs/upload-json]", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
