"use client"

import dynamic from "next/dynamic"
import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Lazy-load react-leaflet on client only
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false })
const Tooltip = dynamic(() => import("react-leaflet").then(m => m.Tooltip), { ssr: false })

type FloodPoint = { lat: number; lng: number; count: number; name?: string }

// Mock frequent flood areas
const points: FloodPoint[] = [
  { lat: -6.2009, lng: 106.8451, count: 42, name: "Jakarta Pusat" },
  { lat: -6.1214, lng: 106.7741, count: 27, name: "Jakarta Utara" },
  { lat: -6.2615, lng: 106.8106, count: 18, name: "Jakarta Selatan" },
  { lat: -6.1745, lng: 106.8227, count: 12, name: "Monas" },
  { lat: -6.3054, lng: 106.8889, count: 8, name: "Cawang" },
]

function colorScale(n: number) {
  // blue -> red
  const t = Math.min(1, n / 40)
  const r = Math.round(255 * t)
  const g = Math.round(120 * (1 - t))
  const b = Math.round(200 * (1 - t))
  return `rgba(${r}, ${g}, ${b}, 0.55)`
}

export function MapHeatFlood() {
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

  const center = { lat: -6.2, lng: 106.85 }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap Area Rawan Banjir</CardTitle>
        <CardDescription>Indikasi frekuensi kejadian pada peta</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <div className="h-[340px] w-full overflow-hidden rounded-lg">
          <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map((p, idx) => (
              <CircleMarker
                key={idx}
                center={{ lat: p.lat, lng: p.lng }}
                radius={Math.max(10, Math.min(28, p.count))}
                pathOptions={{ color: colorScale(p.count), fillColor: colorScale(p.count), fillOpacity: 0.6 }}
              >
                <Tooltip>{p.name ?? "Lokasi"}: {p.count}x</Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
