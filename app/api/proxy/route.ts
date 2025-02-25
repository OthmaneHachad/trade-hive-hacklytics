import { NextRequest, NextResponse } from "next/server";

const LANGFLOW_URL = "https://api.langflow.astra.datastax.com/lf/4d7b5477-24e6-43d5-a8e1-84333771db31/api/v1/run/2b5a68d0-a897-49f3-81b4-370801620635";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Get user input
    const response = await fetch(`${LANGFLOW_URL}?stream=true`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LANGFLOW_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // If Langflow starts streaming, return the session ID
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ session_id: data.session_id }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to initiate Langflow session" }, { status: response.status });
    }
  } catch (error) {
    console.error("Error sending request to Langflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET request for streaming response
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const streamUrl = `${LANGFLOW_URL}/${sessionId}/stream`;
    const response = await fetch(streamUrl, {
      headers: {
        Authorization: `Bearer ${process.env.LANGFLOW_API_KEY}`,
      },
    });

    if (!response.body) {
      return NextResponse.json({ error: "No response body received" }, { status: 500 });
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Streaming Error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in streaming response:", error);
    return NextResponse.json({ error: "Failed to fetch streamed response" }, { status: 500 });
  }
}