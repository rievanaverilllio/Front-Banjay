"use client"

import * as React from "react"
import { AppSidebar } from "@/components/section/admin/app-sidebar"
import { SiteHeader } from "@/components/section/admin/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Bar, BarChart, Area, AreaChart, ResponsiveContainer } from "recharts"

type Sensor = {
  id: string
  name: string
  wilayah: string
  status: "aktif" | "offline"
}

type RainRecord = {
  id: string
  sensorId: string
  sensorName: string
  wilayah: string
  time: string // ISO
  mm: number
  status: "aktif" | "offline"
}

const sensors: Sensor[] = [
  { id: "s1", name: "Hujan - Cawang", wilayah: "Jakarta Timur", status: "aktif" },
  { id: "s2", name: "Hujan - Manggarai", wilayah: "Jakarta Selatan", status: "aktif" },
  { id: "s3", name: "Hujan - Sunter", wilayah: "Jakarta Utara", status: "offline" },
]

// Mock daily records for last 30 days for charts
function genDaily(days: number) {
  const arr: { date: string; mm: number; wilayah: string }[] = []
  const wilayah = ["Jakarta Pusat", "Jakarta Utara", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur"]
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const w = wilayah[i % wilayah.length]
    arr.push({ date: d.toISOString().slice(0, 10), mm: Math.max(0, Math.round(5 + Math.sin(i / 3) * 10 + (Math.random() * 8 - 4))), wilayah: w })
  }
  return arr
}

const daily30 = genDaily(30)

// Table mock records (latest first)
const now = new Date()
const records: RainRecord[] = Array.from({ length: 50 }).map((_, idx) => {
  const s = sensors[idx % sensors.length]
  const t = new Date(now.getTime() - idx * 60 * 60 * 1000)
  return {
    id: `r${idx}`,
    sensorId: s.id,
    sensorName: s.name,
    wilayah: s.wilayah,
    time: t.toISOString(),
    mm: Math.max(0, Math.round(2 + Math.random() * 25)),
    status: s.status,
  }
}).sort((a, b) => (a.time < b.time ? 1 : -1))

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}

function avgToday(recs: RainRecord[]) {
  const today = new Date()
  const dd = today.toISOString().slice(0, 10)
  const f = recs.filter(r => r.time.slice(0, 10) === dd)
  const avg = f.length ? f.reduce((s, r) => s + r.mm, 0) / f.length : 0
  return Math.round(avg)
}

function sumWeek(recs: RainRecord[]) {
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000
  const f = recs.filter(r => new Date(r.time).getTime() >= since)
  return f.reduce((s, r) => s + r.mm, 0)
}

function topWilayah(recs: RainRecord[]): { w: string; v: number } | null {
  const m = new Map<string, number>()
  recs.forEach(r => m.set(r.wilayah, (m.get(r.wilayah) ?? 0) + r.mm))
  let best: { w: string; v: number } | null = null
  m.forEach((v, w) => { if (!best || v > best.v) best = { w, v } })
  return best
}

function toWeekly(arr: { date: string; mm: number }[]) {
  const out: { date: string; mm: number }[] = []
  for (let i = 0; i < arr.length; i += 7) {
    const slice = arr.slice(i, i + 7)
    out.push({ date: slice[0].date, mm: Math.round(slice.reduce((s, r) => s + r.mm, 0)) })
  }
  return out
}

function toMonthly(arr: { date: string; mm: number }[]) {
  const m: Record<string, number> = {}
  arr.forEach(a => { m[a.date.slice(0, 7)] = (m[a.date.slice(0, 7)] ?? 0) + a.mm })
  return Object.entries(m).map(([k, v]) => ({ date: k, mm: Math.round(v) }))
}

