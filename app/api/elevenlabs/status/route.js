import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() || "";
  const configured = Boolean(agentId);

  return NextResponse.json({
    configured,
    agentIdPrefix: agentId ? agentId.slice(0, 12) : null,
  });
}
