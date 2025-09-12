"use client"

import dynamic from "next/dynamic"
import type { Map as LeafletMap } from "leaflet"
import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Lazy-load react-leaflet on client only
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false })
const Rectangle = dynamic(() => import("react-leaflet").then(m => m.Rectangle), { ssr: false })

type StatusLevel = "Aman" | "Waspada" | "Bahaya"

type FloodEvent = {
  id: string
  name: string
  wilayah: string
  lat: number
  lng: number
  status: StatusLevel
  heightCm: number
  reports: number
  photo?: string
  updatedAt: string // ISO
}

type Posko = { id: string; name: string; lat: number; lng: number; capacity: number }
type Sensor = { id: string; name: string; lat: number; lng: number; lastHeight: number; updatedAt: string }
type Report = { id: string; title: string; lat: number; lng: number; photo?: string; time: string }

type RainCell = { id: string; bounds: [[number, number], [number, number]]; intensity: number }
type HeatPoint = { lat: number; lng: number; count: number; name?: string }

const center = { lat: -6.2, lng: 106.85 }

// Mock data
const floodEvents: FloodEvent[] = [
  { id: "f1", name: "Sungai Ciliwung", wilayah: "Jakarta Pusat", lat: -6.2, lng: 106.84, status: "Waspada", heightCm: 65, reports: 8, photo: "/flood1.jpg", updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "f2", name: "Kali Sunter", wilayah: "Jakarta Utara", lat: -6.12, lng: 106.77, status: "Bahaya", heightCm: 110, reports: 15, photo: "/flood2.jpg", updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: "f3", name: "Pesanggrahan", wilayah: "Jakarta Selatan", lat: -6.26, lng: 106.81, status: "Aman", heightCm: 25, reports: 3, photo: "/flood3.jpg", updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString() },
]

const poskoList: Posko[] = [
  { id: "p1", name: "Posko Cawang", lat: -6.24, lng: 106.87, capacity: 120 },
  { id: "p2", name: "Posko Manggarai", lat: -6.21, lng: 106.85, capacity: 90 },
]

