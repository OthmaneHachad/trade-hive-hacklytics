"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

interface StrategyCard {
  id: number
  title: string
  description: string
  pros: string[]
  cons: string[]
}

const strategyCards: StrategyCard[] = [
  {
    id: 1,
    title: "Momentum Trading",
    description:
      "A short-term approach that seeks to profit from stocks moving strongly in one direction, assuming these price trends will continue. Momentum traders often rely on technical indicators (like moving averages or volume spikes) to quickly identify and enter trades. Because momentum can reverse suddenly, strict risk management and stop-loss orders are key.",
    pros: ["Rapid gains if trend continues", "Clear signals", "Potential for significant profits in bull markets"],
    cons: ["High volatility risk", "False breakouts", "Requires quick decision making"],
  },
  {
    id: 2,
    title: "Value Investing",
    description:
      "A longer-term strategy that focuses on buying stocks believed to be trading below their intrinsic worth. Value investors analyze fundamental metrics (like P/E ratios, dividend yields, or cash flow) to find undervalued companies and wait patiently for the market to correct the mispricing. This approach can require a strong stomach for short-term volatility and thorough research into company fundamentals.",
    pros: [
      "Potential to buy quality assets at a discount",
      "Longer-term stability",
      "Less affected by market volatility",
    ],
    cons: ["Stocks can stay undervalued for a long time", "Requires patience", "Extensive research needed"],
  },
  {
    id: 3,
    title: "Swing Trading",
    description:
      'A medium-term method aiming to capture price "swings" in a stock over a few days to several weeks. Swing traders combine technical analysis (support/resistance levels, candlestick patterns) and sometimes news events to time entries and exits. While less intense than day trading, swing trading still demands consistent monitoring of positions and disciplined stop-losses to manage risk.',
    pros: ["Capitalize on short-term volatility", "Less stress than day trading", "Flexible time commitment"],
    cons: ["Requires consistent monitoring", "Risk of overnight news impacting price", "Can miss longer-term trends"],
  },
  {
    id: 4,
    title: "Options Trading",
    description:
      "The practice of buying or selling contracts that give the right (but not obligation) to buy (call) or sell (put) a stock at a specific price before expiration. Options can amplify gains if the underlying stock moves favorably, or hedge against losses if used strategically. However, they add complexity—time decay, implied volatility, and the Greeks (Delta, Gamma, Theta, Vega) all influence potential outcomes, so careful risk management is essential.",
    pros: [
      "Leverage, hedging, flexible strategies",
      "Limited downside risk (for buyers)",
      "Potential for high returns",
    ],
    cons: ["Complex mechanics (time decay, implied volatility)", "Can expire worthless", "Requires advanced knowledge"],
  },
]

function FlipCard({ card }: { card: StrategyCard }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="flip-card cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-front">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-auto max-h-[360px]">
              <p className="mb-4 mt-2">{card.description}</p>
            </CardContent>
          </Card>
        </div>
        <div className="flip-card-back">
          <Card className="h-full bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Pros:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {card.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-red-400 font-semibold mb-2">Cons:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {card.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DocumentationPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <BookOpen className="mr-2" />
            Trading Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategyCards.map((card) => (
              <FlipCard key={card.id} card={card} />
            ))}
            <div className="col-span-1 md:col-span-2">
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

