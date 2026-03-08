import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/ipfs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "'file' field is required" },
        { status: 400 },
      );
    }

    // Extract metadata from form fields
    const metadata: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "file" && key !== "name" && typeof value === "string") {
        metadata[key] = value;
      }
    }

    const result = await uploadFile(
      file,
      name || undefined,
      Object.keys(metadata).length > 0 ? metadata : undefined,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /ipfs/upload-file]", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