const sensors: Sensor[] = [
  { id: "s1", name: "Sensor Ciliwung-01", lat: -6.205, lng: 106.845, lastHeight: 68, updatedAt: new Date().toISOString() },
  { id: "s2", name: "Sensor Sunter-02", lat: -6.125, lng: 106.775, lastHeight: 98, updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
]

const reports: Report[] = [
  { id: "r1", title: "Rumah tergenang 20cm", lat: -6.215, lng: 106.83, photo: "/flood.jpg", time: new Date().toISOString() },
  { id: "r2", title: "Jalan tidak bisa dilewati", lat: -6.175, lng: 106.82, photo: "/flood4.jpg", time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
]

const evacRoutes: Array<[number, number][]> = [
  [
    [-6.205, 106.84],
    [-6.21, 106.85],
    [-6.22, 106.86],
  ],
  [
    [-6.13, 106.77],
    [-6.14, 106.78],
    [-6.15, 106.79],
  ],
]

const rainCells: RainCell[] = [
  { id: "rc1", bounds: [[-6.28, 106.80], [-6.24, 106.86]], intensity: 0.7 },
  { id: "rc2", bounds: [[-6.20, 106.79], [-6.16, 106.85]], intensity: 0.4 },
  { id: "rc3", bounds: [[-6.14, 106.82], [-6.10, 106.88]], intensity: 0.85 },
]

const heatPoints: HeatPoint[] = [
  { lat: -6.2009, lng: 106.8451, count: 42, name: "Jakarta Pusat" },
  { lat: -6.1214, lng: 106.7741, count: 27, name: "Jakarta Utara" },
  { lat: -6.2615, lng: 106.8106, count: 18, name: "Jakarta Selatan" },
  { lat: -6.1745, lng: 106.8227, count: 12, name: "Monas" },
  { lat: -6.3054, lng: 106.8889, count: 8, name: "Cawang" },
]

function statusColor(status: StatusLevel) {
  if (status === "Aman") return "#16a34a" // green-600
  if (status === "Waspada") return "#f59e0b" // amber-500
  return "#ef4444" // red-500
}

function rainColor(intensity: number) {
  // 0 -> light blue, 1 -> deep blue
  const t = Math.max(0, Math.min(1, intensity))
  const r = Math.round(50 * (1 - t))
  const g = Math.round(120 + 80 * (1 - t))
  const b = Math.round(200 + 30 * t)
  return `rgba(${r}, ${g}, ${b}, ${0.35 + 0.25 * t})`
}

function heatColor(n: number) {
  const t = Math.min(1, n / 40)
  const r = Math.round(255 * t)
  const g = Math.round(120 * (1 - t))
  const b = Math.round(200 * (1 - t))
  return `rgba(${r}, ${g}, ${b}, 0.55)`
}

function hoursAgoLabel(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.round(diff / (60 * 60 * 1000))
  if (h <= 0) return "baru saja"
  if (h < 24) return `${h} jam lalu`
  const d = Math.round(h / 24)
  return `${d} hari lalu`
}

export function MapMonitoring() {
  const mapRef = React.useRef<LeafletMap | null>(null)
  // Ensure Leaflet CSS is present
  React.useEffect(() => {
    const id = "leaflet-css"
    if (!document.getElementById(id)) {
      const link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)
    }
  }, [])

  // Filters
  const wilayahList = React.useMemo(() => ["Semua", ...Array.from(new Set(floodEvents.map(f => f.wilayah)))], [])
  const [wilayah, setWilayah] = React.useState<string>("Semua")
  const [status, setStatus] = React.useState<"Semua" | StatusLevel>("Semua")
  const [timeRange, setTimeRange] = React.useState<"24h" | "7d" | "30d">("24h")

  // Layers
  const [layers, setLayers] = React.useState({
    banjir: true,
    curah: true,
    posko: true,
    jalur: true,
    heat: true,
    sensor: true,
    laporan: true,
  })

  // Search
  const [query, setQuery] = React.useState("")
  const [panTo, setPanTo] = React.useState<{ lat: number; lng: number } | null>(null)

  React.useEffect(() => {
    if (panTo && mapRef.current) {
      mapRef.current.flyTo(panTo, 14, { duration: 0.8 })
    }
  }, [panTo])

  const handleSearch = async () => {
    const q = query.trim()
    if (!q) return
    // Try local known matches first
    const known: Record<string, { lat: number; lng: number }> = {
      "jakarta pusat": { lat: -6.2, lng: 106.845 },
      monas: { lat: -6.1754, lng: 106.8272 },
      cawang: { lat: -6.2486, lng: 106.8691 },
    }
    const key = q.toLowerCase()
    if (known[key]) {
      setPanTo(known[key])
      return
    }
    // Fallback to Nominatim (client-only). If blocked, silently ignore.
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`)
      const json = await res.json()
      if (json && json[0]) {
        setPanTo({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) })
      }
    } catch {
      // ignore
    }
  }

  // Apply filters
  const filteredFloods = floodEvents.filter(f => {
    if (wilayah !== "Semua" && f.wilayah !== wilayah) return false
    if (status !== "Semua" && f.status !== status) return false
    const diff = Date.now() - new Date(f.updatedAt).getTime()
    const within = timeRange === "24h" ? 24 : timeRange === "7d" ? 24 * 7 : 24 * 30
    if (diff > within * 60 * 60 * 1000) return false
    return true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peta Monitoring Banjir</CardTitle>
        <CardDescription>Layer banjir, curah hujan, posko, jalur evakuasi, heatmap, dan laporan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Controls */}
        <div className="grid grid-cols-1 items-end gap-3 rounded-xl border p-3 md:grid-cols-6 lg:grid-cols-12">
          <div className="space-y-1 md:col-span-2 lg:col-span-2">
            <Label>Wilayah</Label>
            <Select value={wilayah} onValueChange={setWilayah}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih wilayah" />
              </SelectTrigger>
              <SelectContent>
                {wilayahList.map(w => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2 lg:col-span-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Semua", "Aman", "Waspada", "Bahaya"] as const).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2 lg:col-span-2">
            <Label>Waktu</Label>
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 jam</SelectItem>
                <SelectItem value="7d">7 hari</SelectItem>
                <SelectItem value="30d">30 hari</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-6 lg:col-span-6">
            <Label>Cari lokasi/alamat</Label>
            <div className="flex gap-2">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: Monas, Jakarta Pusat" />
              <Button onClick={handleSearch}>Cari</Button>
            </div>
          </div>
          <div className="space-y-1 md:col-span-6 lg:col-span-12">
            <Label>Layer</Label>
            <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3 lg:grid-cols-6">
              {(
                [
                  ["banjir", "Banjir"],
                  ["curah", "Curah Hujan"],
                  ["posko", "Posko"],
                  ["jalur", "Jalur Evakuasi"],
                  ["heat", "Heatmap"],
                  ["sensor", "Sensor"],
                  ["laporan", "Laporan"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="inline-flex items-center gap-2">
                  <Checkbox checked={(layers as any)[key]} onCheckedChange={(v) => setLayers(prev => ({ ...prev, [key]: Boolean(v) }))} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Map */}
        <div className="h-[540px] w-full overflow-hidden rounded-lg">
          <MapContainer
            center={center}
            zoom={11}
            scrollWheelZoom
            className="h-full w-full"
            ref={(instance) => {
              // instance is the Leaflet Map
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              mapRef.current = (instance as any) ?? null
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {/* Flood markers */}
            {layers.banjir && filteredFloods.map(f => (
              <CircleMarker key={f.id} center={{ lat: f.lat, lng: f.lng }} radius={12} pathOptions={{ color: statusColor(f.status), fillColor: statusColor(f.status), fillOpacity: 0.75 }}>
                <Popup>
                  <div className="space-y-2">
                    <div className="font-semibold">{f.name} — <span style={{ color: statusColor(f.status) }}>{f.status}</span></div>
                    <div className="text-sm text-muted-foreground">Wilayah: {f.wilayah}</div>
                    <div className="text-sm">Ketinggian air: <b>{f.heightCm} cm</b></div>
                    <div className="text-sm">Laporan: <b>{f.reports}</b></div>
                    <div className="text-xs text-muted-foreground">Update: {hoursAgoLabel(f.updatedAt)}</div>
                    {f.photo ? <img src={f.photo} alt="foto" className="mt-1 h-28 w-full rounded object-cover" /> : null}
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Sensors */}
            {layers.sensor && sensors.map(s => (
              <CircleMarker key={s.id} center={{ lat: s.lat, lng: s.lng }} radius={8} pathOptions={{ color: "#64748b", fillColor: "#94a3b8", fillOpacity: 0.7 }}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm">Ketinggian terakhir: {s.lastHeight} cm</div>
                    <div className="text-xs text-muted-foreground">Update: {hoursAgoLabel(s.updatedAt)}</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Reports */}
            {layers.laporan && reports.map(r => (
              <CircleMarker key={r.id} center={{ lat: r.lat, lng: r.lng }} radius={8} pathOptions={{ color: "#9333ea", fillColor: "#a855f7", fillOpacity: 0.75 }}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-xs text-muted-foreground">Waktu: {hoursAgoLabel(r.time)}</div>
                    {r.photo ? <img src={r.photo} alt="laporan" className="mt-1 h-28 w-full rounded object-cover" /> : null}
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Posko */}
            {layers.posko && poskoList.map(p => (
              <CircleMarker key={p.id} center={{ lat: p.lat, lng: p.lng }} radius={9} pathOptions={{ color: "#059669", fillColor: "#10b981", fillOpacity: 0.75 }}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm">Kapasitas: {p.capacity} orang</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* Evacuation routes */}
            {layers.jalur && evacRoutes.map((line, idx) => (
              <Polyline key={idx} positions={line} pathOptions={{ color: "#0ea5e9", weight: 4, opacity: 0.8 }} />
            ))}

            {/* Rainfall overlay (mock rectangles) */}
            {layers.curah && rainCells.map(cell => (
              <Rectangle key={cell.id} bounds={cell.bounds} pathOptions={{ color: rainColor(cell.intensity), fillColor: rainColor(cell.intensity), fillOpacity: 0.5, weight: 1 }} />
            ))}

            {/* Heatmap mimic */}
            {layers.heat && heatPoints.map((p, idx) => (
              <CircleMarker key={idx} center={{ lat: p.lat, lng: p.lng }} radius={Math.max(10, Math.min(28, p.count))} pathOptions={{ color: heatColor(p.count), fillColor: heatColor(p.count), fillOpacity: 0.6 }}>
                <Popup>
                  <div className="text-sm">{p.name ?? "Lokasi"}: {p.count} kejadian</div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
