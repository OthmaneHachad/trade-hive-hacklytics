import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart } from "lucide-react"

export default function StatsPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <BarChart className="mr-2" />
            TradeHive Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profits" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profits">Profits</TabsTrigger>
              <TabsTrigger value="friends">Friends&apos; Contributions</TabsTrigger>
            </TabsList>
            <TabsContent value="profits">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock</TableHead>
                    <TableHead>Buy Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>AAPL</TableCell>
                    <TableCell>$150</TableCell>
                    <TableCell>$175</TableCell>
                    <TableCell className="text-green-600">$25</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GOOGL</TableCell>
                    <TableCell>$2800</TableCell>
                    <TableCell>$2950</TableCell>
                    <TableCell className="text-green-600">$150</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TSLA</TableCell>
                    <TableCell>$900</TableCell>
                    <TableCell>$850</TableCell>
                    <TableCell className="text-red-600">-$50</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="friends">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Friend</TableHead>
                    <TableHead>Contribution</TableHead>
                    <TableHead>Top Stock Pick</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Alice</TableCell>
                    <TableCell>$500</TableCell>
                    <TableCell>NVDA</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bob</TableCell>
                    <TableCell>$350</TableCell>
                    <TableCell>AMZN</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Charlie</TableCell>
                    <TableCell>$200</TableCell>
                    <TableCell>META</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

