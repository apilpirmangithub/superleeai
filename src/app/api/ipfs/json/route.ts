import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata-web3';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    if (!json.data) {
      return NextResponse.json(
        { error: 'No JSON data provided' },
        { status: 400 }
      );
    }

    // Upload JSON to Pinata
    const upload = await pinata.upload.json(json.data);

    return NextResponse.json({
      success: true,
      cid: upload.IpfsHash,
      url: `https://${process.env.PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`,
    });

  } catch (error) {
    console.error('JSON upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}
```
