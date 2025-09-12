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
import { Separator } from "@/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type DocType = "PDF" | "DOCX" | "TXT" | "XLSX" | "Image"
type DocStatus = "Indexed" | "Processing" | "Failed"

type Doc = {
	id: string
	title: string
	type: DocType
	sizeKB: number
	createdAt: string
	updatedAt: string
	status: DocStatus
	tags?: string[]
	source?: string
	content: string
}

type ChatMessage = { id: string; role: "user" | "assistant"; text: string; cites?: string[] }

function genMockDocs(): Doc[] {
	const texts = [
		"Prosedur evakuasi banjir: koordinasi posko, jalur evakuasi, dan prioritas kelompok rentan.",
		"Standar operasi tanggap darurat: komunikasi, logistik, dan pelaporan harian.",
		"Panduan perawatan sanitasi di pengungsian untuk mencegah penyakit menular.",
		"Laporan ringkas curah hujan bulanan dan anomali iklim wilayah DKI.",
	]
	return Array.from({length:16}).map((_,i)=> ({
		id: `DOC-${1000+i}`,
		title: ["SOP Evakuasi", "SOP Tanggap Darurat", "Panduan Sanitasi", "Laporan Curah Hujan"][i%4] + ` ${Math.floor(i/4)+1}`,
		type: (["PDF","DOCX","TXT","XLSX"][i%4]) as DocType,
		sizeKB: 120 + (i%7)*45,
		createdAt: new Date(Date.now() - i*48*60*60*1000).toISOString(),
		updatedAt: new Date(Date.now() - i*24*60*60*1000).toISOString(),
		status: (i%9===0?"Processing": i%7===0?"Failed":"Indexed") as DocStatus,
		tags: ["sop","evakuasi","logistik","banjir"].slice(0,(i%4)+1),
		source: ["BPBD","Dinas SDA","Internal","BMKG"][i%4],
		content: texts[i%texts.length] + "\n\n" + "Detail kebijakan dan langkah-langkah implementasi.",
	})).sort((a,b)=> (a.updatedAt < b.updatedAt ? 1 : -1))
}

const TYPE_FILTER: Array<"Semua" | DocType> = ["Semua","PDF","DOCX","TXT","XLSX","Image"]
const STATUS_FILTER: Array<"Semua" | DocStatus> = ["Semua","Indexed","Processing","Failed"]

