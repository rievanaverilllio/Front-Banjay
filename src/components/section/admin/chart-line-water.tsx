"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Point = { date: string; level: number }

// Mock daily water level data (cm)
const dailyData: Point[] = Array.from({ length: 120 }).map((_, i) => {
  const base = 120 + Math.sin(i / 7) * 25 + (i % 13 === 0 ? 40 : 0)
  const noise = (Math.random() - 0.5) * 10
  const d = new Date()
  d.setDate(d.getDate() - (119 - i))
  const iso = d.toISOString().slice(0, 10)
  return { date: iso, level: Math.max(60, Math.round(base + noise)) }
})

function toWeekly(data: Point[]) {
  const out: Point[] = []
  for (let i = 0; i < data.length; i += 7) {
    const slice = data.slice(i, i + 7)
    const avg = Math.round(slice.reduce((s, p) => s + p.level, 0) / slice.length)
    out.push({ date: slice[slice.length - 1]?.date ?? data[i].date, level: avg })
  }
  return out
}

function toMonthly(data: Point[]) {
  const map = new Map<string, number[]>()
  for (const p of data) {
    const key = p.date.slice(0, 7)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p.level)
  }
  return Array.from(map.entries()).map(([key, arr]) => ({
    date: key + "-01",
    level: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
  }))
}

const chartConfig = {
  level: { label: "Ketinggian Air (cm)", color: "var(--primary)" },
} satisfies ChartConfig

export function ChartLineWater() {
  const isMobile = useIsMobile()
  const [range, setRange] = React.useState<"7d" | "30d" | "90d">("30d")
  const [agg, setAgg] = React.useState<"mingguan" | "bulanan">("mingguan")

  React.useEffect(() => {
    if (isMobile) setRange("7d")
  }, [isMobile])

  const filtered = React.useMemo(() => {
    const now = new Date(dailyData[dailyData.length - 1].date)
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const start = new Date(now)
    start.setDate(start.getDate() - (days - 1))
    return dailyData.filter((p) => new Date(p.date) >= start)
  }, [range])

  const data = React.useMemo(() => {
    if (agg === "mingguan") return toWeekly(filtered)
    return toMonthly(filtered)
  }, [filtered, agg])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tren Ketinggian Air Sungai</CardTitle>
        <CardDescription>
          Per {agg === "mingguan" ? "minggu" : "bulan"} dalam {range}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-2">{/* controls */}
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(v) => v && setRange(v as typeof range)}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">7 hari</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 hari</ToggleGroupItem>
            <ToggleGroupItem value="90d">90 hari</ToggleGroupItem>
          </ToggleGroup>
          <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
            <SelectTrigger className="w-36 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Rentang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 hari</SelectItem>
              <SelectItem value="30d">30 hari</SelectItem>
              <SelectItem value="90d">90 hari</SelectItem>
            </SelectContent>
          </Select>
          <Select value={agg} onValueChange={(v) => setAgg(v as typeof agg)}>
            <SelectTrigger className="w-36" size="sm">
              <SelectValue placeholder="Agregasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mingguan">Mingguan</SelectItem>
              <SelectItem value="bulanan">Bulanan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(v) => {
                const d = new Date(v)
                return d.toLocaleDateString("id-ID", { month: "short", day: "numeric" })
              }}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value as string).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Line
              type="monotone"
              dataKey="level"
              stroke="var(--color-level)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
