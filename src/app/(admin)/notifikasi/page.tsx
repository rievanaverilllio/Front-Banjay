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

type Category = "Sistem" | "Peringatan Banjir" | "Laporan Masyarakat"
type Priority = "Normal" | "Penting" | "Darurat"

type Notification = {
	id: string
	title: string
	body: string
	category: Category
	source: string
	priority: Priority
	read: boolean
	archived?: boolean
	createdAt: string // ISO string
	location?: string
}

const CATEGORY_OPTIONS: Array<"Semua" | Category> = [
	"Semua",
	"Sistem",
	"Peringatan Banjir",
	"Laporan Masyarakat",
]

const PRIORITY_ORDER: Record<Priority, number> = {
	Darurat: 3,
	Penting: 2,
	Normal: 1,
}

function genMockNotifications(): Notification[] {
	const now = Date.now()
	const items: Notification[] = []
	const cats: Category[] = ["Sistem", "Peringatan Banjir", "Laporan Masyarakat"]
	const sources = {
		Sistem: "Sistem Otomatis",
		"Peringatan Banjir": "Sensor Curah Hujan",
		"Laporan Masyarakat": "Aplikasi Warga",
	} as const
	for (let i = 0; i < 36; i++) {
		const cat = cats[i % cats.length]
		const priority: Priority = i % 7 === 0 ? "Darurat" : i % 3 === 0 ? "Penting" : "Normal"
		const minutesAgo = 30 + i * 90
		const createdAt = new Date(now - minutesAgo * 60_000).toISOString()
		items.push({
			id: `NTF-${1000 + i}`,
			title:
				cat === "Sistem"
					? `Sistem: ${i % 2 === 0 ? "Sensor offline" : "Server beban tinggi"}`
					: cat === "Peringatan Banjir"
					? `Peringatan Banjir di Kecamatan ${["A", "B", "C", "D"][i % 4]}`
					: `Laporan Baru dari Warga #${i + 1}`,
			body:
				cat === "Sistem"
					? "Terjadi anomali pada data sensor, mohon periksa koneksi dan status perangkat."
					: cat === "Peringatan Banjir"
					? "Curah hujan tinggi terdeteksi dalam 3 jam terakhir, potensi banjir meningkat."
					: "Laporan masyarakat masuk: genangan air setinggi 20-40cm di sekitar kawasan.",
			category: cat,
			source: sources[cat],
			priority,
			read: i % 4 === 0 ? true : false,
			archived: false,
			createdAt,
			location: cat === "Peringatan Banjir" ? `Kecamatan ${["A", "B", "C", "D"][i % 4]}` : undefined,
		})
	}
	return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export default function Page() {
	const [items, setItems] = React.useState<Notification[]>(genMockNotifications())
	const [query, setQuery] = React.useState("")
	const [category, setCategory] = React.useState<"Semua" | Category>("Semua")
	const [onlyUnread, setOnlyUnread] = React.useState(false)
	const [prioritizeHigh, setPrioritizeHigh] = React.useState(true)
	const [detail, setDetail] = React.useState<Notification | null>(null)

	// Settings
	const [enabledCategories, setEnabledCategories] = React.useState<Record<Category, boolean>>({
		Sistem: true,
		"Peringatan Banjir": true,
		"Laporan Masyarakat": true,
	})
	const [channels, setChannels] = React.useState({ app: true, email: false, wa: false, sms: false })

	const today = new Date().toISOString().slice(0, 10)
	const weekAgoISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
	const newToday = items.filter((n) => n.createdAt.slice(0, 10) === today).length
	const newWeek = items.filter((n) => n.createdAt >= weekAgoISO).length
	const importantCount = items.filter((n) => n.priority === "Penting" || n.priority === "Darurat").length
	const unreadCount = items.filter((n) => !n.read).length
	const readCount = items.length - unreadCount

	const filtered = React.useMemo(() => {
		let data = items.filter((n) => !n.archived)
		// Apply category settings (enabled/disabled)
		data = data.filter((n) => enabledCategories[n.category])
		// UI filters
		if (category !== "Semua") data = data.filter((n) => n.category === category)
		if (onlyUnread) data = data.filter((n) => !n.read)
		if (query) {
			const q = query.toLowerCase()
			data = data.filter(
				(n) =>
					n.title.toLowerCase().includes(q) ||
					n.body.toLowerCase().includes(q) ||
					n.source.toLowerCase().includes(q) ||
					(n.location?.toLowerCase().includes(q) ?? false)
			)
		}
		// Sort: priority first if enabled, then time desc
		data.sort((a, b) => {
			if (prioritizeHigh) {
				const pd = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
				if (pd !== 0) return pd
			}
			return a.createdAt < b.createdAt ? 1 : -1
		})
		return data
	}, [items, enabledCategories, category, onlyUnread, query, prioritizeHigh])

	function markAllRead() {
		setItems((prev) => prev.map((n) => ({ ...n, read: true })))
	}
	function markRead(id: string, read = true) {
		setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read } : n)))
	}
	function archive(id: string) {
		setItems((prev) => prev.map((n) => (n.id === id ? { ...n, archived: true } : n)))
	}
	function remove(id: string) {
		setItems((prev) => prev.filter((n) => n.id !== id))
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
										<CardTitle>Baru Hari Ini</CardTitle>
										<CardDescription>Notifikasi masuk</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{newToday}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Baru Minggu Ini</CardTitle>
										<CardDescription>7 hari terakhir</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{newWeek}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Penting / Darurat</CardTitle>
										<CardDescription>prioritas tinggi</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{importantCount}</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Belum Dibaca</CardTitle>
										<CardDescription>vs dibaca</CardDescription>
									</CardHeader>
									<CardContent className="text-3xl font-semibold">{unreadCount} <span className="text-base font-normal text-muted-foreground">/ {readCount}</span></CardContent>
								</Card>
							</div>

							{/* Filters + list */}
							<div className="px-4 lg:px-6">
								<Card>
									<CardHeader>
										<CardTitle>Notifikasi</CardTitle>
										<CardDescription>timeline list, filter, pencarian</CardDescription>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="grid grid-cols-1 items-end gap-3 md:grid-cols-6 lg:grid-cols-12">
											<div className="space-y-1 md:col-span-4 lg:col-span-5">
												<Label>Cari</Label>
												<Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="cth: banjir / sensor / offline" />
											</div>
											<div className="space-y-1 md:col-span-2 lg:col-span-3">
												<Label>Kategori</Label>
												<Select value={category} onValueChange={(v) => setCategory(v as any)}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{CATEGORY_OPTIONS.map((c) => (
															<SelectItem key={c} value={c as any}>
																{c}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="flex items-center gap-2 md:col-span-2 lg:col-span-2">
												<Checkbox id="unread" checked={onlyUnread} onCheckedChange={(v) => setOnlyUnread(Boolean(v))} />
												<Label htmlFor="unread">Hanya belum dibaca</Label>
											</div>
											<div className="flex items-center justify-end gap-2 md:col-span-2 lg:col-span-2">
												<Button variant="outline" onClick={markAllRead}>Tandai semua sudah dibaca</Button>
											</div>
										</div>

										<div className="rounded-lg border">
											{/* Timeline */}
											<ul className="divide-y">
												{filtered.map((n) => (
													<li key={n.id} className="group cursor-pointer px-4 py-3 hover:bg-muted/40" onClick={() => setDetail(n)}>
														<div className="grid grid-cols-[auto,1fr,auto] items-start gap-3">
															{/* Dot */}
															<div className="relative mt-1 h-3 w-3 rounded-full"
																	 style={{ backgroundColor: n.priority === "Darurat" ? "#ef4444" : n.priority === "Penting" ? "#f59e0b" : "#6b7280" }}
															/>
															{/* Content */}
															<div className="min-w-0">
																<div className="flex flex-wrap items-center gap-2">
																	<div className="truncate font-medium">
																		{n.title}
																	</div>
																	<Badge variant="outline">{n.category}</Badge>
																	{n.priority !== "Normal" && (
																		<Badge variant={n.priority === "Darurat" ? "destructive" : "secondary"}>{n.priority}</Badge>
																	)}
																	{!n.read && <Badge className="bg-blue-600 text-white hover:bg-blue-600/90">Belum Dibaca</Badge>}
																</div>
																<div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.body}</div>
															</div>
															{/* Meta */}
															<div className="text-right text-xs text-muted-foreground whitespace-nowrap">
																<div>{new Date(n.createdAt).toLocaleString()}</div>
																{n.location && <div className="truncate">{n.location}</div>}
															</div>
														</div>
													</li>
												))}
												{filtered.length === 0 && (
													<li className="px-4 py-6 text-center text-sm text-muted-foreground">Tidak ada notifikasi</li>
												)}
											</ul>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Settings */}
							<div className="px-4 lg:px-6">
								<Card>
									<CardHeader>
										<CardTitle>Pengaturan Notifikasi</CardTitle>
										<CardDescription>aktifkan kategori, kanal penerimaan, prioritas</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div>
											<div className="mb-2 font-medium">Kategori</div>
											<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
												{(Object.keys(enabledCategories) as Category[]).map((c) => (
													<label key={c} className="flex cursor-pointer items-center gap-2 rounded-md border p-3">
														<Checkbox
															checked={enabledCategories[c]}
															onCheckedChange={(v) =>
																setEnabledCategories((prev) => ({ ...prev, [c]: Boolean(v) }))
															}
														/>
														<span>{c}</span>
													</label>
												))}
											</div>
										</div>

										<Separator />

										<div>
											<div className="mb-2 font-medium">Kanal Penerimaan</div>
											<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
												<label className="flex items-center gap-2 rounded-md border p-3">
													<Checkbox checked={channels.app} onCheckedChange={(v) => setChannels((p) => ({ ...p, app: Boolean(v) }))} />
													<span>Aplikasi</span>
												</label>
												<label className="flex items-center gap-2 rounded-md border p-3">
													<Checkbox checked={channels.email} onCheckedChange={(v) => setChannels((p) => ({ ...p, email: Boolean(v) }))} />
													<span>Email</span>
												</label>
												<label className="flex items-center gap-2 rounded-md border p-3">
													<Checkbox checked={channels.wa} onCheckedChange={(v) => setChannels((p) => ({ ...p, wa: Boolean(v) }))} />
													<span>WhatsApp</span>
												</label>
												<label className="flex items-center gap-2 rounded-md border p-3">
													<Checkbox checked={channels.sms} onCheckedChange={(v) => setChannels((p) => ({ ...p, sms: Boolean(v) }))} />
													<span>SMS</span>
												</label>
											</div>
										</div>

										<Separator />

										<div className="flex flex-wrap items-center justify-between gap-3">
											<div>
												<div className="font-medium">Prioritas Tampilan</div>
												<div className="text-sm text-muted-foreground">Tampilkan peringatan dini di atas</div>
											</div>
											<label className="flex items-center gap-2">
												<Checkbox checked={prioritizeHigh} onCheckedChange={(v) => setPrioritizeHigh(Boolean(v))} />
												<span>Prioritaskan Penting/Darurat</span>
											</label>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Detail Sheet */}
							<Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
								<SheetContent side="right" className="w-full sm:max-w-xl">
									<SheetHeader>
										<SheetTitle>Detail Notifikasi</SheetTitle>
										<SheetDescription>
											{detail?.id} — {detail?.category}
										</SheetDescription>
									</SheetHeader>
									{detail && (
										<div className="mt-4 space-y-3">
											<div>
												<div className="text-lg font-semibold">{detail.title}</div>
												<div className="mt-1 text-sm text-muted-foreground">{new Date(detail.createdAt).toLocaleString()}</div>
											</div>
											<div className="text-sm leading-relaxed">{detail.body}</div>
											<div className="grid gap-1 text-sm">
												<div><span className="text-muted-foreground">Sumber:</span> {detail.source}</div>
												{detail.location && <div><span className="text-muted-foreground">Lokasi:</span> {detail.location}</div>}
												<div><span className="text-muted-foreground">Prioritas:</span> {detail.priority}</div>
												<div><span className="text-muted-foreground">Status:</span> {detail.read ? "Dibaca" : "Belum Dibaca"}</div>
											</div>
											<Separator />
											<div className="flex flex-wrap gap-2">
												{!detail.read && (
													<Button onClick={() => { markRead(detail.id, true); setDetail({ ...detail, read: true }) }}>Tandai Dibaca</Button>
												)}
												{detail.read && (
													<Button variant="outline" onClick={() => { markRead(detail.id, false); setDetail({ ...detail, read: false }) }}>Tandai Belum Dibaca</Button>
												)}
												<Button variant="secondary" onClick={() => { archive(detail.id); setDetail(null) }}>Arsipkan</Button>
												<Button variant="destructive" onClick={() => { remove(detail.id); setDetail(null) }}>Hapus</Button>
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

