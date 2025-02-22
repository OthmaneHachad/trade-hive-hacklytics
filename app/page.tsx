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
      content: "Welcome to TradeHive! I'm your AI trading assistant. How can I help you with trading today?",
    },
  ])
  const [input, setInput] = useState("")

  const handleSubmit = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }])
      // Here you would typically call an API to get the AI's response
      // For now, we'll just provide a generic response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "Thank you for your message. I'm processing your request and will respond shortly with relevant trading information or advice.",
          },
        ])
      }, 500)
      setInput("")
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
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-grow"
            />
            <Button onClick={handleSubmit} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