export default function Page() {
	const [docs, setDocs] = React.useState<Doc[]>(genMockDocs())
	const [query, setQuery] = React.useState("")
	const [type, setType] = React.useState<"Semua" | DocType>("Semua")
	const [status, setStatus] = React.useState<"Semua" | DocStatus>("Semua")
	const [detail, setDetail] = React.useState<Doc | null>(null)
	const [openAdd, setOpenAdd] = React.useState(false)

	// Chat assistant state
	const [chat, setChat] = React.useState<ChatMessage[]>([])
	const [ask, setAsk] = React.useState("")
	const [scope, setScope] = React.useState<"Semua" | "SOP" | "Laporan" | "Panduan">("Semua")

	const total = docs.length
	const indexed = docs.filter(d => d.status === "Indexed").length
	const totalSize = docs.reduce((a,b)=> a + b.sizeKB, 0)
	const newWeek = docs.filter(d => Date.now() - new Date(d.createdAt).getTime() < 7*24*60*60*1000).length

	const filtered = React.useMemo(() => {
		let rows = docs.slice()
		if (query){
			const q = query.toLowerCase()
			rows = rows.filter(r => (r.title + " " + (r.tags ?? []).join(" ") + " " + r.source + " " + r.content).toLowerCase().includes(q))
		}
		if (type !== "Semua") rows = rows.filter(r => r.type === type)
		if (status !== "Semua") rows = rows.filter(r => r.status === status)
		rows.sort((a,b)=> (a.updatedAt < b.updatedAt ? 1 : -1))
		return rows
	}, [docs, query, type, status])

	function exportCSV(rows: Doc[]) {
		const headers = ["id","title","type","sizeKB","createdAt","updatedAt","status","tags","source"]
		const lines = [
			headers.join(","),
			...rows.map(r => [r.id, r.title, r.type, r.sizeKB, r.createdAt, r.updatedAt, r.status, (r.tags??[]).join("|"), r.source ?? ""].join(","))
		]
		const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `asisten-dokumen-${new Date().toISOString().slice(0,10)}.csv`
		a.click()
		URL.revokeObjectURL(url)
	}

	function addDoc(d: Omit<Doc, "id" | "createdAt" | "updatedAt" | "status">) {
		const added: Doc = { ...d, id: `DOC-${1000+docs.length}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: "Processing" }
		setDocs(prev => [added, ...prev])
	}
	function removeDoc(id: string) {
		setDocs(prev => prev.filter(r => r.id !== id))
	}

	// Mock chat search over docs content
	function answerQuestion(q: string) {
		const keyword = q.toLowerCase().split(/\s+/).filter(Boolean)
		const docsInScope = docs.filter(d => {
			if (scope === "Semua") return true
			if (scope === "SOP") return d.title.toLowerCase().includes("sop")
			if (scope === "Laporan") return d.title.toLowerCase().includes("laporan")
			if (scope === "Panduan") return d.title.toLowerCase().includes("panduan")
			return true
		})
		const matches = docsInScope.filter(d => keyword.some(k => d.content.toLowerCase().includes(k) || d.title.toLowerCase().includes(k)))
		const cites = matches.slice(0,3).map(m => `${m.id} — ${m.title}`)
		const text = matches.length
			? `Berikut ringkasan berdasarkan dokumen terkait (${cites.length} sumber):\n- ${matches[0].content.slice(0,160)}...`
			: "Maaf, saya tidak menemukan jawaban yang relevan di pustaka dokumen. Coba gunakan kata kunci berbeda atau perluas cakupan."
		setChat(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", text, cites }])
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
										<CardTitle>Total Dokumen</CardTitle>
										<CardDescription>di pustaka</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{total}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Sudah Terindeks</CardTitle>
										<CardDescription>siap ditanya</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{indexed}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Total Ukuran</CardTitle>
										<CardDescription>KB</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{totalSize.toLocaleString()} <span className="text-base font-normal text-muted-foreground">KB</span></CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Dokumen Baru (7 hari)</CardTitle>
										<CardDescription>unggahan terbaru</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{newWeek}</CardContent>
								</Card>
							</div>

							{/* Two-pane: library + assistant */}
							<div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
								{/* Library */}
								<Card className="order-2 lg:order-1">
									<CardHeader>
										<div className="flex items-center justify-between gap-3">
											<div>
												<CardTitle>Pustaka Dokumen</CardTitle>
												<CardDescription>pencarian, filter, dan ekspor</CardDescription>
											</div>
											<div className="flex gap-2">
												<Button onClick={()=>setOpenAdd(true)}>Upload/Index</Button>
												<Button variant="outline" onClick={()=>exportCSV(filtered)}>Export CSV</Button>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
											<div className="space-y-1 md:col-span-4 lg:col-span-5">
												<Label>Cari</Label>
												<Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="cth: SOP / sanitasi / laporan" />
											</div>
											<div className="space-y-1 md:col-span-2 lg:col-span-3">
												<Label>Tipe</Label>
												<Select value={type} onValueChange={(v)=>setType(v as any)}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent>
														{TYPE_FILTER.map(t => <SelectItem key={t} value={t as any}>{t}</SelectItem>)}
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
														<th className="px-3 py-2 text-left font-medium">Judul</th>
														<th className="px-3 py-2 text-left font-medium">Tipe</th>
														<th className="px-3 py-2 text-left font-medium">Ukuran</th>
														<th className="px-3 py-2 text-left font-medium">Update</th>
														<th className="px-3 py-2 text-left font-medium">Status</th>
														<th className="px-3 py-2 text-left font-medium">Aksi</th>
													</tr>
												</thead>
												<tbody>
													{filtered.map(d => (
														<tr key={d.id} className="even:bg-muted/20">
															<td className="px-3 py-2 font-mono">{d.id}</td>
															<td className="px-3 py-2">
																<div className="font-medium">{d.title}</div>
																<div className="max-w-[360px] truncate text-xs text-muted-foreground">{d.content}</div>
																<div className="mt-1 flex flex-wrap gap-1 text-[10px]">{(d.tags??[]).map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
															</td>
															<td className="px-3 py-2">{d.type}</td>
															<td className="px-3 py-2">{d.sizeKB.toLocaleString()} KB</td>
															<td className="px-3 py-2">{new Date(d.updatedAt).toLocaleString()}</td>
															<td className="px-3 py-2">
																<Badge variant={d.status === "Indexed" ? "outline" : d.status === "Processing" ? "secondary" : "destructive"}>{d.status}</Badge>
															</td>
															<td className="px-3 py-2">
																<div className="flex flex-wrap gap-2">
																	<Button size="sm" variant="outline" onClick={()=>setDetail(d)}>Detail</Button>
																	<Button size="sm" variant="destructive" onClick={()=>removeDoc(d.id)}>Hapus</Button>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</CardContent>
								</Card>

								{/* Assistant */}
								<Card className="order-1 lg:order-2">
									<CardHeader>
										<CardTitle>Asisten Dokumen</CardTitle>
										<CardDescription>tanyakan SOP, panduan, atau isi laporan</CardDescription>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6">
											<div className="md:col-span-4">
												<Label>Pertanyaan</Label>
												<Input value={ask} onChange={(e)=>setAsk(e.target.value)} placeholder="cth: langkah SOP evakuasi banjir?" onKeyDown={(e)=>{
													if(e.key === "Enter" && ask.trim()){
														const q = ask.trim()
														setChat(prev => [...prev, { id: crypto.randomUUID(), role: "user", text: q }])
														setAsk("")
														setTimeout(()=>answerQuestion(q), 0)
													}
												}} />
											</div>
											<div className="md:col-span-2">
												<Label>Cakupan</Label>
												<Select value={scope} onValueChange={(v)=>setScope(v as any)}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent>
														{(["Semua","SOP","Laporan","Panduan"] as const).map(s => <SelectItem key={s} value={s as any}>{s}</SelectItem>)}
													</SelectContent>
												</Select>
											</div>
										</div>
										<div className="h-[360px] w-full overflow-y-auto rounded-md border p-3 text-sm">
											{chat.length === 0 && (
												<div className="text-muted-foreground">Ajukan pertanyaan, contoh: "Ringkas isi SOP tanggap darurat terkait logistik."</div>
											)}
											{chat.map(m => (
												<div key={m.id} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
													<div className={`inline-block max-w-[90%] rounded-lg px-3 py-2 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
														<div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
														{m.cites && m.cites.length > 0 && (
															<div className="mt-2 text-xs text-muted-foreground">
																Sumber: {m.cites.join(", ")}
															</div>
														)}
													</div>
												</div>
											))}
										</div>
										<div className="flex justify-end">
											<Button
												onClick={()=>{
													const q = ask.trim(); if(!q) return;
													setChat(prev => [...prev, { id: crypto.randomUUID(), role: "user", text: q }])
													setAsk("")
													setTimeout(()=>answerQuestion(q), 0)
												}}
											>Kirim</Button>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Detail Sheet */}
							<Sheet open={!!detail} onOpenChange={(o)=>!o && setDetail(null)}>
								<SheetContent side="right" className="w-full sm:max-w-xl">
									<SheetHeader>
										<SheetTitle>Detail Dokumen</SheetTitle>
										<SheetDescription>{detail?.id} — {detail?.title}</SheetDescription>
									</SheetHeader>
									{detail && (
										<div className="mt-4 space-y-3">
											<div className="grid grid-cols-2 gap-2 text-sm">
												<div><span className="text-muted-foreground">Tipe:</span> {detail.type}</div>
												<div><span className="text-muted-foreground">Ukuran:</span> {detail.sizeKB.toLocaleString()} KB</div>
												<div><span className="text-muted-foreground">Sumber:</span> {detail.source}</div>
												<div><span className="text-muted-foreground">Status:</span> {detail.status}</div>
												<div className="col-span-2"><span className="text-muted-foreground">Update:</span> {new Date(detail.updatedAt).toLocaleString()}</div>
											</div>
											<div className="flex flex-wrap gap-1 text-[10px]">{(detail.tags??[]).map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
											<Separator />
											<div className="text-sm leading-relaxed whitespace-pre-wrap">{detail.content}</div>
											<div className="flex flex-wrap gap-2">
												<Button variant="secondary" onClick={()=>alert("Contoh indeks dokumen")}>Indeks Ulang</Button>
												<Button variant="outline" onClick={()=>setDetail(null)}>Tutup</Button>
											</div>
										</div>
									)}
								</SheetContent>
							</Sheet>

							{/* Upload/Index (mock) */}
							<Sheet open={openAdd} onOpenChange={setOpenAdd}>
								<SheetContent side="right" className="w-full sm:max-w-xl">
									<SheetHeader>
										<SheetTitle>Upload / Index Dokumen</SheetTitle>
										<SheetDescription>unggah file atau masukkan metadata</SheetDescription>
									</SheetHeader>
									<UploadForm onSubmit={(d) => { addDoc(d); setOpenAdd(false) }} />
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

function UploadForm({ onSubmit }: { onSubmit: (d: Omit<Doc, "id" | "createdAt" | "updatedAt" | "status">) => void }) {
	const [title, setTitle] = React.useState("")
	const [type, setType] = React.useState<DocType>("PDF")
	const [sizeKB, setSizeKB] = React.useState("256")
	const [source, setSource] = React.useState("")
	const [tags, setTags] = React.useState("sop,evakuasi")
	const [content, setContent] = React.useState("Ringkasan isi dokumen…")

	return (
		<form
			className="mt-4 space-y-3"
			onSubmit={(e)=>{
				e.preventDefault()
				onSubmit({ title, type, sizeKB: parseInt(sizeKB||"0"), updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() } as any)
			}}
		>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div className="space-y-1">
					<Label>Judul</Label>
					<Input value={title} onChange={(e)=>setTitle(e.target.value)} required />
				</div>
				<div className="space-y-1">
					<Label>Tipe</Label>
					<Select value={type} onValueChange={(v)=>setType(v as DocType)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{(TYPE_FILTER.filter(t=>t!=="Semua") as DocType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label>Ukuran (KB)</Label>
					<Input value={sizeKB} onChange={(e)=>setSizeKB(e.target.value)} />
				</div>
				<div className="space-y-1">
					<Label>Sumber</Label>
					<Input value={source} onChange={(e)=>setSource(e.target.value)} />
				</div>
				<div className="space-y-1 md:col-span-2">
					<Label>Tags (comma)</Label>
					<Input value={tags} onChange={(e)=>setTags(e.target.value)} />
				</div>
				<div className="space-y-1 md:col-span-2">
					<Label>Konten / Ringkasan</Label>
					<Input value={content} onChange={(e)=>setContent(e.target.value)} />
				</div>
			</div>
			<div className="pt-2">
				<Button type="submit" onClick={(e)=>{
					e.preventDefault()
					const doc: Omit<Doc, "id" | "createdAt" | "updatedAt" | "status"> = {
						title,
						type,
						sizeKB: parseInt(sizeKB||"0"),
						source,
						tags: tags.split(",").map(s=>s.trim()).filter(Boolean),
						content,
					}
					onSubmit(doc)
				}}>Simpan</Button>
			</div>
		</form>
	)
}

