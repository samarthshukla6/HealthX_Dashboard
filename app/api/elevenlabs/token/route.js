import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    const agentId = process.env.ELEVENLABS_AGENT_ID?.trim();

    if (!apiKey) {
      throw new Error("Missing ELEVENLABS_API_KEY.");
    }
    if (!agentId) {
      throw new Error("Missing ELEVENLABS_AGENT_ID.");
    }

    const elevenlabs = new ElevenLabsClient({ apiKey });
    const response = await elevenlabs.conversationalAi.conversations.getWebrtcToken({
      agentId,
    });

    return NextResponse.json({ token: response.token });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Failed to create a token.";
    return NextResponse.json(
      { error: "Unable to start a voice conversation.", details },
      { status: 500 }
    );
  }
}
