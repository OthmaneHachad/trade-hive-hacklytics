import { NextRequest, NextResponse } from "next/server";

interface LangflowResponse {
  session_id: string;
  outputs: Array<{
    inputs: { input_value: string };
    outputs: Array<{
      results: {
        text: {
          text_key: string;
          data: { text: string };
        };
      };
    }>;
  }>;
}

export async function POST(req: NextRequest) {
  const body: Record<string, unknown> = await req.json();
  const API_URL =
    "https://api.langflow.astra.datastax.com/lf/4d7b5477-24e6-43d5-a8e1-84333771db31/api/v1/run/2b5a68d0-a897-49f3-81b4-370801620635?stream=false";

  const apiKey = process.env.LANGFLOW_API_KEY;

  if (!apiKey) {
    console.error("Error: LANGFLOW_API_KEY is missing in environment variables.");
    return NextResponse.json({ error: "Server misconfiguration: Missing API key" }, { status: 500 });
  }

  try {
    // Set up a timeout mechanism (abort after 9s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal, // Attach timeout signal
    });

    clearTimeout(timeout); // Clear timeout if request succeeds

    // Log response headers for debugging
    console.log("Response Headers:", response.headers);
    const contentType = response.headers.get("content-type") || "";

    // Ensure response is valid JSON
    if (!contentType.includes("json")) {
      const textResponse = await response.text(); // Read as text
      console.error("Non-JSON response from Langflow:", textResponse);
      return NextResponse.json(
        { error: "Invalid response from Langflow", details: textResponse },
        { status: response.status }
      );
    }

    // Parse JSON response strictly
    const data: LangflowResponse = await response.json();
    console.log("Full Response Data:", JSON.stringify(data, null, 2)); // Pretty-print JSON for debugging

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("Error: Langflow API request timed out.");
        return NextResponse.json({ error: "Langflow request timed out" }, { status: 504 });
      }
      console.error("Error in Proxy:", error.message);
      return NextResponse.json(
        { error: "Proxy request failed", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Proxy request failed", details: "Unknown error occurred" },
      { status: 500 }
    );
  }
}