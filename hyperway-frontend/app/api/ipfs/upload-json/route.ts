import { NextResponse } from "next/server";
import { uploadJSON } from "@/lib/ipfs-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, name, metadata } = body;

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Use our server-side utility which handles Pinata SDK and CID conversion
    const result = await uploadJSON(data, name, metadata);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /ipfs/upload-json] Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
