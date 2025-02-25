import { NextRequest, NextResponse } from "next/server";

const LANGFLOW_URL = "https://api.langflow.astra.datastax.com/lf/4d7b5477-24e6-43d5-a8e1-84333771db31/api/v1/run/2b5a68d0-a897-49f3-81b4-370801620635";

// ✅ STEP 1: Send User Input & Retrieve `session_id`
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔵 Sending request to Langflow:", body);

    const response = await fetch(`${LANGFLOW_URL}?stream=true`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LANGFLOW_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("❌ Langflow API Error:", await response.text());
      return NextResponse.json({ error: "Langflow request failed" }, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ Received session_id:", data.session_id);
    return NextResponse.json({ session_id: data.session_id }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ STEP 2: Stream AI Response (SSE)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    console.error("❌ Missing session_id in GET request");
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const streamUrl = `${LANGFLOW_URL}/${sessionId}/stream`;
    console.log("🔵 Connecting to stream:", streamUrl);

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
      return NextResponse.json({ error: "No stream available" }, { status: 500 });
    }

    // ✅ Use ReadableStream to handle streaming properly
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("❌ Streaming Error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("❌ Error in GET:", error);
    return NextResponse.json({ error: "Streaming failed" }, { status: 500 });
  }
}