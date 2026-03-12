import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const pinataJwt = process.env.PINATA_JWT;
    if (!pinataJwt) {
      return NextResponse.json({ error: "Pinata JWT not configured" }, { status: 500 });
    }

    // Convert file to Blob for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append("file", file, name || file.name);

    // Filter out internal metadata keys
    const pinataMetadata: Record<string, string> = {};
    if (formData && typeof formData.forEach === 'function') {
      formData.forEach((value, key) => {
        if (key !== "file" && key !== "name" && typeof value === "string") {
          pinataMetadata[key] = value;
        }
      });
    }

    if (Object.keys(pinataMetadata).length > 0) {
      pinataFormData.append(
        "pinataMetadata",
        JSON.stringify({
          name: name || file.name,
          keyvalues: pinataMetadata,
        })
      );
    }

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: pinataFormData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Pinata error:", errorText);
      return NextResponse.json(
        { error: `Pinata upload failed: ${res.statusText}` },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json({
      cid: json.IpfsHash,
      url: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/${json.IpfsHash}`,
      size: json.PinSize,
      name: name || file.name,
    });
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
