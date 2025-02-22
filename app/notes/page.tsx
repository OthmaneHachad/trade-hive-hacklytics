import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PenLine } from "lucide-react"

export default function NotesPage() {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-2xl">
          <PenLine className="mr-2" />
          Trading Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Take notes on trading strategies, stock data, market trends, etc."
          className="min-h-[60vh] mb-4"
        />
        <div className="flex justify-end">
          <Button>Save Notes</Button>
        </div>
      </CardContent>
    </Card>
  )
}

