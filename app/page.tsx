"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send } from "lucide-react"

interface ChatMessage {
  role: "user" | "ai"
  content: string
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content: "Welcome to TradeHive! It Works!! I'm your AI trading assistant. How can I help you with trading today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim()) return

    console.log("IN Handle Submit")

    const userMessage: ChatMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      console.log("Starting querying...")
      const response = await fetch(
        "http://127.0.0.1:7860/api/v1/run/bc69e3e1-69c0-45d3-af61-2c765eb1f6a0?stream=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "sk-QCJY5zaZEbIvIDkndnif-HGfnIxvxwGnJ-fMO4ir6zE", // Replace with actual API key
          },
          body: JSON.stringify({
            input_value: input,
            output_type: "chat",
            input_type: "chat",
            tweaks: {
              "ChatOutput-TLU51": {},
              "Prompt-goeG8": {},
              "ChatInput-YJ2ru": {},
              "Agent-EOh4V": {},
              "TavilySearchComponent-RQpg1": {},
            },
          }),
        }
      )
      
      console.log("response: " + response)

      const data = await response.json()
      const aiMessage: ChatMessage = { role: "ai", content: "data:  " + data.outputs?.[0]?.outputs?.[0]?.results?.text?.data?.text }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [...prev, { role: "ai", content: "Error fetching AI response." }])
    } finally {
      setLoading(false)
    }
  }

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
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.role === "ai" ? "bg-muted" : "bg-primary text-primary-foreground ml-auto"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
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
  )
}
