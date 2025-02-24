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

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LANGFLOW_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Log response headers for debugging
    console.log("Response Headers:", response.headers);
    const contentType = response.headers.get("content-type");

    // Ensure the response is valid JSON
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text(); // Read as text
      console.error("Non-JSON response from Langflow:", textResponse);
      return NextResponse.json(
        { error: "Invalid response from Langflow", details: textResponse },
        { status: response.status }
      );
    }

    // Parse JSON response strictly
    const data: LangflowResponse = await response.json();
    console.log("Full Response Data:", data); // Log full response to debug

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    if (error instanceof Error) {
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