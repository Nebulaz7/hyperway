import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, name, metadata } = body;

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const pinataJwt = process.env.PINATA_JWT;
    if (!pinataJwt) {
      return NextResponse.json({ error: "Pinata JWT not configured" }, { status: 500 });
    }

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: name || "hyperway-job-spec.json",
          ...(metadata && Object.keys(metadata).length > 0 ? { keyvalues: metadata } : {})
        },
      }),
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
      name: name,
    });
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
