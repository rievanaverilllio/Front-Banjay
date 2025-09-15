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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type TicketStatus = "Baru" | "Proses" | "Selesai" | "Ditutup"
type TicketPriority = "Rendah" | "Sedang" | "Tinggi"

type Ticket = {
	id: string
	subject: string
	message: string
	category: string
	priority: TicketPriority
	status: TicketStatus
	createdAt: string
	updatedAt: string
	requester: string
	contact: string
}

type FAQ = { id: string; q: string; a: string; tags?: string[] }

const FAQS: FAQ[] = [
	{ id: "f1", q: "Bagaimana cara menambahkan data posko?", a: "Masuk ke menu Posko > klik Tambah Posko dan isi form yang tersedia.", tags: ["posko","tambah"] },
	{ id: "f2", q: "Kenapa peta tidak tampil?", a: "Pastikan koneksi internet stabil dan peramban tidak memblokir konten peta (Leaflet).", tags: ["peta","leaflet"] },
	{ id: "f3", q: "Bagaimana mengekspor data?", a: "Gunakan tombol Export CSV/Excel pada masing-masing tabel data.", tags: ["export","csv","excel"] },
]

function genTickets(): Ticket[] {
	return Array.from({ length: 10 }).map((_, i) => ({
		id: `TCK-${1000 + i}`,
		subject: ["Tidak bisa login", "Peta kosong", "Data curah hujan tidak update", "Butuh akses admin"][i % 4],
		message: "Detail kendala yang dialami pengguna. Mohon bantuan.",
		category: ["Akun", "Peta", "Data", "Akses"][i % 4],
		priority: (i % 5 === 0 ? "Tinggi" : i % 2 === 0 ? "Sedang" : "Rendah"),
		status: (i % 6 === 0 ? "Selesai" : i % 4 === 0 ? "Proses" : "Baru"),
		createdAt: new Date(Date.now() - i * 36 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
		requester: ["Budi", "Sari", "Agus", "Rina"][i % 4],
		contact: `08${Math.floor(100000000 + Math.random() * 899999999)}`,
	}))
}

const STATUS_FILTER: Array<"Semua" | TicketStatus> = ["Semua", "Baru", "Proses", "Selesai", "Ditutup"]
const PRIORITY_FILTER: Array<"Semua" | TicketPriority> = ["Semua", "Rendah", "Sedang", "Tinggi"]

export default function Page() {
	const [faqQuery, setFaqQuery] = React.useState("")
	const [tickets, setTickets] = React.useState<Ticket[]>(genTickets())
	const [ticketQuery, setTicketQuery] = React.useState("")
	const [status, setStatus] = React.useState<"Semua" | TicketStatus>("Semua")
	const [priority, setPriority] = React.useState<"Semua" | TicketPriority>("Semua")
	const [detail, setDetail] = React.useState<Ticket | null>(null)

	const total = tickets.length
	const openCount = tickets.filter(t => t.status === "Baru" || t.status === "Proses").length
	const solvedCount = tickets.filter(t => t.status === "Selesai").length
	const highPrioCount = tickets.filter(t => t.priority === "Tinggi").length

	const faqFiltered = React.useMemo(() => {
		if (!faqQuery) return FAQS
		const q = faqQuery.toLowerCase()
		return FAQS.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || (f.tags ?? []).some(t => t.toLowerCase().includes(q)))
	}, [faqQuery])

	const ticketFiltered = React.useMemo(() => {
		let rows = tickets.slice()
		if (ticketQuery) {
			const q = ticketQuery.toLowerCase()
			rows = rows.filter(t => (t.subject + " " + t.message + " " + t.requester).toLowerCase().includes(q))
		}
		if (status !== "Semua") rows = rows.filter(t => t.status === status)
		if (priority !== "Semua") rows = rows.filter(t => t.priority === priority)
		rows.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
		return rows
	}, [tickets, ticketQuery, status, priority])

	function exportCSV(rows: Ticket[]) {
		const headers = ["id","subject","category","priority","status","createdAt","updatedAt","requester","contact"]
		const lines = [headers.join(","), ...rows.map(t => [t.id, t.subject, t.category, t.priority, t.status, t.createdAt, t.updatedAt, t.requester, t.contact].join(","))]
		const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `tickets-${new Date().toISOString().slice(0,10)}.csv`
		a.click()
		URL.revokeObjectURL(url)
	}

	function addTicket(t: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">) {
		const added: Ticket = { ...t, id: `TCK-${1000 + tickets.length}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: "Baru" }
		setTickets(prev => [added, ...prev])
	}
	function updateTicket(id: string, patch: Partial<Ticket>) {
		setTickets(prev => prev.map(t => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)))
	}
	function removeTicket(id: string) {
		setTickets(prev => prev.filter(t => t.id !== id))
		setDetail(prev => (prev?.id === id ? null : prev))
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
										<CardTitle>Total Tiket</CardTitle>
										<CardDescription>semua kategori</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{total}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Tiket Aktif</CardTitle>
										<CardDescription>baru + proses</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{openCount}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Tiket Selesai</CardTitle>
										<CardDescription>ditutup</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{solvedCount}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Prioritas Tinggi</CardTitle>
										<CardDescription>perlu respon cepat</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{highPrioCount}</CardContent>
								</Card>
							</div>

							<div className="px-4 lg:px-6">
								<Tabs defaultValue="faq">
									<div className="flex items-center justify-between">
										<TabsList>
											<TabsTrigger value="faq">FAQ</TabsTrigger>
											<TabsTrigger value="panduan">Panduan</TabsTrigger>
											<TabsTrigger value="tiket">Tiket Bantuan</TabsTrigger>
										</TabsList>
										<div className="hidden md:block text-sm text-muted-foreground">Pusat bantuan untuk admin</div>
									</div>

									{/* FAQ */}
									<TabsContent value="faq" className="mt-3">
										<Card>
											<CardHeader>
												<CardTitle>FAQ</CardTitle>
												<CardDescription>pertanyaan yang sering diajukan</CardDescription>
											</CardHeader>
											<CardContent className="space-y-3">
												<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
													<div className="space-y-1 md:col-span-4 lg:col-span-6">
														<Label>Cari FAQ</Label>
														<Input value={faqQuery} onChange={(e)=>setFaqQuery(e.target.value)} placeholder="cth: posko / peta / export" />
													</div>
												</div>
												<div className="grid gap-3 md:grid-cols-2">
													{faqFiltered.map(f => (
														<div key={f.id} className="rounded-lg border p-3">
															<div className="font-medium">{f.q}</div>
															<div className="mt-1 text-sm text-muted-foreground">{f.a}</div>
															<div className="mt-2 flex flex-wrap gap-1 text-[10px]">{(f.tags??[]).map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									</TabsContent>

									{/* Panduan/Resources */}
									<TabsContent value="panduan" className="mt-3">
										<Card>
											<CardHeader>
												<CardTitle>Panduan & Resources</CardTitle>
												<CardDescription>tautan cepat dan langkah-langkah umum</CardDescription>
											</CardHeader>
											<CardContent className="space-y-3">
												<div className="grid gap-3 md:grid-cols-2">
													<div className="rounded-lg border p-3">
														<div className="font-medium">Mulai Cepat</div>
														<ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
															<li>Buat akun admin dan atur peran</li>
															<li>Konfigurasi peta dan sumber data</li>
															<li>Tambahkan posko dan uji alur laporan</li>
														</ul>
													</div>
													<div className="rounded-lg border p-3">
														<div className="font-medium">Troubleshooting</div>
														<ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
															<li>Peta kosong: cek koneksi internet, reload halaman</li>
															<li>Data tidak muncul: cek filter dan waktu</li>
															<li>Gagal ekspor: coba ulang dan periksa izin browser</li>
														</ul>
													</div>
													<div className="rounded-lg border p-3">
														<div className="font-medium">Kontak Darurat</div>
														<ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
															<li>BPBD Kota: 112 / 113</li>
															<li>Call Center Posko: 0800-xxxx</li>
														</ul>
													</div>
													<div className="rounded-lg border p-3">
														<div className="font-medium">Dokumentasi Sistem</div>
														<div className="mt-2 text-sm text-muted-foreground">Hubungi tim TI untuk akses dokumentasi internal.</div>
													</div>
												</div>
											</CardContent>
										</Card>
									</TabsContent>

									{/* Tiket Bantuan */}
									<TabsContent value="tiket" className="mt-3">
										<Card>
											<CardHeader>
												<div className="flex items-center justify-between gap-3">
													<div>
														<CardTitle>Tiket Bantuan</CardTitle>
														<CardDescription>buat, lacak, dan update</CardDescription>
													</div>
													<div className="flex gap-2">
														<Button onClick={()=>exportCSV(ticketFiltered)} variant="outline">Export CSV</Button>
													</div>
												</div>
											</CardHeader>
											<CardContent className="space-y-3">
												<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
													<div className="space-y-1 md:col-span-4 lg:col-span-5">
														<Label>Cari tiket</Label>
														<Input value={ticketQuery} onChange={(e)=>setTicketQuery(e.target.value)} placeholder="cth: login / peta / data" />
													</div>
													<div className="space-y-1 md:col-span-2 lg:col-span-3">
														<Label>Status</Label>
														<Select value={status} onValueChange={(v)=>setStatus(v as any)}>
															<SelectTrigger><SelectValue /></SelectTrigger>
															<SelectContent>
																{STATUS_FILTER.map(s => <SelectItem key={s} value={s as any}>{s}</SelectItem>)}
															</SelectContent>
														</Select>
													</div>
													<div className="space-y-1 md:col-span-2 lg:col-span-2">
														<Label>Prioritas</Label>
														<Select value={priority} onValueChange={(v)=>setPriority(v as any)}>
															<SelectTrigger><SelectValue /></SelectTrigger>
															<SelectContent>
																{PRIORITY_FILTER.map(p => <SelectItem key={p} value={p as any}>{p}</SelectItem>)}
															</SelectContent>
														</Select>
													</div>
												</div>
												<div className="rounded-lg border">
													<table className="w-full text-sm">
														<thead className="bg-muted/50">
															<tr>
																<th className="px-3 py-2 text-left font-medium">ID</th>
																<th className="px-3 py-2 text-left font-medium">Subjek</th>
																<th className="px-3 py-2 text-left font-medium">Kategori</th>
																<th className="px-3 py-2 text-left font-medium">Prioritas</th>
																<th className="px-3 py-2 text-left font-medium">Status</th>
																<th className="px-3 py-2 text-left font-medium">Diperbarui</th>
																<th className="px-3 py-2 text-left font-medium">Aksi</th>
															</tr>
														</thead>
														<tbody>
															{ticketFiltered.map(t => (
																<tr key={t.id} className="even:bg-muted/20">
																	<td className="px-3 py-2 font-mono">{t.id}</td>
																	<td className="px-3 py-2">
																		<div className="font-medium">{t.subject}</div>
																		<div className="max-w-[360px] truncate text-xs text-muted-foreground">{t.message}</div>
																	</td>
																	<td className="px-3 py-2">{t.category}</td>
																	<td className="px-3 py-2">
																		<Badge variant={t.priority === "Tinggi" ? "destructive" : t.priority === "Sedang" ? "secondary" : "outline"}>{t.priority}</Badge>
																	</td>
																	<td className="px-3 py-2">
																		<Badge variant={t.status === "Baru" ? "secondary" : t.status === "Proses" ? "outline" : "default"}>{t.status}</Badge>
																	</td>
																	<td className="px-3 py-2">{new Date(t.updatedAt).toLocaleString()}</td>
																	<td className="px-3 py-2">
																		<div className="flex flex-wrap gap-2">
																			<Button size="sm" variant="outline" onClick={()=>setDetail(t)}>Detail</Button>
																			<Button size="sm" variant="secondary" onClick={()=>updateTicket(t.id, { status: t.status === "Baru" ? "Proses" : "Selesai" })}>Ubah Status</Button>
																			<Button size="sm" variant="destructive" onClick={()=>removeTicket(t.id)}>Hapus</Button>
																		</div>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>

												{/* Create ticket */}
												<div className="rounded-lg border p-3">
													<div className="font-medium">Buat Tiket Baru</div>
													<CreateTicketForm onSubmit={addTicket} />
												</div>
											</CardContent>
										</Card>
									</TabsContent>
								</Tabs>
							</div>

							{/* Detail Sheet */}
							<Sheet open={!!detail} onOpenChange={(o)=>!o && setDetail(null)}>
								<SheetContent side="right" className="w-full sm:max-w-xl">
									<SheetHeader>
										<SheetTitle>Detail Tiket</SheetTitle>
										<SheetDescription>{detail?.id} — {detail?.subject}</SheetDescription>
									</SheetHeader>
									{detail && (
										<div className="mt-4 space-y-3">
											<div className="grid grid-cols-2 gap-2 text-sm">
												<div><span className="text-muted-foreground">Kategori:</span> {detail.category}</div>
												<div><span className="text-muted-foreground">Prioritas:</span> {detail.priority}</div>
												<div><span className="text-muted-foreground">Status:</span> {detail.status}</div>
												<div><span className="text-muted-foreground">Kontak:</span> {detail.requester} — {detail.contact}</div>
												<div className="col-span-2"><span className="text-muted-foreground">Diperbarui:</span> {new Date(detail.updatedAt).toLocaleString()}</div>
											</div>
											<Separator />
											<div className="text-sm leading-relaxed">{detail.message}</div>
											<div className="flex flex-wrap gap-2">
												<Button onClick={()=>updateTicket(detail.id, { status: "Proses" })}>Tandai Proses</Button>
												<Button variant="secondary" onClick={()=>updateTicket(detail.id, { status: "Selesai" })}>Tandai Selesai</Button>
												<Button variant="outline" onClick={()=>updateTicket(detail.id, { status: "Ditutup" })}>Tutup</Button>
												<Button variant="destructive" onClick={()=>removeTicket(detail.id)}>Hapus</Button>
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

function CreateTicketForm({ onSubmit }: { onSubmit: (t: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">) => void }) {
	const [subject, setSubject] = React.useState("")
	const [message, setMessage] = React.useState("")
	const [category, setCategory] = React.useState("Umum")
	const [priority, setPriority] = React.useState<TicketPriority>("Rendah")
	const [requester, setRequester] = React.useState("")
	const [contact, setContact] = React.useState("")

	return (
		<form className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2" onSubmit={(e)=>{ e.preventDefault(); onSubmit({ subject, message, category, priority, requester, contact }) }}>
			<div className="space-y-1">
				<Label>Subjek</Label>
				<Input value={subject} onChange={(e)=>setSubject(e.target.value)} required />
			</div>
			<div className="space-y-1">
				<Label>Kategori</Label>
				<Input value={category} onChange={(e)=>setCategory(e.target.value)} />
			</div>
			<div className="space-y-1 md:col-span-2">
				<Label>Pesan</Label>
				<Input value={message} onChange={(e)=>setMessage(e.target.value)} required />
			</div>
			<div className="space-y-1">
				<Label>Prioritas</Label>
				<Select value={priority} onValueChange={(v)=>setPriority(v as TicketPriority)}>
					<SelectTrigger><SelectValue /></SelectTrigger>
					<SelectContent>
						{(["Rendah","Sedang","Tinggi"] as const).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-1">
				<Label>Nama Pelapor</Label>
				<Input value={requester} onChange={(e)=>setRequester(e.target.value)} />
			</div>
			<div className="space-y-1">
				<Label>Kontak</Label>
				<Input value={contact} onChange={(e)=>setContact(e.target.value)} />
			</div>
			<div className="md:col-span-2 pt-1">
				<Button type="submit">Buat Tiket</Button>
			</div>
		</form>
	)
}

