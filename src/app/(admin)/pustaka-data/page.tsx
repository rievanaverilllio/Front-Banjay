"use client"

import * as React from "react"
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

type Category = "Curah Hujan" | "Ketinggian Air" | "Laporan Masyarakat" | "Peta/Geospasial" | "Infrastruktur" | "Lainnya"
type Format = "CSV" | "JSON" | "Parquet" | "GeoJSON" | "Image" | "Other"
type Status = "Draft" | "Published" | "Archived"

type Field = { name: string; type: string; description?: string }

type Dataset = {
	id: string
	name: string
	category: Category
	format: Format
	records: number
	sizeMB: number
	updatedAt: string // ISO
	source: string
	status: Status
	tags?: string[]
	description?: string
	schema: Field[]
}

function genMockDatasets(): Dataset[] {
	const list: Dataset[] = []
	const cats: Category[] = ["Curah Hujan","Ketinggian Air","Laporan Masyarakat","Peta/Geospasial","Infrastruktur","Lainnya"]
	const fmts: Format[] = ["CSV","JSON","Parquet","GeoJSON","Image","Other"]
	for (let i=0;i<20;i++){
		const cat = cats[i % cats.length]
		const fmt = fmts[i % fmts.length]
		const schema: Field[] = [
			{ name: "id", type: "string" },
			{ name: cat === "Peta/Geospasial" ? "geometry" : "timestamp", type: cat === "Peta/Geospasial" ? "Geometry" : "datetime" },
			{ name: cat === "Curah Hujan" ? "rain_mm" : cat === "Ketinggian Air" ? "height_cm" : "value", type: "number" },
			{ name: "location", type: "string" },
		]
		list.push({
			id: `DS-${1000 + i}`,
			name: `${cat} — Dataset ${i+1}`,
			category: cat,
			format: fmt,
			records: 10000 + i * 231,
			sizeMB: Math.round(50 + (i % 7) * 23 + Math.random() * 20),
			updatedAt: new Date(Date.now() - i * 36 * 60 * 60 * 1000).toISOString(),
			source: ["BMKG","Dinas SDA","Warga","OpenStreetMap","PLN","Internal"][i % 6],
			status: (i % 9 === 0 ? "Draft" : i % 5 === 0 ? "Archived" : "Published"),
			tags: ["public","priority","daily","raw"].slice(0, (i % 4) + 1),
			description: "Dataset contoh untuk pustaka data: digunakan untuk monitoring dan analisis.",
			schema,
		})
	}
	return list.sort((a,b)=> (a.updatedAt < b.updatedAt ? 1 : -1))
}

function exportCSV(rows: Dataset[]) {
	const headers = ["id","name","category","format","records","sizeMB","updatedAt","source","status","tags"]
	const lines = [
		headers.join(","),
		...rows.map(r => [r.id, r.name, r.category, r.format, r.records, r.sizeMB, r.updatedAt, r.source, r.status, (r.tags ?? []).join("|")].join(","))
	]
	const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" })
	const url = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = url
	a.download = `catalog-datasets-${new Date().toISOString().slice(0,10)}.csv`
	a.click()
	URL.revokeObjectURL(url)
}

const CATEGORY_FILTER: Array<"Semua" | Category> = ["Semua","Curah Hujan","Ketinggian Air","Laporan Masyarakat","Peta/Geospasial","Infrastruktur","Lainnya"]
const FORMAT_FILTER: Array<"Semua" | Format> = ["Semua","CSV","JSON","Parquet","GeoJSON","Image","Other"]
const STATUS_FILTER: Array<"Semua" | Status> = ["Semua","Draft","Published","Archived"]

