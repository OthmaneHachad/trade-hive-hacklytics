import { NextRequest } from "next/server";

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    console.error("❌ Missing session_id in GET request");
    return new Response(JSON.stringify({ error: "Missing session ID" }), { status: 400 });
  }

  try {
    const streamUrl = `https://api.langflow.astra.datastax.com/lf/${sessionId}/stream`;
    console.log("🔵 Connecting to Langflow SSE:", streamUrl);

    const response = await fetch(streamUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.LANGFLOW_API_KEY}`,
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Accept: "text/event-stream",
      },
    });

    if (!response.body) {
      console.error("❌ No response body received from Langflow");
      return new Response(JSON.stringify({ error: "No stream available" }), { status: 500 });
    }

    // ✅ Return the raw SSE response from Langflow
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("❌ Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: "Streaming failed" }), { status: 500 });
  }
}