import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/ipfs-server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Filter out internal metadata keys to build keyvalues
    const metadata: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== "file" && key !== "name" && typeof value === "string") {
        metadata[key] = value;
      }
    });

    // Use our server-side utility which handles Pinata SDK and CID conversion
    const result = await uploadFile(file, name || file.name, metadata);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /ipfs/upload-file] Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
