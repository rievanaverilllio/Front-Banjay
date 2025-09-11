"use client";

import React, { useEffect, useRef, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { User, Mail, Shield, Activity, Award, Edit2, Loader2, CheckCircle2, Upload, Settings, Clock, MapPin, Globe, Bell } from 'lucide-react';

interface ActivityItem { id:string; ts:string; label:string; }
interface Badge { id:string; name:string; desc:string; icon:string; earned:boolean; }

const ACTIVITIES: ActivityItem[] = [
	{ id:'a1', ts:iso(-3600*2), label:'Viewed Dashboard' },
	{ id:'a2', ts:iso(-3600*3), label:'Updated Notification Threshold' },
	{ id:'a3', ts:iso(-3600*5), label:'Downloaded Situation Report' },
	{ id:'a4', ts:iso(-3600*8), label:'Changed Password' },
	{ id:'a5', ts:iso(-86400), label:'Enabled Two-Factor Auth' },
];

const BADGES: Badge[] = [
	{ id:'b1', name:'Early Adopter', desc:'Bergabung pada fase awal platform.', icon:'🌱', earned:true },
	{ id:'b2', name:'Secure Account', desc:'Mengaktifkan 2FA.', icon:'🔐', earned:true },
	{ id:'b3', name:'Data Explorer', desc:'Membuka 25+ laporan.', icon:'📊', earned:false },
	{ id:'b4', name:'Night Owl', desc:'Aktif di luar jam kerja.', icon:'🌙', earned:false },
];

function iso(offsetSecondsFromNow:number){ return new Date(Date.now()+offsetSecondsFromNow*1000).toISOString(); }

export default function ProfilePage(){
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const toggleSidebar = () => setIsSidebarOpen(o=>!o);
	const [displayName, setDisplayName] = useState('Rievan A.');
	const [email, setEmail] = useState('rievan@example.com');
	const [location, setLocation] = useState('Jakarta, Indonesia');
	const [bio, setBio] = useState('Analyst focusing on flood risk & operational coordination.');
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState<string | null>(null);
	const [editing, setEditing] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement|null>(null);

	const valid = displayName.trim() && email.includes('@');

	const save = () => {
		if(!valid) return; setSaving(true); setTimeout(()=> { setSaving(false); setEditing(false); setSavedAt(new Date().toISOString()); }, 900);
	};

	const onAvatarChange = (files: FileList | null) => {
		if(!files || !files[0]) return; const f = files[0]; const url = URL.createObjectURL(f); setAvatarPreview(url); };

	return (
		<div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
			<UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			<div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
				<UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
				<main className="flex-1 overflow-y-auto p-6 space-y-10">
					{/* Header */}
					<section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900"><User className="w-7 h-7 text-blue-600" /> Profil Pengguna</h1>
							<p className="text-sm text-gray-500 mt-1">Kelola identitas, preferensi tampilan, dan ringkasan aktivitas.</p>
						</div>
						<div className="flex flex-wrap gap-3">
							{!editing && <button onClick={()=> setEditing(true)} className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit Profil</button>}
							{editing && (
								<div className="flex gap-2">
									<button disabled={!valid || saving} onClick={save} className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />} Simpan</button>
									<button disabled={saving} onClick={()=> { setEditing(false); }} className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300">Batal</button>
								</div>
							)}
						</div>
					</section>

					{/* Top Layout */}
					<section className="grid gap-8 xl:grid-cols-3">
						<div className="xl:col-span-2 space-y-8">
							{/* Profile Card */}
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
								<div className="flex flex-col md:flex-row md:items-start gap-6">
									<div className="flex flex-col items-center gap-3 md:w-48">
										<div className="relative">
											<div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center text-4xl shadow-inner overflow-hidden">
												{avatarPreview ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" /> : displayName.slice(0,1)}
											</div>
											{editing && <button onClick={()=> fileRef.current?.click()} className="absolute bottom-2 right-2 px-2.5 py-1.5 rounded-full bg-black/80 text-white text-[11px] font-medium flex items-center gap-1"><Upload className="w-3 h-3" /> Ganti</button>}
											<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=> onAvatarChange(e.target.files)} />
										</div>
										<div className="text-center space-y-1">
											<h2 className="text-lg font-semibold text-gray-900">{displayName}</h2>
											<p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Mail className="w-3 h-3" /> {email}</p>
											<p className="text-[11px] text-gray-500 flex items-center justify-center gap-1"><MapPin className="w-3 h-3" /> {location}</p>
										</div>
									</div>
									<div className="flex-1 flex flex-col gap-6">
										<div className="space-y-3">
											<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Ringkasan</h3>
											{!editing && <p className="text-sm text-gray-700 leading-relaxed">{bio}</p>}
											{editing && (
												<textarea value={bio} onChange={e=> setBio(e.target.value)} rows={4} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y" />
											)}
											{savedAt && <p className="text-[11px] text-gray-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Disimpan {timeAgo(savedAt)}</p>}
										</div>
										{editing && (
											<div className="grid sm:grid-cols-2 gap-5">
												<Field label="Nama Tampilan"><input value={displayName} onChange={e=> setDisplayName(e.target.value)} className="input" /></Field>
												<Field label="Email"><input value={email} onChange={e=> setEmail(e.target.value)} className="input" /></Field>
												<Field label="Lokasi"><input value={location} onChange={e=> setLocation(e.target.value)} className="input" /></Field>
												<Field label="Zona Waktu"><select className="input"><option>GMT+7 (WIB)</option><option>GMT+8 (WITA)</option><option>GMT+9 (WIT)</option></select></Field>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Activity */}
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
								<h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900"><Activity className="w-5 h-5 text-blue-600" /> Aktivitas Terbaru</h3>
								<ul className="space-y-3">
									{ACTIVITIES.map(a => (
										<li key={a.id} className="flex items-center gap-3 text-sm">
											<span className="w-2 h-2 rounded-full bg-blue-500" />
											<span className="flex-1 text-gray-700">{a.label}</span>
											<span className="text-[11px] text-gray-500">{timeAgo(a.ts)}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="space-y-8">
							{/* Badges */}
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
								<h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900"><Award className="w-5 h-5 text-blue-600" /> Pencapaian</h3>
								<ul className="grid sm:grid-cols-2 gap-4 text-sm">
									{BADGES.map(b => (
										<li key={b.id} className={`relative border rounded-xl p-4 flex flex-col gap-2 ${b.earned ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200':'bg-gray-50 border-gray-200'}`}>
											<div className="flex items-center justify-between">
												<span className="text-xl" aria-hidden>{b.icon}</span>
												{b.earned && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
											</div>
											<p className="font-semibold text-gray-900 leading-snug text-sm">{b.name}</p>
											<p className="text-[11px] text-gray-600 leading-snug flex-1">{b.desc}</p>
											{!b.earned && <span className="text-[10px] uppercase tracking-wide text-gray-400">Belum diraih</span>}
										</li>
									))}
								</ul>
							</div>

							{/* Preferences Snapshot */}
							<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
								<h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900"><Settings className="w-5 h-5 text-blue-600" /> Preferensi</h3>
								<ul className="text-xs text-gray-600 space-y-2">
									<li className="flex items-center gap-2"><Bell className="w-4 h-4 text-blue-600" /> Notifikasi: <span className="font-medium text-gray-900">Aktif (Email, Daily Summary)</span></li>
									<li className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-600" /> 2FA: <span className="font-medium text-gray-900">Enabled</span></li>
									<li className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> Zona Waktu: <span className="font-medium text-gray-900">WIB (GMT+7)</span></li>
									<li className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" /> Bahasa: <span className="font-medium text-gray-900">EN</span></li>
								</ul>
								<p className="text-[11px] text-gray-500">Sinkronkan preferensi di Settings untuk pembaruan.</p>
							</div>
						</div>
					</section>

					<footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
						<span>Status: {editing ? 'Mengedit' : 'Tampilan'}</span>
						{savedAt && <span>Terakhir disimpan {timeAgo(savedAt)}</span>}
						<span className="ml-auto">© {new Date().getFullYear()} Banjay Analytics</span>
					</footer>
				</main>
			</div>
		</div>
	);
}

function Field({label, children}:{label:string; children:React.ReactNode}){
	return (
		<label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
			<span className="uppercase tracking-wide">{label}</span>
			{children}
		</label>
	);
}

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

// Utility classes referenced: .input defined conceptually (rounded border styling) used across pages.
