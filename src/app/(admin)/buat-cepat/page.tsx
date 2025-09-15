"use client"

import * as React from "react"
import { AppSidebar } from "@/components/section/admin/app-sidebar"
import { SiteHeader } from "@/components/section/admin/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type CreatedKind = "Laporan" | "Notifikasi" | "Posko" | "Dataset" | "Dokumen"
type CreatedItem = {
	id: string
	kind: CreatedKind
	title: string
	desc?: string
	createdAt: string
	priority?: "Rendah" | "Sedang" | "Tinggi"
	status?: string
}

export default function Page() {
	const [items, setItems] = React.useState<CreatedItem[]>([])
	const [query, setQuery] = React.useState("")
	const [kind, setKind] = React.useState<"Semua" | CreatedKind>("Semua")
	const [detail, setDetail] = React.useState<CreatedItem | null>(null)

	function add(item: Omit<CreatedItem, "id" | "createdAt">) {
		const newItem: CreatedItem = {
			...item,
			id: `${item.kind}-${Date.now()}`,
			createdAt: new Date().toISOString(),
		}
		setItems(prev => [newItem, ...prev])
	}

	const filtered = React.useMemo(() => {
		let rows = items.slice()
		if (kind !== "Semua") rows = rows.filter(r => r.kind === kind)
		if (query) {
			const q = query.toLowerCase()
			rows = rows.filter(r => (r.title + " " + (r.desc ?? "")).toLowerCase().includes(q))
		}
		rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
		return rows
	}, [items, kind, query])

	function exportCSV(rows: CreatedItem[]) {
		const headers = ["id","kind","title","desc","createdAt","priority","status"]
		const lines = [headers.join(","), ...rows.map(r => [r.id, r.kind, r.title, r.desc ?? "", r.createdAt, r.priority ?? "", r.status ?? ""].join(","))]
		const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `buat-cepat-${new Date().toISOString().slice(0,10)}.csv`
		a.click()
		URL.revokeObjectURL(url)
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
										<CardTitle>Buat Cepat</CardTitle>
										<CardDescription>form singkat untuk entri umum</CardDescription>
									</CardHeader>
									<CardContent className="text-sm text-muted-foreground">Pilih tab sesuai kebutuhan, isi beberapa field, dan simpan.</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Total Dibuat</CardTitle>
										<CardDescription>semua jenis</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{items.length}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Terakhir 24 Jam</CardTitle>
										<CardDescription>aktivitas</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{items.filter(i => Date.now() - new Date(i.createdAt).getTime() < 24*60*60*1000).length}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Prioritas Tinggi</CardTitle>
										<CardDescription>notifikasi/laporan</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{items.filter(i => i.priority === "Tinggi").length}</CardContent>
								</Card>
							</div>

							<div className="px-4 lg:px-6">
								<Tabs defaultValue="laporan">
									<div className="flex items-center justify-between">
										<TabsList>
											<TabsTrigger value="laporan">Laporan</TabsTrigger>
											<TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
											<TabsTrigger value="posko">Posko</TabsTrigger>
											<TabsTrigger value="dataset">Dataset</TabsTrigger>
											<TabsTrigger value="dokumen">Dokumen</TabsTrigger>
										</TabsList>
										<div className="hidden md:block text-sm text-muted-foreground">Form ringkas untuk entri cepat</div>
									</div>

									<TabsContent value="laporan" className="mt-3">
										<QuickLaporan onCreate={add} />
									</TabsContent>
									<TabsContent value="notifikasi" className="mt-3">
										<QuickNotifikasi onCreate={add} />
									</TabsContent>
									<TabsContent value="posko" className="mt-3">
										<QuickPosko onCreate={add} />
									</TabsContent>
									<TabsContent value="dataset" className="mt-3">
										<QuickDataset onCreate={add} />
									</TabsContent>
									<TabsContent value="dokumen" className="mt-3">
										<QuickDokumen onCreate={add} />
									</TabsContent>
								</Tabs>
							</div>

							{/* Recent */}
							<div className="px-4 lg:px-6">
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between gap-3">
											<div>
												<CardTitle>Terakhir Dibuat</CardTitle>
												<CardDescription>rekap item yang baru ditambahkan</CardDescription>
											</div>
											<div className="flex gap-2">
												<Button variant="outline" onClick={()=>exportCSV(filtered)}>Export CSV</Button>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
											<div className="space-y-1 md:col-span-4 lg:col-span-6">
												<Label>Cari</Label>
												<Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="cth: judul / deskripsi" />
											</div>
											<div className="space-y-1 md:col-span-2 lg:col-span-3">
												<Label>Jenis</Label>
												<Select value={kind} onValueChange={(v)=>setKind(v as any)}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent>
														{(["Semua","Laporan","Notifikasi","Posko","Dataset","Dokumen"] as const).map(k => <SelectItem key={k} value={k as any}>{k}</SelectItem>)}
													</SelectContent>
												</Select>
											</div>
										</div>
										<div className="rounded-lg border">
											<table className="w-full text-sm">
												<thead className="bg-muted/50">
													<tr>
														<th className="px-3 py-2 text-left font-medium">Jenis</th>
														<th className="px-3 py-2 text-left font-medium">Judul</th>
														<th className="px-3 py-2 text-left font-medium">Deskripsi</th>
														<th className="px-3 py-2 text-left font-medium">Waktu</th>
														<th className="px-3 py-2 text-left font-medium">Aksi</th>
													</tr>
												</thead>
												<tbody>
													{filtered.map(it => (
														<tr key={it.id} className="even:bg-muted/20">
															<td className="px-3 py-2"><Badge variant="outline">{it.kind}</Badge></td>
															<td className="px-3 py-2 font-medium">{it.title}</td>
															<td className="px-3 py-2 max-w-[420px] truncate text-muted-foreground">{it.desc}</td>
															<td className="px-3 py-2">{new Date(it.createdAt).toLocaleString()}</td>
															<td className="px-3 py-2">
																<div className="flex gap-2">
																	<Button size="sm" variant="outline" onClick={()=>setDetail(it)}>Detail</Button>
																	<Button size="sm" variant="destructive" onClick={()=>setItems(prev=>prev.filter(p=>p.id!==it.id))}>Hapus</Button>
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
										<SheetTitle>Detail Item</SheetTitle>
										<SheetDescription>{detail?.kind} — {detail?.title}</SheetDescription>
									</SheetHeader>
									{detail && (
										<div className="mt-4 space-y-3">
											<div className="grid grid-cols-2 gap-2 text-sm">
												<div><span className="text-muted-foreground">Jenis:</span> {detail.kind}</div>
												<div><span className="text-muted-foreground">Waktu:</span> {new Date(detail.createdAt).toLocaleString()}</div>
												{detail.priority && <div><span className="text-muted-foreground">Prioritas:</span> {detail.priority}</div>}
												{detail.status && <div><span className="text-muted-foreground">Status:</span> {detail.status}</div>}
												<div className="col-span-2"><span className="text-muted-foreground">Deskripsi:</span> {detail.desc}</div>
											</div>
											<Separator />
											<div className="flex flex-wrap gap-2">
												<Button onClick={()=>setDetail(null)}>Tutup</Button>
												<Button variant="destructive" onClick={()=>{ setItems(prev=>prev.filter(p=>p.id!==detail.id)); setDetail(null) }}>Hapus</Button>
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

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-3">{children}</CardContent>
		</Card>
	)
}

function QuickLaporan({ onCreate }: { onCreate: (i: Omit<CreatedItem, "id" | "createdAt">) => void }) {
	const [judul, setJudul] = React.useState("")
	const [kategori, setKategori] = React.useState("Umum")
	const [deskripsi, setDeskripsi] = React.useState("")
	const [prioritas, setPrioritas] = React.useState<"Rendah" | "Sedang" | "Tinggi">("Rendah")

	return (
		<Section title="Laporan Cepat" description="Tambahkan laporan singkat (kejadian, lokasi, catatan)">
			<form className="grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={(e)=>{ e.preventDefault(); onCreate({ kind: "Laporan", title: judul, desc: `[${kategori}] ${deskripsi}`, priority: prioritas, status: "Baru" }); setJudul(""); setDeskripsi("") }}>
				<div className="space-y-1 md:col-span-2">
					<Label>Judul</Label>
					<Input value={judul} onChange={(e)=>setJudul(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Kategori</Label>
					<Input value={kategori} onChange={(e)=>setKategori(e.target.value)} />
				</div>
				<div className="space-y-1 md:col-span-2">
					<Label>Deskripsi</Label>
					<Input value={deskripsi} onChange={(e)=>setDeskripsi(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Prioritas</Label>
					<Select value={prioritas} onValueChange={(v)=>setPrioritas(v as any)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(["Rendah","Sedang","Tinggi"] as const).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="md:col-span-3 pt-1">
					<Button type="submit">Simpan Laporan</Button>
				</div>
			</form>
		</Section>
	)
}

function QuickNotifikasi({ onCreate }: { onCreate: (i: Omit<CreatedItem, "id" | "createdAt">) => void }) {
	const [judul, setJudul] = React.useState("")
	const [pesan, setPesan] = React.useState("")
	const [prioritas, setPrioritas] = React.useState<"Rendah" | "Sedang" | "Tinggi">("Rendah")
	const [channel, setChannel] = React.useState("Semua")

	return (
		<Section title="Notifikasi Cepat" description="Kirim pengumuman singkat kepada pengguna">
			<form className="grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={(e)=>{ e.preventDefault(); onCreate({ kind: "Notifikasi", title: judul, desc: `[${channel}] ${pesan}`, priority: prioritas, status: "Dijadwalkan" }); setJudul(""); setPesan("") }}>
				<div className="space-y-1 md:col-span-2">
					<Label>Judul</Label>
					<Input value={judul} onChange={(e)=>setJudul(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Channel</Label>
					<Select value={channel} onValueChange={(v)=>setChannel(v)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(["Semua","Email","SMS","Push"] as const).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1 md:col-span-3">
					<Label>Pesan</Label>
					<Input value={pesan} onChange={(e)=>setPesan(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Prioritas</Label>
					<Select value={prioritas} onValueChange={(v)=>setPrioritas(v as any)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(["Rendah","Sedang","Tinggi"] as const).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="md:col-span-3 pt-1">
					<Button type="submit">Jadwalkan</Button>
				</div>
			</form>
		</Section>
	)
}

function QuickPosko({ onCreate }: { onCreate: (i: Omit<CreatedItem, "id" | "createdAt">) => void }) {
	const [nama, setNama] = React.useState("")
	const [wilayah, setWilayah] = React.useState("Umum")
	const [kapasitas, setKapasitas] = React.useState(0)
	const [status, setStatus] = React.useState("Aktif")

	return (
		<Section title="Posko Cepat" description="Catat posko baru secara ringkas">
			<form className="grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={(e)=>{ e.preventDefault(); onCreate({ kind: "Posko", title: nama, desc: `[${wilayah}] Kapasitas ${kapasitas}`, status }); setNama(""); setKapasitas(0) }}>
				<div className="space-y-1 md:col-span-2">
					<Label>Nama Posko</Label>
					<Input value={nama} onChange={(e)=>setNama(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Wilayah</Label>
					<Input value={wilayah} onChange={(e)=>setWilayah(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Kapasitas</Label>
					<Input type="number" value={kapasitas} onChange={(e)=>setKapasitas(Number(e.target.value))} />
				</div>
				<div className="space-y-1">
					<Label>Status</Label>
					<Select value={status} onValueChange={(v)=>setStatus(v)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(["Aktif","Penuh","Nonaktif"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="md:col-span-3 pt-1">
					<Button type="submit">Simpan Posko</Button>
				</div>
			</form>
		</Section>
	)
}

function QuickDataset({ onCreate }: { onCreate: (i: Omit<CreatedItem, "id" | "createdAt">) => void }) {
	const [nama, setNama] = React.useState("")
	const [kategori, setKategori] = React.useState("Umum")
	const [format, setFormat] = React.useState("CSV")

	return (
		<Section title="Dataset Cepat" description="Catat metadata dataset secara singkat">
			<form className="grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={(e)=>{ e.preventDefault(); onCreate({ kind: "Dataset", title: nama, desc: `[${kategori}] Format ${format}` }); setNama("") }}>
				<div className="space-y-1 md:col-span-2">
					<Label>Nama Dataset</Label>
					<Input value={nama} onChange={(e)=>setNama(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Kategori</Label>
					<Input value={kategori} onChange={(e)=>setKategori(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Format</Label>
					<Select value={format} onValueChange={(v)=>setFormat(v)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(["CSV","GeoJSON","Parquet","XLSX"] as const).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="md:col-span-3 pt-1">
					<Button type="submit">Simpan Dataset</Button>
				</div>
			</form>
		</Section>
	)
}

function QuickDokumen({ onCreate }: { onCreate: (i: Omit<CreatedItem, "id" | "createdAt">) => void }) {
	const [judul, setJudul] = React.useState("")
	const [kategori, setKategori] = React.useState("Umum")
	const [ringkas, setRingkas] = React.useState("")

	return (
		<Section title="Dokumen Cepat" description="Catat dokumen dan ringkasannya">
			<form className="grid grid-cols-1 gap-2 md:grid-cols-3" onSubmit={(e)=>{ e.preventDefault(); onCreate({ kind: "Dokumen", title: judul, desc: `[${kategori}] ${ringkas}` }); setJudul(""); setRingkas("") }}>
				<div className="space-y-1 md:col-span-2">
					<Label>Judul</Label>
					<Input value={judul} onChange={(e)=>setJudul(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Kategori</Label>
					<Input value={kategori} onChange={(e)=>setKategori(e.target.value)} />
				</div>
				<div className="space-y-1 md:col-span-3">
					<Label>Ringkasan</Label>
					<Input value={ringkas} onChange={(e)=>setRingkas(e.target.value)} />
				</div>
				<div className="md:col-span-3 pt-1">
					<Button type="submit">Simpan Dokumen</Button>
				</div>
			</form>
		</Section>
	)
}

