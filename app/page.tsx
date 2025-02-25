"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

// Chat message interface
interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

// Langflow API response interface
interface LangflowResponse {
  outputs?: Array<{
    outputs?: Array<{
      results?: {
        text?: {
          text_key?: string;
          data?: { text?: string };
        };
      };
    }>;
  }>;
}

// LangflowClient class to handle API requests
class LangflowClient {
  private baseURL: string;
  private applicationToken: string;

  constructor(baseURL: string, applicationToken: string) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  async post<T>(body: object): Promise<T> {
    const url = "/api/proxy"; // Calls Vercel serverless proxy
    console.log("🔵 Sending request to Vercel Proxy:", url, body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const responseMessage: T = await response.json();
      console.log("✅ Proxy Response:", responseMessage);
      return responseMessage;
    } catch (error) {
      console.error("❌ Proxy Request Error:", error);
      throw error;
    }
  }

  async initiateSession(
    flowId: string,
    langflowId: string,
    inputValue: string,
    inputType: string = "chat",
    outputType: string = "text",
    tweaks: Record<string, object> = {}
  ): Promise<LangflowResponse> {
    return this.post<LangflowResponse>({
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks: tweaks,
    });
  }
}

// AI Chat Page Component
export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Welcome to TradeHive! It Works!! I'm your AI trading assistant. How can I help you with trading today?" },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);
  
    try {
      const langflowClient = new LangflowClient(
        "https://api.langflow.astra.datastax.com",
        process.env.NEXT_PUBLIC_LANGFLOW_API_KEY as string
      );
  
      const flowId = "2b5a68d0-a897-49f3-81b4-370801620635";
      const langflowId = "4d7b5477-24e6-43d5-a8e1-84333771db31";
      const tweaks: Record<string, object> = {
        "Prompt-PuBjq": {},
        "Agent-FiITz": {},
        "TavilySearchComponent-oesoS": {},
        "CalculatorComponent-FzyCw": {},
        "TextOutput-NJvOe": {},
        "ChatInput-f19Xt": {},
        "YahooFinanceTool-Idd2Y": {},
      };
  
      console.log("🔵 Sending user input...");
      const response = await langflowClient.initiateSession(flowId, langflowId, input, "chat", "text", tweaks);
      
      console.log("✅ Received Response from Langflow:", response);
  
      // Extract the AI-generated message
      const aiMessage =
        response.outputs?.[0]?.outputs?.[0]?.results?.text?.data?.text ||
        "I couldn't process your request.";
  
      setMessages((prev) => [...prev, { role: "ai", content: aiMessage }]);
    } catch (error) {
      console.error("❌ Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Error fetching AI response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="h-[calc(100vh-8rem)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <MessageCircle className="mr-2" />
            TradeHive AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-5rem)]">
          <ScrollArea className="flex-grow mb-4 p-4 border rounded-md">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`p-3 rounded-lg max-w-[80%] ${message.role === "ai" ? "bg-muted text-black" : "bg-white text-black border border-gray-300 ml-auto"}`}>
                  <MarkdownRenderer content={message.content} />
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Ask about trading strategies, terms, or advice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-grow"
              disabled={loading}
            />
            <Button onClick={handleSubmit} size="icon" disabled={loading}>
              {loading ? "..." : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}