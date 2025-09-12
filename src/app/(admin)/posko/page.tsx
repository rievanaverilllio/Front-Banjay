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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Line, LineChart, Tooltip, Legend } from "recharts"

// Leaflet (client only)
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false })

type LogisticsStatus = "Tersedia" | "Menipis" | "Habis"
type PoskoStatus = "Aktif" | "Penuh" | "Non-aktif"
type NeedsStatus = "Normal" | "Butuh bantuan" | "Darurat"

type RefugeeBreakdown = {
	laki: number
	perempuan: number
	anak: number
	lansia: number
}

type Posko = {
	id: string
	name: string
	address: string
	kecamatan: string
	lat: number
	lng: number
	capacity: number
	occupants: number
	breakdown: RefugeeBreakdown
	logistics: LogisticsStatus
	contactName: string
	contactPhone: string
	status: PoskoStatus
	needs: NeedsStatus
	facilities: {
		air: boolean
		makanan: boolean
		medis: boolean
		listrik: boolean
		internet: boolean
		toilet?: boolean
		selimut?: boolean
	}
	logisticsUpdatedAt: string
}

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

function genMockPosko(): Posko[] {
	const names = [
		"Posko Cawang",
		"Posko Manggarai",
		"Posko Rawajati",
		"Posko Kramat Jati",
		"Posko Kebon Manggis",
		"Posko Bidara Cina",
		"Posko Kalibata",
		"Posko Pejaten",
	]
	const kecs = ["Kecamatan A", "Kecamatan B", "Kecamatan C", "Kecamatan D"]
	const list: Posko[] = []
	for (let i = 0; i < names.length; i++) {
		const capacity = rand(120, 400)
		const occupants = rand(40, capacity)
		const full = occupants >= capacity
		const status: PoskoStatus = full ? "Penuh" : Math.random() < 0.1 ? "Non-aktif" : "Aktif"
		const logistics: LogisticsStatus = full ? (Math.random() < 0.5 ? "Menipis" : "Habis") : Math.random() < 0.2 ? "Menipis" : "Tersedia"
		const needs: NeedsStatus = logistics === "Habis" ? "Darurat" : logistics === "Menipis" ? (Math.random() < 0.5 ? "Butuh bantuan" : "Normal") : "Normal"
		const laki = rand(occupants * 0.3, occupants * 0.5)
		const perempuan = rand(occupants * 0.3, occupants * 0.5)
		const anak = Math.max(0, occupants - laki - perempuan - rand(0, 30))
		const lansia = Math.max(0, occupants - (laki + perempuan + anak))
		list.push({
			id: `PSK-${1000 + i}`,
			name: names[i],
			address: `${["Jl.", "Gg.", "Kompleks "][i % 3]} ${["Merdeka", "Pahlawan", "Ciliwung", "Sunter"][i % 4]} No. ${rand(1, 200)}, Jakarta` ,
			kecamatan: kecs[i % kecs.length],
			lat: -6.2 + (Math.random() * 0.1 - 0.05),
			lng: 106.85 + (Math.random() * 0.1 - 0.05),
			capacity,
			occupants,
			breakdown: { laki, perempuan, anak, lansia },
			logistics,
			contactName: ["Budi", "Sari", "Agus", "Rina"][i % 4],
			contactPhone: `08${rand(100000000, 999999999)}`,
			status,
			needs,
			facilities: {
				air: true,
				makanan: true,
				medis: Math.random() > 0.3,
				listrik: true,
				internet: Math.random() > 0.4,
				toilet: Math.random() > 0.2,
				selimut: Math.random() > 0.5,
			},
			logisticsUpdatedAt: new Date(Date.now() - rand(1, 48) * 60 * 60 * 1000).toISOString(),
		})
	}
	return list.sort((a, b) => (a.name > b.name ? 1 : -1))
}

function exportCSV(rows: Posko[]) {
	const headers = [
		"id","nama","alamat","kecamatan","lat","lng","kapasitas","pengungsi","logistik","kontak","telepon","status","kebutuhan","update_logistik"
	]
	const lines = [
		headers.join(","),
		...rows.map(r => [
			r.id, r.name, r.address, r.kecamatan, r.lat, r.lng, r.capacity, r.occupants, r.logistics,
			r.contactName, r.contactPhone, r.status, r.needs, r.logisticsUpdatedAt
		].join(","))
	]
	const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" })
	const url = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = url
	a.download = `data-posko-${new Date().toISOString().slice(0,10)}.csv`
	a.click()
	URL.revokeObjectURL(url)
}

