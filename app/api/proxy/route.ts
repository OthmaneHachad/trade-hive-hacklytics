import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json(); // Get the request body
  const API_URL = "https://api.langflow.astra.datastax.com/lf/4d7b5477-24e6-43d5-a8e1-84333771db31/api/v1/run/2b5a68d0-a897-49f3-81b4-370801620635?stream=false";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LANGFLOW_API_KEY}`, // Store API key in Vercel environment variables
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "Proxy request failed" }, { status: 500 });
  }
}