"use client";

import React, { useEffect, useMemo, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { User, Shield, Bell, Palette, Activity, Eye, EyeOff, CheckCircle2, Lock, Globe, Loader2 } from 'lucide-react';

interface AuditItem { id:string; ts:string; action:string; ip:string; meta?:string; }

const seedAudit: AuditItem[] = [
	{ id:'a1', ts:iso(-3600*2), action:'Login Success', ip:'203.12.44.8', meta:'Browser Chrome 127' },
	{ id:'a2', ts:iso(-3600*5), action:'Password Changed', ip:'203.12.44.8' },
	{ id:'a3', ts:iso(-86400), action:'2FA Enabled', ip:'203.12.44.8' },
];

function iso(offsetSecondsFromNow:number) { return new Date(Date.now()+offsetSecondsFromNow*1000).toISOString(); }

export default function SettingsPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const toggleSidebar = () => setIsSidebarOpen(o=>!o);

	// Tabs
	const tabs = [
		{ id:'profile', label:'Profile', icon: <User className="w-4 h-4" /> },
		{ id:'security', label:'Security', icon: <Shield className="w-4 h-4" /> },
		{ id:'notifications', label:'Notifications', icon: <Bell className="w-4 h-4" /> },
		{ id:'preferences', label:'Preferences', icon: <Palette className="w-4 h-4" /> },
		{ id:'audit', label:'Audit Log', icon: <Activity className="w-4 h-4" /> },
	] as const;
	type TabId = typeof tabs[number]['id'];
	const [tab, setTab] = useState<TabId>('profile');

	// Profile
	const [name, setName] = useState('Rievan A.');
	const [email, setEmail] = useState('rievan@example.com');
	const [org, setOrg] = useState('Banjay Analytics');
	const [savingProfile, setSavingProfile] = useState(false);
	const [profileSavedAt, setProfileSavedAt] = useState<string | null>(null);

	// Security
	const [passwordOld, setPasswordOld] = useState('');
	const [passwordNew, setPasswordNew] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [twoFA, setTwoFA] = useState(true);
	const [savingPassword, setSavingPassword] = useState(false);

	// Notifications
	const [notifEmail, setNotifEmail] = useState(true);
	const [notifPush, setNotifPush] = useState(false);
	const [notifSummaryDaily, setNotifSummaryDaily] = useState(true);
	const [notifThreshold, setNotifThreshold] = useState(75);

	// Preferences
	const [theme, setTheme] = useState<'light'|'dark'|'system'>('light');
	const [lang, setLang] = useState('en');
	const [density, setDensity] = useState<'comfortable'|'compact'>('comfortable');

	// Audit
	const [audit, setAudit] = useState<AuditItem[]>(seedAudit);

	const profileValid = name.trim() && email.includes('@') && org.trim();
	const passwordStrong = passwordNew.length >= 8 && /[A-Z]/.test(passwordNew) && /[0-9]/.test(passwordNew);
	const passwordMatch = passwordNew && passwordNew === passwordConfirm;
	const passwordValid = passwordOld && passwordStrong && passwordMatch;

	const saveProfile = () => {
		if (!profileValid) return;
		setSavingProfile(true);
		setTimeout(()=> { setSavingProfile(false); setProfileSavedAt(new Date().toISOString()); }, 800);
	};

	const changePassword = () => {
		if (!passwordValid) return;
		setSavingPassword(true);
		setTimeout(()=> { setSavingPassword(false); setPasswordOld(''); setPasswordNew(''); setPasswordConfirm(''); }, 1000);
	};

	const filteredAudit = useMemo(()=> audit.slice(0,15), [audit]);

	return (
		<div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
			<UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			<div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
				<UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
				<main className="flex-1 overflow-y-auto p-6 space-y-8">
					{/* Title + Tabs */}
					<section className="space-y-4">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
							<div>
								<h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900"><SettingsIcon /> Settings</h1>
								<p className="text-sm text-gray-500 mt-1">Manage profile, security, and application preferences.</p>
							</div>
						</div>
						<nav className="flex flex-wrap gap-2 text-sm">
							{tabs.map(t => (
								<button key={t.id} onClick={()=> setTab(t.id)} className={`px-4 py-2 rounded-full border transition flex items-center gap-2 ${tab===t.id ? 'bg-black text-white border-black shadow':'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>{t.icon}{t.label}</button>
							))}
						</nav>
					</section>

					{tab==='profile' && (
						<section className="grid gap-8 lg:grid-cols-3">
							<div className="lg:col-span-2 space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
									<h2 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-blue-600" /> Profile Information</h2>
									<div className="grid sm:grid-cols-2 gap-5">
										<Field label="Full Name">
											<input value={name} onChange={e=> setName(e.target.value)} className="input" />
										</Field>
										<Field label="Email">
											<input value={email} onChange={e=> setEmail(e.target.value)} className="input" />
										</Field>
										<Field label="Organization" className="sm:col-span-2">
											<input value={org} onChange={e=> setOrg(e.target.value)} className="input" />
										</Field>
									</div>
									<div className="flex flex-wrap items-center gap-3">
										<button disabled={!profileValid || savingProfile} onClick={saveProfile} className="btn-primary flex items-center gap-2">{savingProfile && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes</button>
										{profileSavedAt && <span className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Saved {timeAgo(profileSavedAt)}</span>}
									</div>
								</div>
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
									<h2 className="text-lg font-semibold flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600" /> Public Profile</h2>
									<p className="text-sm text-gray-600">Control information displayed to collaborators.</p>
									<div className="space-y-3 text-xs text-gray-600">
										<p>Name and organization will be visible in shared reports. Email remains private.</p>
									</div>
								</div>
							</div>
							<div className="space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
									<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Status</h3>
									<ul className="text-xs text-gray-600 space-y-1">
										<li>Account: <span className="font-medium text-gray-900">Active</span></li>
										<li>2FA: <span className="font-medium text-gray-900">{twoFA? 'Enabled':'Disabled'}</span></li>
										<li>Last Login: <span className="font-medium text-gray-900">{timeAgo(iso(-3600*2))}</span></li>
									</ul>
								</div>
							</div>
						</section>
					)}

					{tab==='security' && (
						<section className="grid gap-8 lg:grid-cols-3">
							<div className="lg:col-span-2 space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
									<h2 className="text-lg font-semibold flex items-center gap-2"><Lock className="w-5 h-5 text-blue-600" /> Change Password</h2>
									<div className="grid sm:grid-cols-2 gap-5">
										<Field label="Current Password">
											<PasswordInput value={passwordOld} onChange={setPasswordOld} show={showPassword} setShow={setShowPassword} />
										</Field>
										<Field label="New Password">
											<PasswordInput value={passwordNew} onChange={setPasswordNew} show={showPassword} setShow={setShowPassword} />
										</Field>
										<Field label="Confirm Password">
											<PasswordInput value={passwordConfirm} onChange={setPasswordConfirm} show={showPassword} setShow={setShowPassword} />
										</Field>
									</div>
									<PasswordStrength pwd={passwordNew} />
									<div className="flex flex-wrap items-center gap-3">
										<button disabled={!passwordValid || savingPassword} onClick={changePassword} className="btn-primary flex items-center gap-2">{savingPassword && <Loader2 className="w-4 h-4 animate-spin" />} Update Password</button>
										{!passwordStrong && passwordNew && <span className="text-xs text-amber-600">Use at least 8 chars incl. uppercase & number.</span>}
										{passwordNew && !passwordMatch && <span className="text-xs text-red-600">Passwords do not match.</span>}
									</div>
								</div>
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
									<h2 className="text-lg font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600" /> Two-Factor Authentication</h2>
									<p className="text-sm text-gray-600">Enhance account security with a secondary code during login.</p>
									<div className="flex items-center gap-3">
										<label className="flex items-center gap-2 text-sm cursor-pointer">
											<input type="checkbox" checked={twoFA} onChange={e=> setTwoFA(e.target.checked)} className="rounded" />
											Enable 2FA
										</label>
										<span className="text-[11px] text-gray-500">Authenticator apps supported.</span>
									</div>
								</div>
							</div>
							<div className="space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
									<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Recent Security</h3>
									<ul className="text-xs text-gray-600 space-y-2">
										{['Password Changed','2FA Enabled','Login Success'].map(e => <li key={e}>• {e}</li>)}
									</ul>
								</div>
							</div>
						</section>
					)}

					{tab==='notifications' && (
						<section className="grid gap-8 lg:grid-cols-3">
							<div className="lg:col-span-2 space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
									<h2 className="text-lg font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-blue-600" /> Notification Settings</h2>
									<div className="space-y-4">
										<Toggle label="Email Alerts" value={notifEmail} setValue={setNotifEmail} description="Receive incident & report notifications by email." />
										<Toggle label="Push Notifications" value={notifPush} setValue={setNotifPush} description="Send real-time browser push for critical thresholds." />
										<Toggle label="Daily Summary Email" value={notifSummaryDaily} setValue={setNotifSummaryDaily} description="Morning consolidated analytics snapshot." />
										<div className="space-y-1">
											<label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Threshold % for Alerts</label>
											<input type="range" min={0} max={100} value={notifThreshold} onChange={e=> setNotifThreshold(Number(e.target.value))} className="w-full" />
											<div className="text-[11px] text-gray-500">Current: <span className="font-medium text-gray-800">{notifThreshold}%</span></div>
										</div>
									</div>
								</div>
							</div>
							<div className="space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
									<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Guidance</h3>
									<p className="text-xs text-gray-600 leading-relaxed">Use conservative thresholds to reduce noise. Adjust based on operational tolerance.</p>
								</div>
							</div>
						</section>
					)}

					{tab==='preferences' && (
						<section className="grid gap-8 lg:grid-cols-3">
							<div className="lg:col-span-2 space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
									<h2 className="text-lg font-semibold flex items-center gap-2"><Palette className="w-5 h-5 text-blue-600" /> Interface Preferences</h2>
									<div className="grid sm:grid-cols-2 gap-5">
										<Field label="Theme">
											<select value={theme} onChange={e=> setTheme(e.target.value as any)} className="input">
												<option value="light">Light</option>
												<option value="dark">Dark</option>
												<option value="system">System</option>
											</select>
										</Field>
										<Field label="Language">
											<select value={lang} onChange={e=> setLang(e.target.value)} className="input">
												<option value="en">English</option>
												<option value="id">Bahasa Indonesia</option>
											</select>
										</Field>
										<Field label="Density">
											<select value={density} onChange={e=> setDensity(e.target.value as any)} className="input">
												<option value="comfortable">Comfortable</option>
												<option value="compact">Compact</option>
											</select>
										</Field>
									</div>
									<p className="text-[11px] text-gray-500">These settings are local only (not persisted) in this demo.</p>
								</div>
							</div>
							<div className="space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
									<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Tips</h3>
									<ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
										<li>Use System theme to auto adapt.</li>
										<li>Compact density for data-heavy tables.</li>
									</ul>
								</div>
							</div>
						</section>
					)}

          

					{tab==='audit' && (
						<section className="grid gap-8 lg:grid-cols-3">
							<div className="lg:col-span-2 space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
									<h2 className="text-lg font-semibold flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> Recent Activity</h2>
									<div className="overflow-x-auto border border-gray-200 rounded-xl">
										<table className="min-w-full text-sm">
											<thead>
												<tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
													<th className="py-2 px-3 text-left font-medium">Time</th>
													<th className="py-2 px-3 text-left font-medium">Action</th>
													<th className="py-2 px-3 text-left font-medium">IP</th>
													<th className="py-2 px-3 text-left font-medium">Meta</th>
												</tr>
											</thead>
											<tbody>
												{filteredAudit.map(a => (
													<tr key={a.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50">
														<td className="py-2 px-3 text-xs text-gray-600">{timeAgo(a.ts)}</td>
														<td className="py-2 px-3 text-gray-800">{a.action}</td>
														<td className="py-2 px-3 text-gray-700 font-mono text-[11px]">{a.ip}</td>
														<td className="py-2 px-3 text-gray-600 text-xs">{a.meta || '—'}</td>
													</tr>
												))}
												{filteredAudit.length===0 && <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-500">No activity.</td></tr>}
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div className="space-y-6">
								<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
									<h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Retention</h3>
									<p className="text-xs text-gray-600 leading-relaxed">Only a recent window of activity is shown in this demo. Extend via backend pagination & filters (IP, action type).</p>
								</div>
							</div>
						</section>
					)}

					{/* Footer */}
					<footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
						<span>Tab: {tab}</span>
						<span className="ml-auto">© {new Date().getFullYear()} Banjay Analytics</span>
					</footer>
				</main>
			</div>
		</div>
	);
}

function SettingsIcon(){ return <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 8.6 19a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09c.7 0 1.31-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06c.46.46 1.12.61 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09c0 .7.4 1.31 1 1.51.61.19 1.36.03 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06c-.36.36-.51 1-.33 1.82V9c.2.6.81 1 1.51 1H22a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>; }

function Field({label, children, className}:{label:string; children:React.ReactNode; className?:string}){
	return (
		<label className={`flex flex-col gap-1 text-xs font-medium text-gray-600 ${className||''}`}>
			<span className="uppercase tracking-wide">{label}</span>
			{children}
		</label>
	);
}

function PasswordInput({ value, onChange, show, setShow }:{ value:string; onChange:(v:string)=>void; show:boolean; setShow:(v:boolean)=>void }){
	return (
		<div className="relative">
			<input type={show?'text':'password'} value={value} onChange={e=> onChange(e.target.value)} className="input pr-10" />
			<button type="button" onClick={()=> setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" aria-label="Toggle visibility">{show? <EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />}</button>
		</div>
	);
}

function PasswordStrength({ pwd }:{ pwd:string }){
	if (!pwd) return null;
	const score = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].reduce((a,r)=> a + (r.test(pwd)?1:0), 0) + (pwd.length>=8 ? 1:0);
	const pct = (score/4)*100;
	const label = ['Weak','Fair','Good','Strong'][Math.min(3,score-1)] || 'Weak';
	const color = pct<50 ? 'bg-red-500':'bg-green-500';
	return (
		<div className="space-y-1">
			<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
				<div className={`h-full ${color}`} style={{ width: pct+'%' }} />
			</div>
			<div className="text-[11px] text-gray-500">Strength: <span className="font-medium text-gray-700">{label}</span></div>
		</div>
	);
}

function Toggle({ label, value, setValue, description }:{ label:string; value:boolean; setValue:(v:boolean)=>void; description?:string }){
	return (
		<div className="flex items-start gap-3">
			<button type="button" onClick={()=> setValue(!value)} className={`w-10 h-6 rounded-full flex items-center px-1 transition ${value?'bg-blue-600 justify-end':'bg-gray-300 justify-start'}`}> <span className="w-4 h-4 rounded-full bg-white shadow" /> </button>
			<div className="flex-1">
				<p className="text-sm font-medium text-gray-800">{label}</p>
				{description && <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{description}</p>}
			</div>
		</div>
	);
}

function timeAgo(isoDate:string){
	const diff = Date.now() - new Date(isoDate).getTime();
	const s = Math.floor(diff/1000);
	if(s<60) return s+'s ago';
	const m = Math.floor(s/60); if(m<60) return m+'m ago';
	const h = Math.floor(m/60); if(h<24) return h+'h ago';
	const d = Math.floor(h/24); if(d<7) return d+'d ago';
	const w = Math.floor(d/7); if(w<4) return w+'w ago';
	const mo = Math.floor(d/30); if(mo<12) return mo+'mo ago';
	const y = Math.floor(d/365); return y+'y ago';
}

// Shared utility classes (Tailwind utilities combined) for brevity
// Ideally move to a global stylesheet or component abstraction.
// Using plain strings to avoid external deps.
declare global { interface HTMLElement { } }
const _unused = null;

// Utility classes applied inline:
// .input => rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
// .btn-primary => px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40

// We can't define custom classes directly here without config; replicate via className where used.
// (Kept comments for future refactor.)
