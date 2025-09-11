"use client";

import React, { useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, Building2, Clock, Globe, Linkedin, Twitter, MessageSquare, Users } from 'lucide-react';

interface TeamMember { id:string; name:string; role:string; avatar?:string; focus:string; }
const TEAM: TeamMember[] = [
	{ id:'t1', name:'Ayu Prasetyo', role:'Customer Success Lead', focus:'Onboarding & Training' },
	{ id:'t2', name:'Dimas Rahman', role:'Technical Support', focus:'Integrations & Dataflow' },
	{ id:'t3', name:'Rudi Santoso', role:'Incident Analyst', focus:'Monitoring & Alerts' },
	{ id:'t4', name:'Siti Lestari', role:'Documentation Specialist', focus:'Guides & Knowledge Base' },
];

export default function ContactPage(){
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const toggleSidebar = () => setIsSidebarOpen(o=>!o);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [topic, setTopic] = useState('General');
	const [message, setMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [sent, setSent] = useState(false);

	const valid = name.trim() && email.includes('@') && message.trim();

	const submit = () => {
		if(!valid) return;
		setSubmitting(true);
		setTimeout(()=> { setSubmitting(false); setSent(true); setName(''); setEmail(''); setMessage(''); setTimeout(()=> setSent(false), 3000); }, 1100);
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
							<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Hubungi Kami</h1>
							<p className="text-sm text-gray-500 mt-1">Tim kami siap membantu terkait platform, data, dan integrasi.</p>
						</div>
						<div className="flex flex-wrap gap-3 text-xs text-gray-500">
							<span className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-600" /> Respons &lt; 24 jam</span>
							<span className="flex items-center gap-1"><Globe className="w-4 h-4 text-blue-600" /> Zona WIB</span>
						</div>
					</section>

					{/* Info + Form */}
					<section className="grid gap-8 lg:grid-cols-3">
						<div className="space-y-6 lg:col-span-2">
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
								<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" /> Formulir Kontak</h2>
								<div className="grid sm:grid-cols-2 gap-5">
									<Field label="Nama">
										<input value={name} onChange={e=> setName(e.target.value)} className="input" placeholder="Nama lengkap" />
									</Field>
									<Field label="Email">
										<input value={email} onChange={e=> setEmail(e.target.value)} className="input" placeholder="email@contoh.com" />
									</Field>
									<Field label="Topik">
										<select value={topic} onChange={e=> setTopic(e.target.value)} className="input">
											<option>General</option>
											<option>Billing</option>
											<option>Integration</option>
											<option>Incident</option>
											<option>Feedback</option>
										</select>
									</Field>
									<Field label="Prioritas">
										<select className="input">
											<option>Normal</option>
											<option>High</option>
											<option>Urgent</option>
										</select>
									</Field>
									<Field label="Pesan" className="sm:col-span-2">
										<textarea value={message} onChange={e=> setMessage(e.target.value)} rows={5} placeholder="Jelaskan detail kebutuhan atau masalah..." className="input resize-y" />
									</Field>
								</div>
								<div className="flex flex-wrap items-center gap-4">
									<button disabled={!valid || submitting} onClick={submit} className="btn-primary flex items-center gap-2">{submitting && <Loader2 className="w-4 h-4 animate-spin" />} Kirim Pesan</button>
									{sent && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Terkirim!</span>}
									{!valid && (name || email || message) && <span className="text-xs text-amber-600">Lengkapi semua field yang wajib.</span>}
									<span className="text-[11px] text-gray-500">Data dikirim sebagai simulasi (demo).</span>
								</div>
							</div>

							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
								<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Tim Dukungan</h2>
								<ul className="grid sm:grid-cols-2 gap-4 text-sm">
									{TEAM.map(m => (
										<li key={m.id} className="group border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow transition flex flex-col gap-1">
											<div className="flex items-center justify-between">
												<span className="font-semibold text-gray-900">{m.name}</span>
												<span className="text-[10px] uppercase tracking-wide text-gray-400">{m.role}</span>
											</div>
											<p className="text-[11px] text-gray-600">Fokus: {m.focus}</p>
											<div className="flex gap-2 mt-1">
												<a href="#" className="p-1.5 rounded bg-white border border-gray-200 hover:border-blue-400 text-gray-500 hover:text-blue-600" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
												<a href="#" className="p-1.5 rounded bg-white border border-gray-200 hover:border-blue-400 text-gray-500 hover:text-blue-600" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="space-y-6">
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
								<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600" /> Kontak Langsung</h2>
								<ul className="text-sm text-gray-600 space-y-2">
									<li className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> support@banjay.ai</li>
									<li className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" /> +62 812 3456 7890</li>
									<li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /> Jakarta, Indonesia</li>
								</ul>
								<div className="h-40 w-full bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500">
									Map Placeholder
								</div>
								<p className="text-[11px] text-gray-500">Tambahkan peta interaktif (Leaflet/Mapbox) bila backend lokasi siap.</p>
							</div>
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
								<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Jam Operasional</h3>
								<ul className="text-xs text-gray-600 space-y-1">
									<li>Senin - Jumat: 08:00 - 18:00 WIB</li>
									<li>Sabtu: 09:00 - 13:00 WIB</li>
									<li>Minggu & Libur: On-call kritikal</li>
								</ul>
							</div>
						</div>
					</section>

					<footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
						<span>Status: {sent ? 'Pesan terkirim' : 'Menunggu input'}</span>
						<span className="ml-auto">© {new Date().getFullYear()} Banjay Analytics</span>
					</footer>
				</main>
			</div>
		</div>
	);
}

function Field({label, children, className}:{label:string; children:React.ReactNode; className?:string}){
	return (
		<label className={`flex flex-col gap-1 text-xs font-medium text-gray-600 ${className||''}`}>
			<span className="uppercase tracking-wide">{label}</span>
			{children}
		</label>
	);
}

// Utility classes referenced: .input, .btn-primary (defined conceptually in other pages)
