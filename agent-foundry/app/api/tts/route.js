import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // ✅ Log FULL request body
    const rawBody = await req.text();
    console.log("📥 RAW REQUEST BODY:", rawBody);
    
    const requestData = JSON.parse(rawBody);
    const { text, language, voiceId } = requestData;

    console.log("🔍 PARSED REQUEST:");
    console.log("   text:", text ? `"${text.substring(0, 50)}..."` : "❌ MISSING");
    console.log("   language:", language || "❌ MISSING");
    console.log("   voiceId:", voiceId || "❌ MISSING");

    // ✅ Validate required fields
    if (!text || text.trim() === "") {
      console.error("❌ MISSING TEXT");
      return NextResponse.json(
        { 
          error: "Missing or empty text", 
          received: { text: !!text, language: !!language, voiceId: !!voiceId }
        },
        { status: 400 }
      );
    }

    if (!voiceId) {
      console.error("❌ MISSING VOICE ID");
      return NextResponse.json(
        { error: "Missing voiceId" },
        { status: 400 }
      );
    }

    // ✅ Check API key
    const apiKey = process.env.ELEVENLABS_API_KEY;
    console.log("🔑 API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "❌ MISSING");
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY not configured" },
        { status: 500 }
      );
    }

    // ✅ Call ElevenLabs
    console.log("🚀 Calling ElevenLabs...");
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    console.log("📡 ElevenLabs Response:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ElevenLabs Error Details:", errorText);
      return NextResponse.json(
        { error: `ElevenLabs failed: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    console.log("✅ SUCCESS: Audio generated", audioBuffer.byteLength, "bytes");

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error("💥 CRITICAL ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
