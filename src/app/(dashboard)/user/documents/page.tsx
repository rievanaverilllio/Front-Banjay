"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { File, FileText, Image as ImageIcon, Download, Trash2, Search, Filter, Upload, Tag, X, ExternalLink, Star, StarOff, CheckSquare, Square, ChevronDown, RefreshCw, Folder, Edit3, Copy } from 'lucide-react';

type DocType = 'pdf' | 'image' | 'csv' | 'txt' | 'other';

interface DocItem {
	id: string;
	name: string;
	type: DocType;
	sizeKB: number;
	created: string; // ISO
	updated: string; // ISO
	tags: string[];
	starred?: boolean;
	version: number;
	origin: 'upload' | 'generated';
}

const seedDocs: DocItem[] = [
	{ id:'d1', name:'Daily_Situation_Overview.pdf', type:'pdf', sizeKB:842, created:iso(-3600*5), updated:iso(-3600*5), tags:['situation','daily'], version:1, origin:'generated' },
	{ id:'d2', name:'Impact_Assessment_Regional.pdf', type:'pdf', sizeKB:1560, created:iso(-3600*8), updated:iso(-3600*7), tags:['impact','regional'], version:3, origin:'generated', starred:true },
	{ id:'d3', name:'Logistics_Route_Risk.csv', type:'csv', sizeKB:210, created:iso(-3600*12), updated:iso(-3600*2), tags:['logistics','risk'], version:2, origin:'generated' },
	{ id:'d4', name:'Shelter_Capacity_Update.csv', type:'csv', sizeKB:98, created:iso(-3600*30), updated:iso(-3600*10), tags:['shelter'], version:5, origin:'generated' },
	{ id:'d5', name:'Flood_Outlook_7d.pdf', type:'pdf', sizeKB:1210, created:iso(-3600*15), updated:iso(-3600*14), tags:['forecast'], version:1, origin:'generated' },
	{ id:'d6', name:'Station_KRB-07_Chart.png', type:'image', sizeKB:340, created:iso(-3600*3), updated:iso(-3600*2.5), tags:['chart','sensor'], version:1, origin:'upload' },
	{ id:'d7', name:'Ops_Notes.txt', type:'txt', sizeKB:12, created:iso(-3600*40), updated:iso(-3600*1.5), tags:['notes','ops'], version:8, origin:'upload' },
];

function iso(offsetSecondsFromNow:number) { return new Date(Date.now()+offsetSecondsFromNow*1000).toISOString(); }

