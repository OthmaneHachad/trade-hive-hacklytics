import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { MessageCircle, PenLine, BarChart } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TradeHive | College Trading Platform",
  description: "A collaborative platform for college students to trade, learn, and grow together",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-primary text-primary-foreground shadow-md">
            <div className="container mx-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold trade-hive-text">TradeHive</h1>
                <span className="text-sm">College Trading Platform</span>
              </div>
              <nav>
                <ul className="flex justify-center space-x-4">
                  <li>
                    <Link href="/" className="flex items-center hover:underline">
                      <MessageCircle className="mr-2" />
                      AI Chat
                    </Link>
                  </li>
                  <li>
                    <Link href="/documentation" className="flex items-center hover:underline">
                      <PenLine className="mr-2" />
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/stats" className="flex items-center hover:underline">
                      <BarChart className="mr-2" />
                      Statistics
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main className="flex-grow container mx-auto p-4">{children}</main>
          <footer className="bg-muted text-muted-foreground text-center p-4">
            © 2023 TradeHive. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  )
}

