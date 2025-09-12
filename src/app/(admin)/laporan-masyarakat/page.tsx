"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { AppSidebar } from "@/components/section/admin/app-sidebar"
import { SiteHeader } from "@/components/section/admin/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

// Lazy-load map bits
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false })

type Status = "Menunggu" | "Diverifikasi" | "Diproses" | "Selesai" | "Ditolak"

type Report = {
  id: string
  name: string
  contact?: string
  wilayah: string
  address: string
  lat: number
  lng: number
  time: string
  photos: string[]
  description: string
  depthCm?: number
  impact?: string
  status: Status
}

const mockReports: Report[] = Array.from({ length: 28 }).map((_, i) => ({
  id: `LAP-${1000 + i}`,
  name: i % 5 === 0 ? "Anonim" : ["Budi", "Sari", "Agus", "Rina"][i % 4],
  contact: i % 3 === 0 ? `08${Math.floor(100000000 + Math.random() * 899999999)}` : undefined,
  wilayah: ["Jakarta Pusat", "Jakarta Utara", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur"][i % 5],
  address: ["Jl. Merdeka No. 1", "Jl. Sudirman No. 10", "Jl. Gatot Subroto", "Jl. Panjang", "Jl. Daan Mogot"][i % 5],
  lat: -6.2 + Math.random() * 0.1 - 0.05,
  lng: 106.85 + Math.random() * 0.1 - 0.05,
  time: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
  photos: ["/flood.jpg", "/flood1.jpg", "/flood2.jpg"].slice(0, 1 + (i % 3)),
  description: "Genangan di jalan, kedalaman 20-40cm, lalu lintas tersendat.",
  depthCm: 20 + (i % 4) * 10,
  impact: ["Jalan terputus", "Rumah terendam", "Fasum terdampak"][i % 3],
  status: ["Menunggu", "Diverifikasi", "Diproses", "Selesai", "Ditolak"][i % 5] as Status,
})).sort((a, b) => (a.time < b.time ? 1 : -1))

function exportCSV(rows: Report[]) {
  const headers = ["id", "nama", "kontak", "wilayah", "alamat", "lat", "lng", "waktu", "foto", "deskripsi", "kedalaman_cm", "dampak", "status"]
  const lines = [headers.join(","), ...rows.map(r => [r.id, r.name, r.contact ?? "", r.wilayah, r.address, r.lat, r.lng, r.time, r.photos.join("|"), r.description.replace(/\n|,/g, " "), r.depthCm ?? "", r.impact ?? "", r.status].join(","))]
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `laporan-masyarakat-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Page() {
  const [data, setData] = React.useState<Report[]>(mockReports)
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<"Semua" | Status>("Semua")
  const [wilayah, setWilayah] = React.useState<string>("Semua")
  const [sort, setSort] = React.useState<"terbaru" | "terlama">("terbaru")
  const [detail, setDetail] = React.useState<Report | null>(null)

  const wilayahList = React.useMemo(() => ["Semua", ...Array.from(new Set(mockReports.map(r => r.wilayah)))], [])
  const STATUS_LIST: Status[] = React.useMemo(() => ["Menunggu", "Diverifikasi", "Diproses", "Selesai", "Ditolak"], [])
  const STATUS_FILTER: Array<"Semua" | Status> = React.useMemo(() => ["Semua", ...STATUS_LIST], [STATUS_LIST])

  const today = new Date().toISOString().slice(0, 10)
  const jumlahHariIni = data.filter(d => d.time.slice(0,10) === today).length
  const jumlahVerif = data.filter(d => d.status === "Diverifikasi").length
  const jumlahMenunggu = data.filter(d => d.status === "Menunggu").length
  const jumlahDitolak = data.filter(d => d.status === "Ditolak").length

  const filtered = React.useMemo(() => {
    let rows = data.slice()
    if (query) rows = rows.filter(r => (r.name + " " + r.address + " " + r.wilayah).toLowerCase().includes(query.toLowerCase()))
    if (status !== "Semua") rows = rows.filter(r => r.status === status)
    if (wilayah !== "Semua") rows = rows.filter(r => r.wilayah === wilayah)
    if (sort === "terbaru") rows.sort((a, b) => (a.time < b.time ? 1 : -1))
    if (sort === "terlama") rows.sort((a, b) => (a.time > b.time ? 1 : -1))
    return rows
  }, [data, query, status, wilayah, sort])

  function updateStatus(id: string, st: Status) {
    setData(prev => prev.map(r => (r.id === id ? { ...r, status: st } : r)))
  }
  function deleteReport(id: string) {
    setData(prev => prev.filter(r => r.id !== id))
  }

  // Ensure Leaflet CSS is present for the detail map
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
              {/* Summary */}
              <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Laporan Masuk (Hari Ini)</CardTitle>
                    <CardDescription>jumlah</CardDescription>
                  </CardHeader>
                  <CardContent className="text-3xl font-semibold">{jumlahHariIni}</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Sudah Diverifikasi</CardTitle>
                    <CardDescription>status</CardDescription>
                  </CardHeader>
                  <CardContent className="text-3xl font-semibold">{jumlahVerif}</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Menunggu</CardTitle>
                    <CardDescription>status</CardDescription>
                  </CardHeader>
                  <CardContent className="text-3xl font-semibold">{jumlahMenunggu}</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Ditolak</CardTitle>
                    <CardDescription>status</CardDescription>
                  </CardHeader>
                  <CardContent className="text-3xl font-semibold">{jumlahDitolak}</CardContent>
                </Card>
              </div>

              {/* Filters + table */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Laporan Masyarakat</CardTitle>
                    <CardDescription>pencarian, filter, sort, dan ekspor</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
                      <div className="space-y-1 md:col-span-4 lg:col-span-4">
                        <Label>Cari (nama / lokasi)</Label>
                        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="cth: Budi / Sudirman" />
                      </div>
                      <div className="space-y-1 md:col-span-3 lg:col-span-3">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(v)=>setStatus(v as any)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUS_FILTER.map((s) => (
                              <SelectItem key={s} value={s as any}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Label>Urutkan</Label>
                        <Select value={sort} onValueChange={(v)=>setSort(v as any)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="terbaru">Terbaru</SelectItem>
                            <SelectItem value="terlama">Terlama</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2 lg:col-span-2">
                        <Button variant="outline" onClick={()=>exportCSV(filtered)}>Export CSV</Button>
                        <Button variant="outline" disabled>Export Excel</Button>
                        <Button variant="outline" disabled>Export PDF</Button>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">ID</th>
                            <th className="px-3 py-2 text-left font-medium">Nama</th>
                            <th className="px-3 py-2 text-left font-medium">Kontak</th>
                            <th className="px-3 py-2 text-left font-medium">Lokasi</th>
                            <th className="px-3 py-2 text-left font-medium">Wilayah</th>
                            <th className="px-3 py-2 text-left font-medium">Waktu</th>
                            <th className="px-3 py-2 text-left font-medium">Bukti</th>
                            <th className="px-3 py-2 text-left font-medium">Keterangan</th>
                            <th className="px-3 py-2 text-left font-medium">Status</th>
                            <th className="px-3 py-2 text-left font-medium">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((r) => (
                            <tr key={r.id} className="even:bg-muted/20">
                              <td className="px-3 py-2 font-mono">{r.id}</td>
                              <td className="px-3 py-2">{r.name}</td>
                              <td className="px-3 py-2">{r.contact ?? "-"}</td>
                              <td className="px-3 py-2">{r.address}</td>
                              <td className="px-3 py-2">{r.wilayah}</td>
                              <td className="px-3 py-2">{new Date(r.time).toLocaleString()}</td>
                              <td className="px-3 py-2">
                                <div className="flex gap-1">
                                  {r.photos.slice(0,2).map((p, i) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img key={i} src={p} alt="foto" className="h-10 w-14 rounded object-cover" />
                                  ))}
                                </div>
                              </td>
                              <td className="px-3 py-2 max-w-[280px] truncate" title={r.description}>{r.description}</td>
                              <td className="px-3 py-2">{r.status}</td>
                              <td className="px-3 py-2">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={()=>setDetail(r)}>Detail</Button>
                                  <Select onValueChange={(v)=>updateStatus(r.id, v as Status)}>
                                    <SelectTrigger className="h-8 w-[120px]"><SelectValue placeholder="Ubah" /></SelectTrigger>
                                    <SelectContent>
                                      {STATUS_LIST.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detail Sheet */}
              <Sheet open={!!detail} onOpenChange={(o)=>!o && setDetail(null)}>
                <SheetContent side="right" className="w-full sm:max-w-xl">
                  <SheetHeader>
                    <SheetTitle>Detail Laporan</SheetTitle>
                    <SheetDescription>{detail?.id} — {detail?.name}</SheetDescription>
                  </SheetHeader>
                  {detail && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Kontak</div>
                        <div>{detail.contact ?? "-"}</div>
                      </div>
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Alamat</div>
                        <div>{detail.address}, {detail.wilayah}</div>
                      </div>
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Waktu</div>
                        <div>{new Date(detail.time).toLocaleString()}</div>
                      </div>
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Kedalaman</div>
                        <div>{detail.depthCm ? `${detail.depthCm} cm` : "-"}</div>
                      </div>
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Dampak</div>
                        <div>{detail.impact ?? "-"}</div>
                      </div>
                      <div className="grid gap-2">
                        <div className="text-sm text-muted-foreground">Deskripsi</div>
                        <div className="text-sm leading-relaxed">{detail.description}</div>
                      </div>

                      <div className="overflow-hidden rounded-lg border">
                        <div className="h-[220px] w-full">
                          <MapContainer center={{ lat: detail.lat, lng: detail.lng }} zoom={14} scrollWheelZoom className="h-full w-full">
                            <TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[detail.lat, detail.lng]} />
                          </MapContainer>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {detail.photos.map((p, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={p} alt="bukti" className="h-24 w-full rounded object-cover" />
                        ))}
                      </div>

                      <Separator />
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={()=>updateStatus(detail.id, "Diverifikasi")}>Verifikasi</Button>
                        <Button variant="outline" onClick={()=>updateStatus(detail.id, "Diproses")}>Proses</Button>
                        <Button variant="secondary" onClick={()=>updateStatus(detail.id, "Selesai")}>Tandai Selesai</Button>
                        <Button variant="destructive" onClick={()=>updateStatus(detail.id, "Ditolak")}>Tolak</Button>
                        <Button variant="outline" onClick={()=>deleteReport(detail.id)}>Hapus</Button>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