function exportCSV(rows: RainRecord[]) {
  const headers = ["id", "sensor", "wilayah", "time", "mm", "status"]
  const lines = [headers.join(","), ...rows.map(r => [r.id, r.sensorName, r.wilayah, r.time, r.mm, r.status].join(","))]
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `data-curah-hujan-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Page() {
  const [search, setSearch] = React.useState("")
  const [wilayah, setWilayah] = React.useState<string>("Semua")
  const [range, setRange] = React.useState<"7d" | "30d" | "90d">("7d")
  const [agg, setAgg] = React.useState<"daily" | "weekly" | "monthly">("daily")
  const [sort, setSort] = React.useState<"terbaru" | "tertinggi" | "terendah">("terbaru")
  const [status, setStatus] = React.useState<"Semua" | "aktif" | "offline">("Semua")

  const wilayahList = React.useMemo(() => ["Semua", ...Array.from(new Set(sensors.map(s => s.wilayah)))], [])

  // Filtered table rows
  const rows = React.useMemo(() => {
    let r = records.slice()
    if (search) r = r.filter(x => x.sensorName.toLowerCase().includes(search.toLowerCase()))
    if (wilayah !== "Semua") r = r.filter(x => x.wilayah === wilayah)
    if (status !== "Semua") r = r.filter(x => x.status === status)
    if (sort === "terbaru") r.sort((a, b) => (a.time < b.time ? 1 : -1))
    if (sort === "tertinggi") r.sort((a, b) => b.mm - a.mm)
    if (sort === "terendah") r.sort((a, b) => a.mm - b.mm)
    return r
  }, [search, wilayah, status, sort])

  // Chart data based on range+agg
  const seriesBase = React.useMemo(() => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const arr = genDaily(days)
    if (agg === "weekly") return toWeekly(arr)
    if (agg === "monthly") return toMonthly(arr)
    return arr
  }, [range, agg])

  const barByWilayah = React.useMemo(() => {
    const m = new Map<string, number>()
    daily30.forEach(d => m.set(d.wilayah, (m.get(d.wilayah) ?? 0) + d.mm))
    return Array.from(m.entries()).map(([wilayah, total]) => ({ wilayah, total }))
  }, [])

  const avg = avgToday(records)
  const weekly = sumWeek(records)
  const activeSensors = sensors.filter(s => s.status === "aktif").length
  const top = topWilayah(records)
  const topDisplay = top ? `${top.w} (${top.v} mm)` : "-"

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Summary Cards */}
              <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rata-rata Hari Ini</CardTitle>
                    <CardDescription>mm</CardDescription>
                  </CardHeader>
                  <CardContent className="text-3xl font-semibold">{avg} mm</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Minggu Ini</CardTitle>
                    <CardDescription>akumulasi</CardDescription>
                  </CardHeader>
                  <CardContent className="text-3xl font-semibold">{weekly} mm</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Sensor Aktif</CardTitle>
                    <CardDescription>jumlah</CardDescription>
                  </CardHeader>
                  <CardContent className="text-3xl font-semibold">{activeSensors}</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Wilayah Tertinggi</CardTitle>
                    <CardDescription>akumulasi</CardDescription>
                  </CardHeader>
                  <CardContent className="text-2xl font-semibold">{topDisplay}</CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-end justify-between gap-3">
                    <div>
                      <CardTitle>Tren Curah Hujan</CardTitle>
                      <CardDescription>harian / mingguan / bulanan</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={range} onValueChange={(v) => setRange(v as any)}>
                        <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">7 hari</SelectItem>
                          <SelectItem value="30d">30 hari</SelectItem>
                          <SelectItem value="90d">90 hari</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={agg} onValueChange={(v) => setAgg(v as any)}>
                        <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Harian</SelectItem>
                          <SelectItem value="weekly">Mingguan</SelectItem>
                          <SelectItem value="monthly">Bulanan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      className="block h-[280px] w-full aspect-auto overflow-hidden overflow-x-hidden p-2"
                      style={{ aspectRatio: "auto" }}
                      config={{ rain: { label: "Hujan", color: "hsl(var(--chart-1))" } }}
                    >
                      <LineChart data={seriesBase} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Line dataKey="mm" stroke="var(--color-rain)" strokeWidth={2} dot={false} />
                        <ChartTooltip content={<ChartTooltipContent nameKey="rain" labelKey="date" />} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Per Wilayah</CardTitle>
                    <CardDescription>total 30 hari</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      className="block h-[280px] w-full aspect-auto overflow-hidden overflow-x-hidden p-2"
                      style={{ aspectRatio: "auto" }}
                      config={{ total: { label: "Total", color: "hsl(var(--chart-2))" } }}
                    >
                      <BarChart data={barByWilayah} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="wilayah" tickLine={false} axisLine={false} interval={0} angle={-18} textAnchor="end" height={50} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                        <ChartTooltip content={<ChartTooltipContent nameKey="total" labelKey="wilayah" />} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Optional Area - cumulative */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Akumulasi (Opsional)</CardTitle>
                    <CardDescription>akumulasi curah hujan range terpilih</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      className="block h-[260px] w-full aspect-auto overflow-hidden overflow-x-hidden p-2"
                      style={{ aspectRatio: "auto" }}
                      config={{ cum: { label: "Akumulasi", color: "hsl(var(--chart-3))" } }}
                    >
                      <AreaChart data={seriesBase.map((d, i, a) => ({ ...d, mm: a.slice(0, i + 1).reduce((s, r) => s + r.mm, 0) }))} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Area dataKey="mm" stroke="var(--color-cum)" fill="var(--color-cum)" fillOpacity={0.2} />
                        <ChartTooltip content={<ChartTooltipContent nameKey="cum" labelKey="date" />} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Filters + Table + Export */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Curah Hujan</CardTitle>
                    <CardDescription>rekaman pengukuran</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
                      <div className="space-y-1 md:col-span-3 lg:col-span-3">
                        <Label>Cari Lokasi Sensor</Label>
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="cth: Manggarai" />
                      </div>
                      <div className="space-y-1 md:col-span-3 lg:col-span-3">
                        <Label>Wilayah</Label>
                        <Select value={wilayah} onValueChange={setWilayah}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {wilayahList.map(w => (<SelectItem key={w} value={w}>{w}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1 md:col-span-2 lg:col-span-2">
                        <Label>Status Sensor</Label>
                        <Select value={status} onValueChange={(v)=>setStatus(v as any)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Semua">Semua</SelectItem>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1 md:col-span-2 lg:col-span-2">
                        <Label>Urutkan</Label>
                        <Select value={sort} onValueChange={(v)=>setSort(v as any)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="terbaru">Terbaru</SelectItem>
                            <SelectItem value="tertinggi">Tertinggi</SelectItem>
                            <SelectItem value="terendah">Terendah</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2 lg:col-span-2">
                        <Button variant="outline" onClick={()=>exportCSV(rows)}>Export CSV</Button>
                        <Button variant="outline" disabled>Export Excel</Button>
                        <Button variant="outline" disabled>Export PDF</Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">Lokasi Sensor</th>
                            <th className="px-3 py-2 text-left font-medium">Wilayah</th>
                            <th className="px-3 py-2 text-left font-medium">Tanggal & Waktu</th>
                            <th className="px-3 py-2 text-left font-medium">Curah Hujan (mm)</th>
                            <th className="px-3 py-2 text-left font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r) => (
                            <tr key={r.id} className="even:bg-muted/20">
                              <td className="px-3 py-2">{r.sensorName}</td>
                              <td className="px-3 py-2">{r.wilayah}</td>
                              <td className="px-3 py-2">{formatDateTime(r.time)}</td>
                              <td className="px-3 py-2 font-mono">{r.mm}</td>
                              <td className="px-3 py-2">{r.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* History & Analysis */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Histori & Analisis</CardTitle>
                    <CardDescription>ringkasan rentang 7/30 hari dan statistik ekstrem</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 text-sm font-medium">7 Hari Terakhir</div>
                      <div className="text-2xl font-semibold">{genDaily(7).reduce((s,r)=>s+r.mm,0)} mm</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 text-sm font-medium">30 Hari Terakhir</div>
                      <div className="text-2xl font-semibold">{daily30.reduce((s,r)=>s+r.mm,0)} mm</div>
                    </div>
                    <div className="rounded-lg border p-3 md:col-span-2">
                      <div className="mb-2 text-sm font-medium">Wilayah Ekstrem (Mock)</div>
                      <ul className="list-inside list-disc text-sm text-muted-foreground">
                        <li>Hujan harian tertinggi: 78 mm (Jakarta Utara)</li>
                        <li>Hujan bulanan tertinggi: 320 mm (Jakarta Selatan)</li>
                        <li>Tren musiman: puncak pada Des–Feb</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions & Management */}
              <div className="px-4 lg:px-6 pb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Aksi & Manajemen Data</CardTitle>
                    <CardDescription>khusus super admin</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 text-sm font-medium">Tambah / Edit Sensor</div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Nama sensor" />
                        <Input placeholder="Wilayah" />
                        <Select defaultValue="aktif">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button>Tambah</Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 text-sm font-medium">Upload Data Manual</div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="file" accept=".csv,.xlsx" />
                        <Button disabled>Upload</Button>
                        <div className="col-span-2 text-xs text-muted-foreground">Format: tanggal,wilayah,sensor,mm</div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3 md:col-span-2">
                      <div className="mb-2 text-sm font-medium">Download Laporan</div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={()=>exportCSV(rows)}>CSV</Button>
                        <Button variant="outline" disabled>Excel</Button>
                        <Button variant="outline" disabled>PDF</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
