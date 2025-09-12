"use client"

import { Pie, PieChart, Cell, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { name: "Jalan", value: 32 },
  { name: "Rumah", value: 46 },
  { name: "Fasum", value: 18 },
  { name: "Lainnya", value: 12 },
]

const COLORS = [
  "var(--primary)",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--primary) / 0.4)",
]

const config = {
  Jalan: { label: "Jalan", color: COLORS[0] },
  Rumah: { label: "Rumah", color: COLORS[1] },
  Fasum: { label: "Fasum", color: COLORS[2] },
  Lainnya: { label: "Lainnya", color: COLORS[3] },
} satisfies ChartConfig

export function ChartPieReports() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategori Laporan</CardTitle>
        <CardDescription>Distribusi laporan banjir</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <ChartContainer config={config} className="aspect-[16/10] w-full">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} cx="50%" cy="50%">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