export default function Page() {
	const [data, setData] = React.useState<Dataset[]>(genMockDatasets())
	const [query, setQuery] = React.useState("")
	const [category, setCategory] = React.useState<"Semua" | Category>("Semua")
	const [format, setFormat] = React.useState<"Semua" | Format>("Semua")
	const [status, setStatus] = React.useState<"Semua" | Status>("Semua")
	const [detail, setDetail] = React.useState<Dataset | null>(null)
	const [openAdd, setOpenAdd] = React.useState(false)

	const total = data.length
	const totalSize = data.reduce((a,b)=> a + b.sizeMB, 0)
	const published = data.filter(d => d.status === "Published").length
	const recentUpdated = data.filter(d => Date.now() - new Date(d.updatedAt).getTime() < 7*24*60*60*1000).length

	const filtered = React.useMemo(() => {
		let rows = data.slice()
		if (query){
			const q = query.toLowerCase()
			rows = rows.filter(r => (r.name + " " + r.source + " " + (r.tags ?? []).join(" ")).toLowerCase().includes(q))
		}
		if (category !== "Semua") rows = rows.filter(r => r.category === category)
		if (format !== "Semua") rows = rows.filter(r => r.format === format)
		if (status !== "Semua") rows = rows.filter(r => r.status === status)
		rows.sort((a,b)=> (a.updatedAt < b.updatedAt ? 1 : -1))
		return rows
	}, [data, query, category, format, status])

	function addDataset(d: Omit<Dataset, "id">) {
		const added: Dataset = { ...d, id: `DS-${1000 + data.length}` }
		setData(prev => [added, ...prev])
	}
	function removeDataset(id: string) {
		setData(prev => prev.filter(r => r.id !== id))
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
										<CardTitle>Total Dataset</CardTitle>
										<CardDescription>semua kategori</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{total}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Total Ukuran</CardTitle>
										<CardDescription>perkiraan (MB)</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{totalSize.toLocaleString()} <span className="text-base font-normal text-muted-foreground">MB</span></CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Published</CardTitle>
										<CardDescription>siap digunakan</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{published}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Diperbarui (7 hari)</CardTitle>
										<CardDescription>aktivitas terkini</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{recentUpdated}</CardContent>
								</Card>
							</div>

							{/* Filters & table */}
							<div className="px-4 lg:px-6">
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between gap-3">
											<div>
												<CardTitle>Pustaka Data</CardTitle>
												<CardDescription>pencarian, filter, dan ekspor katalog</CardDescription>
											</div>
											<div className="flex gap-2">
												<Button onClick={() => setOpenAdd(true)}>Tambah Dataset</Button>
												<Button variant="outline" onClick={() => exportCSV(filtered)}>Export Catalog CSV</Button>
												<Button variant="outline" disabled>Export Excel</Button>
												<Button variant="outline" disabled>Export PDF</Button>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
											<div className="space-y-1 md:col-span-4 lg:col-span-5">
												<Label>Cari dataset</Label>
												<Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="cth: Curah Hujan / BMKG" />
											</div>
											<div className="space-y-1 md:col-span-2 lg:col-span-3">
												<Label>Kategori</Label>
												<Select value={category} onValueChange={(v)=>setCategory(v as any)}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent>
														{CATEGORY_FILTER.map(c => <SelectItem key={c} value={c as any}>{c}</SelectItem>)}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-1 md:col-span-2 lg:col-span-2">
												<Label>Format</Label>
												<Select value={format} onValueChange={(v)=>setFormat(v as any)}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent>
														{FORMAT_FILTER.map(f => <SelectItem key={f} value={f as any}>{f}</SelectItem>)}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-1 md:col-span-2 lg:col-span-2">
												<Label>Status</Label>
												<Select value={status} onValueChange={(v)=>setStatus(v as any)}>
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
														<th className="px-3 py-2 text-left font-medium">Nama</th>
														<th className="px-3 py-2 text-left font-medium">Kategori</th>
														<th className="px-3 py-2 text-left font-medium">Format</th>
														<th className="px-3 py-2 text-left font-medium">Records</th>
														<th className="px-3 py-2 text-left font-medium">Ukuran (MB)</th>
														<th className="px-3 py-2 text-left font-medium">Update</th>
														<th className="px-3 py-2 text-left font-medium">Sumber</th>
														<th className="px-3 py-2 text-left font-medium">Status</th>
														<th className="px-3 py-2 text-left font-medium">Aksi</th>
													</tr>
												</thead>
												<tbody>
													{filtered.map(r => (
														<tr key={r.id} className="even:bg-muted/20">
															<td className="px-3 py-2 font-mono">{r.id}</td>
															<td className="px-3 py-2">
																<div className="font-medium">{r.name}</div>
																<div className="max-w-[320px] truncate text-xs text-muted-foreground" title={r.description}>{r.description}</div>
																<div className="mt-1 flex flex-wrap gap-1 text-[10px]">
																	{(r.tags ?? []).map(t => <Badge key={t} variant="outline">{t}</Badge>)}
																</div>
															</td>
															<td className="px-3 py-2">{r.category}</td>
															<td className="px-3 py-2">{r.format}</td>
															<td className="px-3 py-2">{r.records.toLocaleString()}</td>
															<td className="px-3 py-2">{r.sizeMB.toLocaleString()}</td>
															<td className="px-3 py-2">{new Date(r.updatedAt).toLocaleString()}</td>
															<td className="px-3 py-2">{r.source}</td>
															<td className="px-3 py-2">
																<Badge variant={r.status === "Published" ? "outline" : r.status === "Draft" ? "secondary" : "destructive"}>{r.status}</Badge>
															</td>
															<td className="px-3 py-2">
																<div className="flex flex-wrap gap-2">
																	<Button size="sm" variant="outline" onClick={()=>setDetail(r)}>Detail</Button>
																	<Button size="sm" variant="secondary" onClick={()=>alert("Contoh unduh sampel")}>Unduh Sampel</Button>
																	<Button size="sm" variant="destructive" onClick={()=>removeDataset(r.id)}>Hapus</Button>
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
										<SheetTitle>Detail Dataset</SheetTitle>
										<SheetDescription>{detail?.id} — {detail?.name}</SheetDescription>
									</SheetHeader>
									{detail && (
										<div className="mt-4 space-y-3">
											<div className="text-sm text-muted-foreground">Sumber: {detail.source}</div>
											<div className="text-sm">Format: {detail.format}, Records: {detail.records.toLocaleString()}, Ukuran: {detail.sizeMB.toLocaleString()} MB</div>
											<div className="text-sm text-muted-foreground">Update: {new Date(detail.updatedAt).toLocaleString()}</div>
											<div className="text-sm leading-relaxed">{detail.description}</div>
											<Separator />
											<div>
												<div className="font-medium">Schema</div>
												<div className="mt-2 overflow-x-auto rounded border">
													<table className="w-full text-sm">
														<thead className="bg-muted/50">
															<tr>
																<th className="px-3 py-2 text-left font-medium">Field</th>
																<th className="px-3 py-2 text-left font-medium">Type</th>
																<th className="px-3 py-2 text-left font-medium">Description</th>
															</tr>
														</thead>
														<tbody>
															{detail.schema.map((f,i)=>(
																<tr key={i} className="even:bg-muted/20">
																	<td className="px-3 py-2">{f.name}</td>
																	<td className="px-3 py-2">{f.type}</td>
																	<td className="px-3 py-2">{f.description ?? "-"}</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</div>
											<div>
												<div className="font-medium">Preview (contoh 5 baris)</div>
												<div className="mt-2 overflow-x-auto rounded border">
													<table className="w-full text-sm">
														<thead className="bg-muted/50">
															<tr>
																{detail.schema.map((f,i)=>(<th key={i} className="px-3 py-2 text-left font-medium">{f.name}</th>))}
															</tr>
														</thead>
														<tbody>
															{Array.from({length:5}).map((_,ri)=> (
																<tr key={ri} className="even:bg-muted/20">
																	{detail.schema.map((f,ci)=> (
																		<td key={ci} className="px-3 py-2">
																			{f.type === "string" ? `val_${ri}_${ci}` : f.type === "datetime" ? new Date(Date.now() - ri*3600_000).toISOString() : f.type === "number" ? (ri*10 + ci) : f.type === "Geometry" ? "{...}" : "-"}
																		</td>
																	))}
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</div>
											<div className="flex flex-wrap gap-2">
												<Button variant="secondary" onClick={()=>alert("Contoh unduh penuh")}>Unduh Penuh</Button>
												<Button variant="outline" onClick={()=>setDetail(null)}>Tutup</Button>
											</div>
										</div>
									)}
								</SheetContent>
							</Sheet>

							{/* Add dataset */}
							<Sheet open={openAdd} onOpenChange={setOpenAdd}>
								<SheetContent side="right" className="w-full sm:max-w-xl">
									<SheetHeader>
										<SheetTitle>Tambah Dataset</SheetTitle>
										<SheetDescription>lengkapi metadata dataset</SheetDescription>
									</SheetHeader>
									<AddDatasetForm onSubmit={(d)=>{ addDataset(d); setOpenAdd(false) }} />
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

function AddDatasetForm({ onSubmit }: { onSubmit: (d: Omit<Dataset, "id">) => void }) {
	const [name, setName] = React.useState("")
	const [category, setCategory] = React.useState<Category>("Curah Hujan")
	const [format, setFormat] = React.useState<Format>("CSV")
	const [records, setRecords] = React.useState("1000")
	const [sizeMB, setSizeMB] = React.useState("50")
	const [source, setSource] = React.useState("")
	const [status, setStatus] = React.useState<Status>("Draft")
	const [tags, setTags] = React.useState("public,raw")
	const [description, setDescription] = React.useState("")

	const [schema, setSchema] = React.useState<Field[]>([
		{ name: "id", type: "string" },
		{ name: "timestamp", type: "datetime" },
		{ name: "value", type: "number" },
	])

	return (
		<form
			className="mt-4 space-y-3"
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit({
					name,
					category,
					format,
					records: parseInt(records || "0"),
					sizeMB: parseFloat(sizeMB || "0"),
					updatedAt: new Date().toISOString(),
					source: source || "Internal",
					status,
					tags: tags.split(",").map(s => s.trim()).filter(Boolean),
					description,
					schema,
				})
			}}
		>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div className="space-y-1">
					<Label>Nama</Label>
					<Input value={name} onChange={(e)=>setName(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Source</Label>
					<Input value={source} onChange={(e)=>setSource(e.target.value)} placeholder="BMKG / Internal" />
				</div>
				<div className="space-y-1">
					<Label>Kategori</Label>
					<Select value={category} onValueChange={(v)=>setCategory(v as Category)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(CATEGORY_FILTER.filter(c=>c!=="Semua") as Category[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label>Format</Label>
					<Select value={format} onValueChange={(v)=>setFormat(v as Format)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(FORMAT_FILTER.filter(f=>f!=="Semua") as Format[]).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label>Records</Label>
					<Input value={records} onChange={(e)=>setRecords(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Ukuran (MB)</Label>
					<Input value={sizeMB} onChange={(e)=>setSizeMB(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Status</Label>
					<Select value={status} onValueChange={(v)=>setStatus(v as Status)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(STATUS_FILTER.filter(s=>s!=="Semua") as Status[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1 md:col-span-2">
					<Label>Tags (comma)</Label>
					<Input value={tags} onChange={(e)=>setTags(e.target.value)} />
				</div>
				<div className="space-y-1 md:col-span-2">
					<Label>Deskripsi</Label>
					<Input value={description} onChange={(e)=>setDescription(e.target.value)} />
				</div>
			</div>

			<Separator className="my-2" />

			<div>
				<div className="mb-2 font-medium">Schema</div>
				<div className="space-y-2">
					{schema.map((f, idx) => (
						<div key={idx} className="grid grid-cols-1 items-end gap-2 md:grid-cols-6">
							<div className="md:col-span-3">
								<Label>Field</Label>
								<Input value={f.name} onChange={(e)=>setSchema(prev => prev.map((x,i)=> i===idx ? { ...x, name: e.target.value } : x))} />
							</div>
							<div>
								<Label>Type</Label>
								<Input value={f.type} onChange={(e)=>setSchema(prev => prev.map((x,i)=> i===idx ? { ...x, type: e.target.value } : x))} />
							</div>
							<div className="md:col-span-2">
								<Label>Deskripsi</Label>
								<Input value={f.description ?? ""} onChange={(e)=>setSchema(prev => prev.map((x,i)=> i===idx ? { ...x, description: e.target.value } : x))} />
							</div>
						</div>
					))}
				</div>
				<div className="mt-2 flex gap-2">
					<Button type="button" variant="outline" onClick={()=>setSchema(prev => [...prev, { name: "field", type: "string" }])}>Tambah Field</Button>
					<Button type="button" variant="destructive" onClick={()=>setSchema(prev => prev.slice(0, -1))} disabled={schema.length <= 1}>Hapus Terakhir</Button>
				</div>
			</div>

			<div className="pt-2">
				<Button type="submit">Simpan</Button>
			</div>
		</form>
	)
}

