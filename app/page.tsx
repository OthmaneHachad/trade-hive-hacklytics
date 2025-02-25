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

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Welcome to TradeHive! I'm your AI trading assistant. How can I help you?" },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      console.log("🔵 Sending user input...");
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value: input,
          output_type: "chat",
          input_type: "chat",
          tweaks: {},
        }),
      });

      const data = await response.json();
      if (!data.session_id) throw new Error("❌ Failed to get session_id");

      console.log("✅ Received session_id:", data.session_id);
      console.log("🔵 Connecting to SSE...");

      // Step 2: Connect to SSE Stream
      const eventSource = new EventSource(`/api/proxy?session_id=${data.session_id}`);

      let aiResponse = "";

      eventSource.onmessage = (event) => {
        aiResponse += event.data;
        setMessages((prev) => {
          const updatedMessages = [...prev];
          if (updatedMessages[updatedMessages.length - 1].role === "ai") {
            updatedMessages[updatedMessages.length - 1].content = aiResponse;
          } else {
            updatedMessages.push({ role: "ai", content: aiResponse });
          }
          return [...updatedMessages];
        });
      };

      eventSource.onerror = (error) => {
        console.error("❌ SSE Connection Error:", error);
        eventSource.close();
        setLoading(false);
        setMessages((prev) => [...prev, { role: "ai", content: "Error fetching AI response." }]);
      };

      eventSource.addEventListener("close", () => {
        console.log("✅ SSE Connection Closed");
        eventSource.close();
        setLoading(false);
      });
    } catch (error) {
      console.error("❌ Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Error fetching AI response." }]);
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
            <Input placeholder="Ask about trading..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} className="flex-grow" disabled={loading} />
            <Button onClick={handleSubmit} size="icon" disabled={loading}>
              {loading ? "..." : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}