const STATUS_FILTER: Array<"Semua" | PoskoStatus | "Hampir Penuh"> = ["Semua", "Aktif", "Penuh", "Non-aktif", "Hampir Penuh"]

export default function Page() {
	const [rows, setRows] = React.useState<Posko[]>(genMockPosko())
	const [query, setQuery] = React.useState("")
	const [kec, setKec] = React.useState<string>("Semua")
	const [status, setStatus] = React.useState<"Semua" | PoskoStatus | "Hampir Penuh">("Semua")
	const [detail, setDetail] = React.useState<Posko | null>(null)
	const [openAdd, setOpenAdd] = React.useState(false)

	// Ensure Leaflet CSS is present for any map usage
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

	const kecList = React.useMemo(() => ["Semua", ...Array.from(new Set(rows.map(r => r.kecamatan)))], [rows])

	const summary = React.useMemo(() => {
		const totalActive = rows.filter(r => r.status === "Aktif").length
		const nearFull = rows.filter(r => r.status === "Penuh" || r.occupants / r.capacity >= 0.9).length
		const needsHelp = rows.filter(r => r.needs !== "Normal").length
		const capacityTotal = rows.reduce((a, b) => a + b.capacity, 0)
		const occupiedTotal = rows.reduce((a, b) => a + b.occupants, 0)
		return { totalActive, nearFull, needsHelp, capacityTotal, occupiedTotal }
	}, [rows])

	const filtered = React.useMemo(() => {
		let data = rows.slice()
		if (query) {
			const q = query.toLowerCase()
			data = data.filter(r => (r.name + " " + r.address + " " + r.kecamatan).toLowerCase().includes(q))
		}
		if (kec !== "Semua") data = data.filter(r => r.kecamatan === kec)
		if (status !== "Semua") {
			if (status === "Hampir Penuh") data = data.filter(r => r.occupants / r.capacity >= 0.9 && r.status !== "Non-aktif")
			else data = data.filter(r => r.status === status)
		}
		data.sort((a, b) => (a.name > b.name ? 1 : -1))
		return data
	}, [rows, query, kec, status])

	// Charts data
	const barData = React.useMemo(() => filtered.map(r => ({ name: r.name, pengungsi: r.occupants })), [filtered])
	const pieData = React.useMemo(() => {
		const counts = { Tersedia: 0, Menipis: 0, Habis: 0 } as Record<LogisticsStatus, number>
		filtered.forEach(r => { counts[r.logistics]++ })
		return Object.entries(counts).map(([name, value]) => ({ name, value }))
	}, [filtered])
	const lineData = React.useMemo(() => {
		// mock 7-day trend of total refugees
		const base = rows.reduce((a, b) => a + b.occupants, 0)
		return Array.from({ length: 7 }).map((_, i) => ({ day: `H-${6 - i}`, total: Math.max(0, base - rand(-50, 50) * i) }))
	}, [rows])

	function addPosko(p: Omit<Posko, "id" | "logisticsUpdatedAt">) {
		const added: Posko = { ...p, id: `PSK-${1000 + rows.length}`, logisticsUpdatedAt: new Date().toISOString() }
		setRows(prev => [added, ...prev])
	}
	function updateCapacity(id: string, capacity: number) {
		setRows(prev => prev.map(r => (r.id === id ? { ...r, capacity } : r)))
	}
	function updateOccupants(id: string, occupants: number) {
		setRows(prev => prev.map(r => (r.id === id ? { ...r, occupants } : r)))
	}
	function updateLogistics(id: string, logistics: LogisticsStatus) {
		setRows(prev => prev.map(r => (r.id === id ? { ...r, logistics, logisticsUpdatedAt: new Date().toISOString() } : r)))
	}
	function deactivate(id: string) {
		setRows(prev => prev.map(r => (r.id === id ? { ...r, status: "Non-aktif" } : r)))
	}
	function remove(id: string) {
		setRows(prev => prev.filter(r => r.id !== id))
	}

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
										<CardTitle>Posko Aktif</CardTitle>
										<CardDescription>jumlah aktif</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{summary.totalActive}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Penuh / Hampir Penuh</CardTitle>
										<CardDescription>kapasitas kritis</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{summary.nearFull}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Kapasitas Terpakai</CardTitle>
										<CardDescription>pengungsi / kapasitas</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{summary.occupiedTotal.toLocaleString()} <span className="text-base font-normal text-muted-foreground">/ {summary.capacityTotal.toLocaleString()}</span></CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Butuh Bantuan</CardTitle>
										<CardDescription>posko prioritas</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{summary.needsHelp}</CardContent>
								</Card>
							</div>

							{/* Filters, Actions, Table */}
							<div className="px-4 lg:px-6">
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between gap-3">
											<div>
												<CardTitle>Data Posko</CardTitle>
												<CardDescription>pencarian, filter, ekspor</CardDescription>
											</div>
											<div className="flex gap-2">
												<Button onClick={() => setOpenAdd(true)}>Tambah Posko</Button>
												<Button variant="outline" onClick={() => exportCSV(filtered)}>Export CSV</Button>
												<Button variant="outline" disabled>Export Excel</Button>
												<Button variant="outline" disabled>Export PDF</Button>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
											<div className="space-y-1 md:col-span-4 lg:col-span-5">
												<Label>Cari (nama / alamat)</Label>
												<Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="cth: Posko Cawang / Merdeka" />
											</div>
											<div className="space-y-1 md:col-span-2 lg:col-span-3">
												<Label>Kecamatan</Label>
												<Select value={kec} onValueChange={(v) => setKec(v)}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent>
														{kecList.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-1 md:col-span-2 lg:col-span-2">
												<Label>Status</Label>
												<Select value={status} onValueChange={(v) => setStatus(v as any)}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent>
														{STATUS_FILTER.map(s => <SelectItem key={s} value={s as any}>{s}</SelectItem>)}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="overflow-x-auto rounded-lg border">
											<table className="w-full text-sm">
												<thead className="bg-muted/50">
													<tr>
														<th className="px-3 py-2 text-left font-medium">ID</th>
														<th className="px-3 py-2 text-left font-medium">Nama Posko</th>
														<th className="px-3 py-2 text-left font-medium">Lokasi</th>
														<th className="px-3 py-2 text-left font-medium">Kapasitas</th>
														<th className="px-3 py-2 text-left font-medium">Pengungsi</th>
														<th className="px-3 py-2 text-left font-medium">Logistik</th>
														<th className="px-3 py-2 text-left font-medium">Penanggung Jawab</th>
														<th className="px-3 py-2 text-left font-medium">Status</th>
														<th className="px-3 py-2 text-left font-medium">Aksi</th>
													</tr>
												</thead>
												<tbody>
													{filtered.map(r => {
														const near = r.occupants / r.capacity >= 0.9 && r.status !== "Non-aktif"
														return (
															<tr key={r.id} className="even:bg-muted/20">
																<td className="px-3 py-2 font-mono">{r.id}</td>
																<td className="px-3 py-2 font-medium">{r.name}</td>
																<td className="px-3 py-2">
																	<div className="max-w-[280px] truncate" title={r.address}>{r.address}</div>
																	<div className="text-xs text-muted-foreground">{r.kecamatan} — {r.lat.toFixed(4)}, {r.lng.toFixed(4)}</div>
																</td>
																<td className="px-3 py-2">{r.capacity.toLocaleString()}</td>
																<td className="px-3 py-2">{r.occupants.toLocaleString()}</td>
																<td className="px-3 py-2">
																	<Badge variant={r.logistics === "Habis" ? "destructive" : r.logistics === "Menipis" ? "secondary" : "outline"}>{r.logistics}</Badge>
																	<div className="text-xs text-muted-foreground">update: {new Date(r.logisticsUpdatedAt).toLocaleString()}</div>
																</td>
																<td className="px-3 py-2">
																	<div>{r.contactName}</div>
																	<div className="text-xs text-muted-foreground">{r.contactPhone}</div>
																</td>
																<td className="px-3 py-2">
																	<div className="flex flex-wrap items-center gap-1">
																		<Badge variant={r.status === "Penuh" ? "destructive" : r.status === "Aktif" ? "outline" : "secondary"}>{r.status}</Badge>
																		{near && <Badge className="bg-amber-500 text-white">Hampir Penuh</Badge>}
																		{r.needs !== "Normal" && <Badge className={r.needs === "Darurat" ? "bg-red-600 text-white" : "bg-amber-600 text-white"}>{r.needs}</Badge>}
																	</div>
																</td>
																<td className="px-3 py-2">
																	<div className="flex flex-wrap gap-2">
																		<Button size="sm" variant="outline" onClick={() => setDetail(r)}>Detail</Button>
																		<Button size="sm" variant="secondary" onClick={() => updateLogistics(r.id, r.logistics === "Tersedia" ? "Menipis" : r.logistics === "Menipis" ? "Habis" : "Tersedia")}>Update Logistik</Button>
																		<Button size="sm" variant="outline" onClick={() => deactivate(r.id)}>Non-aktifkan</Button>
																		<Button size="sm" variant="destructive" onClick={() => remove(r.id)}>Hapus</Button>
																	</div>
																</td>
															</tr>
														)
													})}
												</tbody>
											</table>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Map overview */}
							<div className="px-4 lg:px-6">
								<Card>
									<CardHeader>
										<CardTitle>Peta Sebaran Posko</CardTitle>
										<CardDescription>warna marker sesuai status</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[480px] w-full overflow-hidden rounded-lg">
											<MapContainer center={{ lat: -6.2, lng: 106.85 }} zoom={11} scrollWheelZoom className="h-full w-full">
												<TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
												{filtered.map(p => {
													const occ = p.occupants / Math.max(1, p.capacity)
													const color = p.status === "Non-aktif" ? "#e5e7eb" : occ >= 1 || p.needs === "Darurat" ? "#ef4444" : occ >= 0.9 ? "#f59e0b" : "#10b981"
													return (
														<CircleMarker key={p.id} center={{ lat: p.lat, lng: p.lng }} radius={10} pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }}>
															<Popup>
																<div className="space-y-1">
																	<div className="font-semibold">{p.name}</div>
																	<div className="text-sm">{p.address}</div>
																	<div className="text-xs text-muted-foreground">{p.kecamatan}</div>
																	<div className="text-sm">{p.occupants}/{p.capacity} orang</div>
																	<div className="text-xs text-muted-foreground">Logistik: {p.logistics}</div>
																</div>
															</Popup>
														</CircleMarker>
													)
												})}
											</MapContainer>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Charts */}
							<div className="px-4 lg:px-6">
								<div className="grid gap-4 md:grid-cols-2">
									<Card>
										<CardHeader>
											<CardTitle>Pengungsi per Posko</CardTitle>
											<CardDescription>bar chart</CardDescription>
										</CardHeader>
										<CardContent>
											<ChartContainer className="block h-[280px] w-full aspect-auto overflow-hidden p-2" style={{ aspectRatio: "auto" }} config={{}}>
												<ResponsiveContainer width="100%" height="100%">
													<BarChart data={barData}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="name" hide />
														<YAxis />
														<Tooltip content={<ChartTooltipContent />} />
														<Legend content={<ChartLegendContent />} />
														<Bar dataKey="pengungsi" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} />
													</BarChart>
												</ResponsiveContainer>
											</ChartContainer>
										</CardContent>
									</Card>
									<Card>
										<CardHeader>
											<CardTitle>Distribusi Logistik</CardTitle>
											<CardDescription>pie chart</CardDescription>
										</CardHeader>
										<CardContent>
											<ChartContainer className="block h-[280px] w-full aspect-auto overflow-hidden p-2" style={{ aspectRatio: "auto" }} config={{}}>
												<ResponsiveContainer width="100%" height="100%">
													<PieChart>
														<Tooltip content={<ChartTooltipContent />} />
														<Legend content={<ChartLegendContent />} />
														<Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} fill="hsl(var(--chart-2))" />
													</PieChart>
												</ResponsiveContainer>
											</ChartContainer>
										</CardContent>
									</Card>
								</div>
							</div>

							<div className="px-4 lg:px-6">
								<Card>
									<CardHeader>
										<CardTitle>Trend Total Pengungsi (7 hari)</CardTitle>
										<CardDescription>opsional</CardDescription>
									</CardHeader>
									<CardContent>
										<ChartContainer className="block h-[260px] w-full aspect-auto overflow-hidden p-2" style={{ aspectRatio: "auto" }} config={{}}>
											<ResponsiveContainer width="100%" height="100%">
												<LineChart data={lineData}>
													<CartesianGrid strokeDasharray="3 3" />
													<XAxis dataKey="day" />
													<YAxis />
													<Tooltip content={<ChartTooltipContent />} />
													<Legend content={<ChartLegendContent />} />
													<Line type="monotone" dataKey="total" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
												</LineChart>
											</ResponsiveContainer>
										</ChartContainer>
									</CardContent>
								</Card>
							</div>

							{/* Detail Sheet */}
							<Sheet open={!!detail} onOpenChange={(o)=>!o && setDetail(null)}>
								<SheetContent side="right" className="w-full sm:max-w-xl">
									<SheetHeader>
										<SheetTitle>Detail Posko</SheetTitle>
										<SheetDescription>{detail?.id} — {detail?.name}</SheetDescription>
									</SheetHeader>
									{detail && (
										<div className="mt-4 space-y-3">
											<div>
												<div className="text-sm text-muted-foreground">Alamat</div>
												<div>{detail.address}</div>
												<div className="text-xs text-muted-foreground">{detail.kecamatan} — {detail.lat.toFixed(5)}, {detail.lng.toFixed(5)}</div>
											</div>
											<div className="grid grid-cols-2 gap-3">
												<Card>
													<CardHeader className="py-3"><CardTitle className="text-base">Kapasitas</CardTitle></CardHeader>
													<CardContent className="text-2xl font-semibold">{detail.occupants} / {detail.capacity}</CardContent>
												</Card>
												<Card>
													<CardHeader className="py-3"><CardTitle className="text-base">Kebutuhan</CardTitle></CardHeader>
													<CardContent className="flex flex-wrap gap-2">
														<Badge className={detail.needs === "Darurat" ? "bg-red-600 text-white" : detail.needs === "Butuh bantuan" ? "bg-amber-600 text-white" : ""}>{detail.needs}</Badge>
														<Badge variant={detail.logistics === "Habis" ? "destructive" : detail.logistics === "Menipis" ? "secondary" : "outline"}>{detail.logistics}</Badge>
													</CardContent>
												</Card>
											</div>
											<div>
												<div className="text-sm text-muted-foreground">Rincian Pengungsi</div>
												<div className="grid grid-cols-2 gap-2 text-sm">
													<div>Laki-laki: <b>{detail.breakdown.laki}</b></div>
													<div>Perempuan: <b>{detail.breakdown.perempuan}</b></div>
													<div>Anak-anak: <b>{detail.breakdown.anak}</b></div>
													<div>Lansia: <b>{detail.breakdown.lansia}</b></div>
												</div>
											</div>
											<div>
												<div className="text-sm text-muted-foreground">Fasilitas</div>
												<div className="flex flex-wrap gap-2 text-xs">
													{Object.entries(detail.facilities).filter(([,v]) => v).map(([k]) => (
														<Badge key={k} variant="outline">{k}</Badge>
													))}
												</div>
											</div>
											<div className="text-sm text-muted-foreground">Logistik update: {new Date(detail.logisticsUpdatedAt).toLocaleString()}</div>
											<div>
												<div className="text-sm text-muted-foreground">Kontak</div>
												<div>{detail.contactName} — {detail.contactPhone}</div>
											</div>
											<div className="overflow-hidden rounded-lg border">
												<div className="h-[220px] w-full">
													<MapContainer center={{ lat: detail.lat, lng: detail.lng }} zoom={14} scrollWheelZoom className="h-full w-full">
														<TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
														<CircleMarker center={{ lat: detail.lat, lng: detail.lng }} radius={10} pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.85 }}>
															<Popup>{detail.name}</Popup>
														</CircleMarker>
													</MapContainer>
												</div>
											</div>
											<Separator />
											<div className="flex flex-wrap gap-2">
												<Button onClick={() => updateOccupants(detail.id, Math.max(0, detail.occupants - 10))}>-10 Pengungsi</Button>
												<Button variant="secondary" onClick={() => updateOccupants(detail.id, detail.occupants + 10)}>+10 Pengungsi</Button>
												<Button variant="outline" onClick={() => updateCapacity(detail.id, detail.capacity + 20)}>+20 Kapasitas</Button>
												<Button variant="outline" onClick={() => deactivate(detail.id)}>Non-aktifkan</Button>
												<Button variant="destructive" onClick={() => { remove(detail.id); setDetail(null) }}>Hapus</Button>
											</div>
										</div>
									)}
								</SheetContent>
							</Sheet>

							{/* Add Posko */}
							<Sheet open={openAdd} onOpenChange={setOpenAdd}>
								<SheetContent side="right" className="w-full sm:max-w-xl">
									<SheetHeader>
										<SheetTitle>Tambah Posko</SheetTitle>
										<SheetDescription>isi data posko baru</SheetDescription>
									</SheetHeader>
									<AddPoskoForm onSubmit={(p) => { addPosko(p); setOpenAdd(false) }} />
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

