"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

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

class LangflowClient {
  private baseURL: string;
  private applicationToken: string;

  constructor(baseURL: string, applicationToken: string) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  async post<T>(endpoint: string, body: object, headers: Record<string, string> = { "Content-Type": "application/json" }): Promise<T> {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
    
    const url = "/api/proxy"; // Use relative URL to call the Vercel proxy
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      const responseMessage: T = await response.json();
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
      }
      return responseMessage;
    } catch (error) {
      console.error("Request Error:", error);
      throw error;
    }
  }

  async initiateSession(
    flowId: string,
    langflowId: string,
    inputValue: string,
    inputType: string = "chat",
    outputType: string = "text",
    stream: boolean = false,
    tweaks: Record<string, object> = {}
  ): Promise<LangflowResponse> {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post<LangflowResponse>(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
  }
}

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
  
      const response = await langflowClient.initiateSession(flowId, langflowId, input, "chat", "text", false, tweaks);
      
      console.log("Raw Response from Langflow:", response);
  
      // ✅ Correctly extract AI message
      // response[0].outputs[0].results["text"].data["text"]
      const aiMessage =
      response?.outputs?.[0]?.outputs?.[0]?.results?.text?.data?.text || 
        "I couldn't process your request.";
  
      setMessages((prev) => [...prev, { role: "ai", content: aiMessage }]);
    } catch (error) {
      console.error("Error:", error);
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
