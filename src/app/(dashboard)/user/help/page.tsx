"use client";

import React, { useMemo, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { HelpCircle, Search, BookOpen, MessageSquare, LifeBuoy, Mail, ChevronDown, ChevronRight, ExternalLink, AlertCircle, Loader2, CheckCircle2, FileQuestion, Phone } from 'lucide-react';

interface FaqItem { id:string; q:string; a:string; category:string; }
interface Ticket { id:string; subject:string; status:'open'|'pending'|'resolved'; created:string; updated:string; }

const FAQ: FaqItem[] = [
	{ id:'f1', category:'Dashboard', q:'Bagaimana cara memperbarui data dashboard?', a:'Data dashboard diperbarui otomatis setiap 15 menit. Anda dapat memaksa refresh dengan tombol Refresh pada bagian atas Dashboard.' },
	{ id:'f2', category:'Akun', q:'Saya lupa password, apa yang harus dilakukan?', a:'Gunakan halaman Forgot Password, masukkan email, lalu ikuti tautan reset yang dikirimkan.' },
	{ id:'f3', category:'Laporan', q:'Bisakah laporan diekspor ke PDF?', a:'Ya, tombol Download pada halaman Reports akan menyediakan versi PDF. (Masih placeholder pada demo ini).' },
	{ id:'f4', category:'Peta', q:'Mengapa peta tidak muncul?', a:'Pastikan koneksi internet stabil dan container peta memiliki tinggi yang cukup. Sistem juga menunda render sampai proses client-side siap.' },
	{ id:'f5', category:'Notifikasi', q:'Bagaimana mengatur ambang batas notifikasi?', a:'Masuk ke Settings > Notifications dan geser slider Threshold % untuk menyesuaikan.' },
	{ id:'f6', category:'Dokumen', q:'Apa arti versi dokumen?', a:'Setiap perubahan atau regenerasi menambah nomor versi sehingga Anda dapat melacak evolusi file.' },
	{ id:'f7', category:'Keamanan', q:'Apakah 2FA wajib?', a:'Tidak wajib, tetapi sangat disarankan untuk keamanan tambahan akun.' },
];

const TICKETS: Ticket[] = [
	{ id:'t101', subject:'Map layer tidak tampil', status:'resolved', created:iso(-86400*3), updated:iso(-86400) },
	{ id:'t102', subject:'Kesalahan saat upload CSV', status:'pending', created:iso(-86400*2), updated:iso(-3600*12) },
	{ id:'t103', subject:'Butuh panduan integrasi data', status:'open', created:iso(-3600*20), updated:iso(-3600*2) },
];

function iso(offsetSecondsFromNow:number){ return new Date(Date.now()+offsetSecondsFromNow*1000).toISOString(); }

export default function HelpPage(){
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const toggleSidebar = () => setIsSidebarOpen(o=>!o);
	const [search, setSearch] = useState('');
	const [openFaq, setOpenFaq] = useState<Set<string>>(new Set());
	const [category, setCategory] = useState<'All'|string>('All');
	const [creatingTicket, setCreatingTicket] = useState(false);
	const [ticketSubject, setTicketSubject] = useState('');
	const [ticketDesc, setTicketDesc] = useState('');
	const [ticketList, setTicketList] = useState<Ticket[]>(TICKETS);
	const [submitted, setSubmitted] = useState(false);

	const categories = useMemo(()=> ['All', ...Array.from(new Set(FAQ.map(f=> f.category)))], []);

	const filteredFaq = useMemo(()=> {
		const q = search.trim().toLowerCase();
		return FAQ.filter(f => (category==='All' || f.category===category) && (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)));
	}, [search, category]);

	const toggleFaq = (id:string) => setOpenFaq(s => { const n = new Set(s); n.has(id)? n.delete(id): n.add(id); return n; });

	const visibleTickets = useMemo(()=> ticketList.slice(0,5), [ticketList]);

	const createTicket = () => {
		if (!ticketSubject.trim() || !ticketDesc.trim()) return;
		setCreatingTicket(true);
		setTimeout(()=> {
			const t: Ticket = { id:'t'+Math.random().toString(36).slice(2,7), subject:ticketSubject.trim(), status:'open', created:new Date().toISOString(), updated:new Date().toISOString() };
			setTicketList(l => [t, ...l]);
			setTicketSubject('');
			setTicketDesc('');
			setCreatingTicket(false);
			setSubmitted(true);
			setTimeout(()=> setSubmitted(false), 2000);
		}, 900);
	};

	return (
		<div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
			<UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			<div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
				<UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
				<main className="flex-1 overflow-y-auto p-6 space-y-10">
					{/* Header */}
					<section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
								<HelpCircle className="w-7 h-7 text-blue-600" /> Bantuan & Dukungan
							</h1>
							<p className="text-sm text-gray-500 mt-1">Cari jawaban cepat, pelajari dasar, atau hubungi tim kami.</p>
						</div>
						<div className="flex flex-wrap gap-3 items-center">
							<div className="relative">
								<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Cari FAQ..." className="pl-9 pr-3 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-56" />
							</div>
							<div className="relative">
								<BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<select value={category} onChange={e=> setCategory(e.target.value)} className="pl-9 pr-8 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
									{categories.map(c => <option key={c}>{c}</option>)}
								</select>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">▼</span>
							</div>
						</div>
					</section>

					{/* Quick Start */}
					<section className="grid gap-6 md:grid-cols-3">
						<Card icon={<LifeBuoy className="w-5 h-5" />} title="Mulai Cepat" desc="Langkah dasar navigasi & fitur utama.">
							<ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
								<li>Buka Dashboard untuk ringkasan situasi.</li>
								<li>Cek Reports untuk dokumen terbaru.</li>
								<li>Atur notifikasi di Settings.</li>
							</ul>
						</Card>
						<Card icon={<FileQuestion className="w-5 h-5" />} title="FAQ Utama" desc="Pertanyaan populer pengguna baru.">
							<ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
								{FAQ.slice(0,3).map(f => <li key={f.id}>{f.q}</li>)}
							</ul>
						</Card>
						<Card icon={<MessageSquare className="w-5 h-5" />} title="Butuh Bantuan?" desc="Buat tiket dukungan ke tim.">
							<p className="text-xs text-gray-600">Gunakan formulir di bawah untuk menjelaskan masalah.</p>
						</Card>
					</section>

					{/* FAQ */}
					<section className="space-y-4">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Pertanyaan yang Sering Diajukan <span className="text-xs text-gray-500 font-medium">({filteredFaq.length})</span></h2>
						<div className="space-y-2">
							{filteredFaq.map(f => {
								const open = openFaq.has(f.id);
								return (
									<div key={f.id} className="border border-gray-200 bg-white rounded-xl overflow-hidden">
										<button onClick={()=> toggleFaq(f.id)} className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-gray-50">
											<div className="flex flex-col">
												<span className="font-medium text-gray-800 text-sm">{f.q}</span>
												<span className="text-[10px] uppercase tracking-wide text-gray-400">{f.category}</span>
											</div>
											{open ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
										</button>
										{open && (
											<div className="px-5 pb-5 -mt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
												{highlight(f.a, search)}
											</div>
										)}
									</div>
								);
							})}
							{filteredFaq.length===0 && <div className="p-8 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50">Tidak ada hasil.</div>}
						</div>
					</section>

					{/* Support Ticket Form & Recent Tickets */}
					<section className="grid gap-8 lg:grid-cols-3">
						<div className="lg:col-span-2 space-y-6">
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
								<h2 className="text-lg font-semibold flex items-center gap-2"><LifeBuoy className="w-5 h-5 text-blue-600" /> Formulir Dukungan</h2>
								<div className="space-y-4">
									<div className="flex flex-col gap-1 text-xs font-medium text-gray-600">
										<span className="uppercase tracking-wide">Subjek</span>
										<input value={ticketSubject} onChange={e=> setTicketSubject(e.target.value)} placeholder="Ringkas masalah..." className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
									</div>
									<div className="flex flex-col gap-1 text-xs font-medium text-gray-600">
										<span className="uppercase tracking-wide">Deskripsi</span>
										<textarea value={ticketDesc} onChange={e=> setTicketDesc(e.target.value)} rows={4} placeholder="Jelaskan detail langkah, pesan error, ekspektasi..." className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y" />
									</div>
									<div className="flex flex-wrap items-center gap-3">
										<button disabled={!ticketSubject.trim() || !ticketDesc.trim() || creatingTicket} onClick={createTicket} className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40 flex items-center gap-2">
											{creatingTicket && <Loader2 className="w-4 h-4 animate-spin" />} Kirim Tiket
										</button>
										{submitted && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Terkirim!</span>}
										<span className="text-[11px] text-gray-500">Estimasi respons &lt; 24 jam (demo).</span>
									</div>
								</div>
							</div>
						</div>
						<div className="space-y-6">
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
								<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Tiket Terbaru</h3>
								<ul className="space-y-3 text-sm">
									{visibleTickets.map(t => (
										<li key={t.id} className="flex flex-col gap-1 border border-gray-100 rounded-lg p-3 bg-gray-50">
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-800 line-clamp-1">{t.subject}</span>
												<StatusBadge status={t.status} />
											</div>
											<span className="text-[10px] uppercase tracking-wide text-gray-400">{timeAgo(t.updated)}</span>
										</li>
									))}
									{visibleTickets.length===0 && <li className="text-xs text-gray-500">Belum ada tiket.</li>}
								</ul>
							</div>
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
								<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Kontak Langsung</h3>
								<ul className="text-xs text-gray-600 space-y-2">
									<li className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> support@banjay.ai</li>
									<li className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" /> +62 812 3456 7890</li>
									<li className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-600" /> Chat internal (Messages)</li>
								</ul>
							</div>
						</div>
					</section>

					{/* Resources */}
					<section className="space-y-4">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Sumber & Referensi</h2>
						<div className="grid gap-6 md:grid-cols-3">
							<ResourceCard title="Panduan Pengguna" desc="Struktur modul, navigasi, dan istilah." link="#" />
							<ResourceCard title="Best Practices" desc="Optimasi monitoring & alur kerja." link="#" />
							<ResourceCard title="Changelog" desc="Riwayat fitur & perbaikan." link="#" />
						</div>
					</section>

					<footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
						<span>FAQ: {filteredFaq.length}</span>
						<span>Tiket: {ticketList.length}</span>
						<span className="ml-auto">© {new Date().getFullYear()} Banjay Analytics</span>
					</footer>
				</main>
			</div>
		</div>
	);
}

function Card({ icon, title, desc, children }:{ icon:React.ReactNode; title:string; desc:string; children?:React.ReactNode }){
	return (
		<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
			<div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">{icon}{title}</div>
			<p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
			{children}
		</div>
	);
}

function StatusBadge({ status }:{ status:Ticket['status'] }){
	const map: Record<Ticket['status'], {label:string; cls:string}> = {
		open: { label:'OPEN', cls:'bg-amber-100 text-amber-700 border-amber-200' },
		pending: { label:'PENDING', cls:'bg-blue-100 text-blue-700 border-blue-200' },
		resolved: { label:'RESOLVED', cls:'bg-green-100 text-green-700 border-green-200' },
	};
	const d = map[status];
	return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${d.cls}`}>{d.label}</span>;
}

function ResourceCard({ title, desc, link }:{ title:string; desc:string; link:string }){
	return (
		<a href={link} className="group relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-gray-900">{title}</h3>
				<ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
			</div>
			<p className="text-xs text-gray-600 leading-relaxed flex-1">{desc}</p>
			<span className="text-[11px] text-blue-600 font-medium">Buka &rarr;</span>
			<span className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-blue-200 pointer-events-none" />
		</a>
	);
}

function highlight(text:string, q:string){
	if(!q.trim()) return text;
	const parts = text.split(new RegExp(`(${escapeRegex(q)})`, 'ig'));
	return (
		<>
			{parts.map((p,i)=> p.toLowerCase()===q.toLowerCase() ? <mark key={i} className="bg-yellow-200 px-1 rounded" >{p}</mark> : p)}
		</>
	);
}

function escapeRegex(s:string){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

function timeAgo(isoDate:string){
	const diff = Date.now() - new Date(isoDate).getTime();
	const s = Math.floor(diff/1000);
	if(s<60) return s+'s ago';
	const m = Math.floor(s/60); if(m<60) return m+'m ago';
	const h = Math.floor(m/60); if(h<24) return h+'h ago';
	const d = Math.floor(h/24); if(d<7) return d+'d ago';
	const w = Math.floor(d/7); if(w<5) return w+'w ago';
	const mo = Math.floor(d/30); if(mo<12) return mo+'mo ago';
	const y = Math.floor(d/365); return y+'y ago';
}

