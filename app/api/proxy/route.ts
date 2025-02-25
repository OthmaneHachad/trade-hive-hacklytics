import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const API_URL = "https://api.langflow.astra.datastax.com/lf/4d7b5477-24e6-43d5-a8e1-84333771db31/api/v1/run/2b5a68d0-a897-49f3-81b4-370801620635?stream=false";

    console.log("🔵 Forwarding request to Langflow API:", API_URL);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LANGFLOW_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("❌ Langflow API Error:", response.statusText);
      return new Response(JSON.stringify({ error: "Langflow request failed", status: response.status }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("✅ Langflow Response:", data);

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Proxy Request Error:", error);
    return new Response(JSON.stringify({ error: "Proxy request failed", details: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}