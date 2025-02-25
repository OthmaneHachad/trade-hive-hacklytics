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
    { role: "ai", content: "Welcome to TradeHive! Streamed responses!! I'm your AI trading assistant. How can I help you with trading today?" },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      const eventSource = new EventSource("/api/proxy");

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

      eventSource.onerror = () => {
        eventSource.close();
        setLoading(false);
        console.error("Error in streaming response");
      };

      eventSource.addEventListener("close", () => {
        eventSource.close();
        setLoading(false);
      });
    } catch (error) {
      console.error("Error:", error);
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