function AddPoskoForm({ onSubmit }: { onSubmit: (p: Omit<Posko, "id" | "logisticsUpdatedAt">) => void }) {
	const [name, setName] = React.useState("")
	const [address, setAddress] = React.useState("")
	const [kecamatan, setKecamatan] = React.useState("")
	const [lat, setLat] = React.useState("-6.2")
	const [lng, setLng] = React.useState("106.85")
	const [capacity, setCapacity] = React.useState("150")
	const [occupants, setOccupants] = React.useState("50")
	const [contactName, setContactName] = React.useState("")
	const [contactPhone, setContactPhone] = React.useState("")
	const [logistics, setLogistics] = React.useState<LogisticsStatus>("Tersedia")
	const [status, setStatus] = React.useState<PoskoStatus>("Aktif")
	const [needs, setNeeds] = React.useState<NeedsStatus>("Normal")
	const [fac, setFac] = React.useState({ air: true, makanan: true, medis: false, listrik: true, internet: true, toilet: true, selimut: false })

	return (
		<form
			className="mt-4 space-y-3"
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit({
					name,
					address,
					kecamatan: kecamatan || "Kecamatan Baru",
					lat: parseFloat(lat),
					lng: parseFloat(lng),
					capacity: parseInt(capacity),
					occupants: parseInt(occupants),
					breakdown: { laki: 20, perempuan: 20, anak: 5, lansia: 5 },
					logistics,
					contactName: contactName || "Petugas",
					contactPhone: contactPhone || `08${rand(100000000, 999999999)}`,
					status,
					needs,
					facilities: fac,
				})
			}}
		>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div className="space-y-1">
					<Label>Nama Posko</Label>
					<Input value={name} onChange={(e) => setName(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Kecamatan</Label>
					<Input value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} />
				</div>
				<div className="space-y-1 md:col-span-2">
					<Label>Alamat</Label>
					<Input value={address} onChange={(e) => setAddress(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Latitude</Label>
					<Input value={lat} onChange={(e) => setLat(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Longitude</Label>
					<Input value={lng} onChange={(e) => setLng(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Kapasitas</Label>
					<Input value={capacity} onChange={(e) => setCapacity(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Pengungsi</Label>
					<Input value={occupants} onChange={(e) => setOccupants(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Kontak</Label>
					<Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Telepon</Label>
					<Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Logistik</Label>
					<Select value={logistics} onValueChange={(v) => setLogistics(v as LogisticsStatus)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(["Tersedia","Menipis","Habis"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label>Status</Label>
					<Select value={status} onValueChange={(v) => setStatus(v as PoskoStatus)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(["Aktif","Penuh","Non-aktif"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label>Kebutuhan</Label>
					<Select value={needs} onValueChange={(v) => setNeeds(v as NeedsStatus)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(["Normal","Butuh bantuan","Darurat"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1 md:col-span-2">
					<Label>Fasilitas</Label>
					<div className="grid grid-cols-2 gap-2">
						{Object.keys(fac).map((k) => (
							<label key={k} className="flex items-center gap-2 rounded-md border p-2 text-sm">
								<Checkbox checked={(fac as any)[k]} onCheckedChange={(v) => setFac((p) => ({ ...p, [k]: Boolean(v) }))} />
								<span>{k}</span>
							</label>
						))}
					</div>
				</div>
			</div>
			<div className="pt-2">
				<Button type="submit">Simpan</Button>
			</div>
		</form>
	)
}