export default function DocumentsPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const toggleSidebar = () => setIsSidebarOpen(o=>!o);

	const [docs, setDocs] = useState<DocItem[]>(seedDocs);
	const [search, setSearch] = useState('');
	const [typeFilter, setTypeFilter] = useState<'all'|DocType>('all');
	const [tagFilter, setTagFilter] = useState<string|null>(null);
	const [originFilter, setOriginFilter] = useState<'all'|'upload'|'generated'>('all');
	const [sort, setSort] = useState<'updated'|'created'|'size'|'name'>('updated');
	const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
	const [layout, setLayout] = useState<'table'|'grid'>('table');
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [preview, setPreview] = useState<DocItem|null>(null);
	const [uploading, setUploading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const fileInputRef = useRef<HTMLInputElement|null>(null);

	const allTags = useMemo(()=> Array.from(new Set(docs.flatMap(d=> d.tags))).sort(), [docs]);

	const filtered = useMemo(()=> {
		const q = search.trim().toLowerCase();
		return docs.filter(d => {
			if (typeFilter!=='all' && d.type!==typeFilter) return false;
			if (originFilter!=='all' && d.origin!==originFilter) return false;
			if (tagFilter && !d.tags.includes(tagFilter)) return false;
			if (q && !d.name.toLowerCase().includes(q) && !d.tags.some(t=> t.includes(q))) return false;
			return true;
		}).sort((a,b)=> sortComparator(a,b,sort,sortDir));
	}, [docs, search, typeFilter, originFilter, tagFilter, sort, sortDir]);

	const allSelected = filtered.length>0 && filtered.every(d => selected.has(d.id));
	const anySelected = selected.size>0;

	function sortComparator(a:DocItem,b:DocItem, key:string, dir:'asc'|'desc') {
		const mod = dir==='asc'?1:-1;
		switch(key){
			case 'size': return (a.sizeKB - b.sizeKB)*mod;
			case 'name': return a.name.localeCompare(b.name)*mod;
			case 'created': return (new Date(a.created).getTime() - new Date(b.created).getTime())*mod;
			case 'updated':
			default: return (new Date(a.updated).getTime() - new Date(b.updated).getTime())*mod;
		}
	}

	const triggerUpload = () => { fileInputRef.current?.click(); };

	const handleFiles = (files: FileList | null) => {
		if (!files || files.length===0) return;
		setUploading(true);
		// Simulate async
		setTimeout(()=> {
			const added: DocItem[] = Array.from(files).map(f => {
				const ext = f.name.split('.').pop()?.toLowerCase();
				const map: Record<string, DocType> = { pdf:'pdf', png:'image', jpg:'image', jpeg:'image', csv:'csv', txt:'txt' };
				const t: DocType = (ext && map[ext]) || 'other';
				return {
					id: 'u'+Math.random().toString(36).slice(2,7),
					name: f.name,
					type: t,
					sizeKB: Math.max(1, Math.round(f.size/1024)),
					created: new Date().toISOString(),
						updated: new Date().toISOString(),
					tags: [],
					version: 1,
					origin: 'upload'
				};
			});
			setDocs(d => [...added, ...d]);
			setUploading(false);
		}, 900);
	};

	const toggleSelectAll = () => {
		if (allSelected) setSelected(new Set());
		else setSelected(new Set(filtered.map(f=> f.id)));
	};

	const toggleSelect = (id:string) => {
		setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id): n.add(id); return n; });
	};

	const clearFilters = () => { setTypeFilter('all'); setOriginFilter('all'); setTagFilter(null); setSearch(''); };

	const bulkDelete = () => {
		if (!anySelected) return;
		setDocs(d => d.filter(x => !selected.has(x.id)));
		setSelected(new Set());
		if (preview && !docs.find(d => d.id===preview.id)) setPreview(null);
	};

	const toggleStar = (doc:DocItem) => {
		setDocs(d => d.map(x => x.id===doc.id ? { ...x, starred: !x.starred } : x));
	};

	const refresh = () => { setRefreshing(true); setTimeout(()=> setRefreshing(false), 600); };

	const addTag = (doc:DocItem, tag:string) => {
		if (!tag) return;
		setDocs(d => d.map(x => x.id===doc.id ? { ...x, tags: x.tags.includes(tag)? x.tags : [...x.tags, tag] } : x));
	};

	const removeTag = (doc:DocItem, tag:string) => {
		setDocs(d => d.map(x => x.id===doc.id ? { ...x, tags: x.tags.filter(t=> t!==tag) } : x));
	};

	const duplicate = (doc:DocItem) => {
		const copyDoc: DocItem = { ...doc, id:'dup'+Math.random().toString(36).slice(2,7), name:doc.name.replace(/(\.[^.]+)?$/, '_copy$1'), created:new Date().toISOString(), updated:new Date().toISOString(), version:1};
		setDocs(d => [copyDoc, ...d]);
	};

	return (
		<div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
			<UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			<div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
				<UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
				<main className="flex-1 overflow-y-auto p-6 space-y-8">
					{/* Header */}
					<section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
								<FileText className="w-7 h-7 text-blue-600" /> Documents
								{refreshing && <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
							</h1>
							<p className="text-sm text-gray-500 mt-1">Central library of generated outputs & uploaded files.</p>
						</div>
						<div className="flex flex-wrap items-center gap-3">
							<div className="relative">
								<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Search documents..." className="pl-9 pr-3 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-56" />
							</div>
							<div className="relative">
								<Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<select value={typeFilter} onChange={e=> setTypeFilter(e.target.value as any)} className="pl-9 pr-8 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
									<option value="all">All Types</option>
									<option value="pdf">PDF</option>
									<option value="image">Images</option>
									<option value="csv">CSV</option>
									<option value="txt">Text</option>
									<option value="other">Other</option>
								</select>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">▼</span>
							</div>
							<div className="relative">
								<Folder className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<select value={originFilter} onChange={e=> setOriginFilter(e.target.value as any)} className="pl-9 pr-8 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
									<option value="all">All Origins</option>
									<option value="generated">Generated</option>
									<option value="upload">Uploaded</option>
								</select>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">▼</span>
							</div>
							<div className="flex gap-1 bg-gray-100 rounded-full p-1">
								{(['table','grid'] as const).map(m => (
									<button key={m} onClick={()=> setLayout(m)} className={`px-3 py-1 rounded-full text-xs font-medium ${layout===m ? 'bg-white shadow border border-gray-300':'text-gray-600 hover:text-gray-900'}`}>{m}</button>
								))}
							</div>
							<button onClick={clearFilters} className="px-3 py-2 rounded-full border border-gray-300 bg-white text-xs font-medium hover:bg-gray-100">Reset</button>
							<button onClick={refresh} className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-100"><RefreshCw className={`w-4 h-4 ${refreshing?'animate-spin':''}`} />Refresh</button>
							<button onClick={triggerUpload} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800"><Upload className="w-4 h-4" /> Upload</button>
							<input ref={fileInputRef} type="file" multiple className="hidden" onChange={e=> { handleFiles(e.target.files); e.target.value=''; }} />
						</div>
					</section>

					{/* Tag Filter Row */}
					<section className="flex flex-wrap items-center gap-2 text-xs">
						<span className="uppercase tracking-wide text-[11px] font-semibold text-gray-500 flex items-center gap-1"><Tag className="w-4 h-4 text-indigo-600" /> Tags:</span>
						{allTags.map(t => (
							<button key={t} onClick={()=> setTagFilter(tagFilter===t ? null : t)} className={`px-2 py-1 rounded-full border font-medium ${tagFilter===t ? 'bg-black text-white border-black':'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>#{t}</button>
						))}
						{tagFilter && <button onClick={()=> setTagFilter(null)} className="ml-1 text-[11px] text-blue-600 hover:underline">Reset tag</button>}
					</section>

					{/* Bulk Actions */}
					{anySelected && (
						<section className="flex flex-wrap items-center gap-3 bg-black text-white px-4 py-3 rounded-xl shadow">
							<span className="text-sm font-medium">{selected.size} selected</span>
							<button onClick={bulkDelete} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20"><Trash2 className="w-4 h-4" /> Delete</button>
							<button onClick={()=> setSelected(new Set())} className="text-xs px-3 py-1.5 rounded-full bg-white text-black font-medium hover:bg-gray-200">Clear</button>
						</section>
					)}

					{/* Documents List */}
					<section className="space-y-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">Documents <span className="text-xs font-medium text-gray-500">({filtered.length})</span></h3>
							<div className="flex items-center gap-2 text-xs">
								<div className="relative">
									<select value={sort} onChange={e=> setSort(e.target.value as any)} className="appearance-none pl-3 pr-7 py-1.5 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
										<option value="updated">Updated</option>
										<option value="created">Created</option>
										<option value="size">Size</option>
										<option value="name">Name</option>
									</select>
									<ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
								</div>
								<button onClick={()=> setSortDir(d => d==='asc'?'desc':'asc')} className="px-3 py-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100">{sortDir==='asc'?'Asc':'Desc'}</button>
							</div>
						</div>

						{layout==='table' ? (
							<div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
											<th className="py-2 px-3 w-10">
												<button onClick={toggleSelectAll} className="p-1 rounded hover:bg-gray-100" aria-label="Select all">
													{allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
												</button>
											</th>
											<th className="py-2 px-3 text-left font-medium">Name</th>
											<th className="py-2 px-3 text-left font-medium">Type</th>
											<th className="py-2 px-3 text-left font-medium">Tags</th>
											<th className="py-2 px-3 text-left font-medium">Version</th>
											<th className="py-2 px-3 text-left font-medium">Size (KB)</th>
											<th className="py-2 px-3 text-left font-medium">Updated</th>
											<th className="py-2 px-3 text-right font-medium">Action</th>
										</tr>
									</thead>
									<tbody>
										{filtered.map(doc => (
											<tr key={doc.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50">
												<td className="py-2 px-3">
													<button onClick={()=> toggleSelect(doc.id)} className="p-1 rounded hover:bg-gray-100">
														{selected.has(doc.id) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-gray-400" />}
													</button>
												</td>
												<td className="py-2 px-3 font-medium text-gray-800 flex items-center gap-2">
													<button onClick={()=> toggleStar(doc)} className="text-gray-400 hover:text-amber-500" aria-label="Star">
														{doc.starred ? <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> : <StarOff className="w-4 h-4" />}
													</button>
													<button onClick={()=> setPreview(doc)} className="hover:underline text-left">
														{doc.name}
													</button>
												</td>
												<td className="py-2 px-3 text-gray-700 capitalize">{doc.type}</td>
												<td className="py-2 px-3">
													<div className="flex flex-wrap gap-1">
														{doc.tags.map(t => (
															<span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">#{t}</span>
														))}
														{doc.tags.length===0 && <span className="text-[10px] text-gray-400 italic">none</span>}
													</div>
												</td>
												<td className="py-2 px-3 text-gray-700 tabular-nums">{doc.version}</td>
												<td className="py-2 px-3 text-gray-700 tabular-nums">{doc.sizeKB.toLocaleString()}</td>
												<td className="py-2 px-3 text-gray-600 text-xs">{new Date(doc.updated).toLocaleString()}</td>
												<td className="py-2 px-3 text-right">
													<div className="flex justify-end gap-2">
														<button onClick={()=> duplicate(doc)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" aria-label="Duplicate"><Copy className="w-4 h-4" /></button>
														<button onClick={()=> setPreview(doc)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" aria-label="Preview"><ExternalLink className="w-4 h-4" /></button>
														<button className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white" aria-label="Download"><Download className="w-4 h-4" /></button>
														<button onClick={()=> { setDocs(d=> d.filter(x=> x.id!==doc.id)); setSelected(s=> { const n=new Set(s); n.delete(doc.id); return n; }); if(preview?.id===doc.id) setPreview(null);} } className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
													</div>
												</td>
											</tr>
										))}
										{filtered.length===0 && (
											<tr><td colSpan={8} className="py-10 text-center text-sm text-gray-600">No documents match filters.</td></tr>
										)}
									</tbody>
								</table>
							</div>
						) : (
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{filtered.map(doc => (
									<div key={doc.id} className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col">
										<div className="flex items-start justify-between mb-2">
											<button onClick={()=> toggleStar(doc)} className="text-gray-400 hover:text-amber-500" aria-label="Star toggle">{doc.starred ? <Star className="w-5 h-5 fill-amber-400 text-amber-500" /> : <StarOff className="w-5 h-5" />}</button>
											<span className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">{doc.type}</span>
										</div>
										<button onClick={()=> setPreview(doc)} className="text-sm font-semibold text-gray-900 text-left line-clamp-2 hover:underline">{doc.name}</button>
										<p className="text-[11px] text-gray-500 mt-1">v{doc.version} • {doc.sizeKB} KB</p>
										<div className="flex flex-wrap gap-1 mt-3 mb-3">
											{doc.tags.slice(0,4).map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">#{t}</span>)}
											{doc.tags.length===0 && <span className="text-[10px] text-gray-400 italic">no tags</span>}
										</div>
										<div className="mt-auto flex items-center justify-between text-[11px] text-gray-500">
											<span>{new Date(doc.updated).toLocaleDateString()}</span>
											<div className="flex gap-2">
												<button onClick={()=> duplicate(doc)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" aria-label="Duplicate"><Copy className="w-4 h-4" /></button>
												<button onClick={()=> setPreview(doc)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" aria-label="Preview"><ExternalLink className="w-4 h-4" /></button>
												<button className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white" aria-label="Download"><Download className="w-4 h-4" /></button>
												<button onClick={()=> { setDocs(d=> d.filter(x=> x.id!==doc.id)); if(preview?.id===doc.id) setPreview(null);} } className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
											</div>
										</div>
										<span className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-blue-200 pointer-events-none" />
									</div>
								))}
								{filtered.length===0 && (
									<div className="col-span-full text-center py-12 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-600">No documents.</div>
								)}
							</div>
						)}
					</section>

					{/* Upload Banner */}
					{uploading && (
						<div className="fixed bottom-4 right-4 bg-black text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm">
							<Upload className="w-4 h-4 animate-pulse" /> Uploading files...
						</div>
					)}

					{/* Preview Drawer */}
					{preview && (
						<div className="fixed inset-0 z-40 flex">
							<div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=> setPreview(null)} />
							<div className="ml-auto w-full sm:w-[440px] h-full bg-white shadow-xl border-l border-gray-200 flex flex-col">
								<div className="p-5 border-b border-gray-200 flex items-center justify-between">
									<h4 className="font-semibold text-gray-900 flex items-center gap-2"><File className="w-4 h-4 text-blue-600" /> {preview.name}</h4>
									<button onClick={()=> setPreview(null)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">✕</button>
								</div>
								<div className="p-5 space-y-5 overflow-y-auto text-sm">
									<div className="grid grid-cols-2 gap-4 text-xs">
										<Info label="Type" value={preview.type} />
										<Info label="Version" value={`v${preview.version}`} />
										<Info label="Size" value={`${preview.sizeKB.toLocaleString()} KB`} />
										<Info label="Origin" value={preview.origin} />
										<Info label="Created" value={new Date(preview.created).toLocaleString()} />
										<Info label="Updated" value={new Date(preview.updated).toLocaleString()} />
									</div>
									<div>
										<p className="text-gray-500 uppercase tracking-wide text-xs mb-1">Tags</p>
										<div className="flex flex-wrap gap-1 mb-2">
											{preview.tags.map(t => (
												<button key={t} onClick={()=> removeTag(preview, t)} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-700">#{t} ✕</button>
											))}
											{preview.tags.length===0 && <span className="text-[10px] text-gray-400 italic">none</span>}
										</div>
										<TagAdder onAdd={(tag)=> addTag(preview, tag)} />
									</div>
									<div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 leading-relaxed">
										Placeholder preview: Basic metadata displayed. Integrate actual file rendering (PDF viewer, image, text snippet) when backend available.
									</div>
								</div>
								<div className="mt-auto p-5 border-t border-gray-200 flex gap-2 flex-wrap">
									<button onClick={()=> duplicate(preview)} className="flex-1 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
									<button onClick={()=> toggleStar(preview)} className="flex-1 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center gap-2">{preview.starred? <Star className="w-4 h-4 text-amber-500" />:<StarOff className="w-4 h-4" />} Star</button>
									<button className="flex-1 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download</button>
									<button onClick={()=> setPreview(null)} className="flex-1 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium">Close</button>
								</div>
							</div>
						</div>
					)}

					{/* Footer */}
					<footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
						<span>Total docs: {docs.length}</span>
						<span>Filtered: {filtered.length}</span>
						<span>Selected: {selected.size}</span>
						<span className="ml-auto">© {new Date().getFullYear()} Banjay Analytics</span>
					</footer>
				</main>
			</div>
		</div>
	);
}

function Info({label, value}:{label:string; value:React.ReactNode}) {
	return (
		<div className="space-y-1">
			<p className="text-gray-500 uppercase tracking-wide">{label}</p>
			<p className="font-medium break-words text-gray-800 text-[11px] leading-snug">{value}</p>
		</div>
	);
}

function TagAdder({ onAdd }:{ onAdd:(tag:string)=>void }) {
	const [open, setOpen] = useState(false);
	const [val, setVal] = useState('');
	const submit = () => { const t = val.trim().toLowerCase().replace(/\s+/g,'_'); if(t){ onAdd(t); setVal(''); setOpen(false);} };
	return (
		<div className="text-xs">
			{open ? (
				<div className="flex items-center gap-2">
					<input value={val} onChange={e=> setVal(e.target.value)} onKeyDown={e=> { if(e.key==='Enter'){ e.preventDefault(); submit(); } }} placeholder="Add tag" className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
					<button onClick={submit} className="px-2 py-1 rounded bg-black text-white hover:bg-gray-800">Add</button>
					<button onClick={()=> { setOpen(false); setVal(''); }} className="p-1 rounded hover:bg-gray-200" aria-label="Cancel"><X className="w-4 h-4" /></button>
				</div>
			) : (
				<button onClick={()=> setOpen(true)} className="px-3 py-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center gap-1"><Tag className="w-4 h-4" /> Add Tag</button>
			)}
		</div>
	);
}

