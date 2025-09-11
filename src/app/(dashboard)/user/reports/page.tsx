"use client";

import React, { useEffect, useMemo, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { FileText, Filter, RefreshCw, Download, Search, Clock, CheckCircle2, XCircle, AlertTriangle, BarChart2, Settings, Loader2, Plus, Tag, ExternalLink } from 'lucide-react';

interface ReportMeta {
  id: string;
  title: string;
  type: string; // Situation | Impact | Operations | Forecast
  status: 'ready' | 'generating' | 'failed';
  created: string; // ISO
  sizeKB: number;
  tags: string[];
  pages: number;
}

interface QueueItem {
  id: string;
  title: string;
  progress: number; // 0..100
  etaSec: number;
}

const REPORTS: ReportMeta[] = [
  { id:'rpt-101', title:'Daily Situation Overview', type:'Situation', status:'ready', created:'2025-08-12T06:05:00Z', sizeKB:842, tags:['daily','summary'], pages:12 },
  { id:'rpt-102', title:'Impact Assessment (Regional)', type:'Impact', status:'ready', created:'2025-08-11T23:10:00Z', sizeKB:1560, tags:['impact','regional'], pages:28 },
  { id:'rpt-103', title:'Operations Performance KPIs', type:'Operations', status:'ready', created:'2025-08-11T18:30:00Z', sizeKB:640, tags:['kpi','ops'], pages:14 },
  { id:'rpt-104', title:'Forecast Flood Outlook 7d', type:'Forecast', status:'ready', created:'2025-08-11T09:25:00Z', sizeKB:1210, tags:['forecast','model'], pages:22 },
  { id:'rpt-105', title:'Shelter Capacity Update', type:'Impact', status:'ready', created:'2025-08-10T16:40:00Z', sizeKB:410, tags:['shelter','capacity'], pages:9 },
  { id:'rpt-106', title:'Logistics Route Risk Review', type:'Operations', status:'failed', created:'2025-08-10T14:05:00Z', sizeKB:0, tags:['routing','risk'], pages:0 },
];

export default function ReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'All'|'Situation'|'Impact'|'Operations'|'Forecast'>('All');
  const [status, setStatus] = useState<'All'|'ready'|'generating'|'failed'>('All');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [layout, setLayout] = useState<'table'|'cards'>('table');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [generating, setGenerating] = useState<QueueItem[]>([
    { id:'queue-1', title:'Extended Forecast (14d)', progress:55, etaSec:120 },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [detail, setDetail] = useState<ReportMeta | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(o=>!o);

  // Simulate progress increment
  useEffect(()=> {
    const t = setInterval(()=> {
      setGenerating(items => items.map(it => it.progress < 100 ? { ...it, progress: Math.min(100, it.progress + Math.random()*8 + 4), etaSec: Math.max(0, it.etaSec - 10) } : it).filter(it => it.progress < 100));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const allTags = useMemo(()=> {
    const s = new Set<string>();
    REPORTS.forEach(r => r.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, []);

  const filtered = useMemo(()=> {
    const q = search.trim().toLowerCase();
    return REPORTS.filter(r => {
      if (type !== 'All' && r.type !== type) return false;
      if (status !== 'All' && r.status !== status) return false;
      if (tagFilter && !r.tags.includes(tagFilter)) return false;
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || r.tags.some(t => t.includes(q)) || r.type.toLowerCase().includes(q);
    }).sort((a,b)=> new Date(b.created).getTime() - new Date(a.created).getTime());
  }, [search,type,status,tagFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);

  const kpi = useMemo(()=> {
    const ready = REPORTS.filter(r=> r.status==='ready').length;
    const failed = REPORTS.filter(r=> r.status==='failed').length;
    const sizeTotal = REPORTS.reduce((a,b)=> a+b.sizeKB,0);
    return { ready, failed, sizeTotal };
  }, []);

  const refresh = () => { setRefreshing(true); setTimeout(()=> setRefreshing(false), 700); };

  const startGeneration = () => {
    const id = 'queue-'+ Math.random().toString(36).slice(2,7);
    setGenerating(g => [...g, { id, title:'Custom Analytical Report', progress:5, etaSec:300 }]);
  };

  return (
    <div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
      <UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden">
        <UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 space-y-10">
          {/* Header */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
                <FileText className="w-7 h-7 text-blue-600" /> Analytical Reports
                {refreshing && <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Central repository of generated situation, impact, and performance documents.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={search} onChange={e=> { setSearch(e.target.value); setPage(1); }} placeholder="Search reports..." className="pl-9 pr-3 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-56" />
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select value={type} onChange={e=> { setType(e.target.value as any); setPage(1); }} className="pl-9 pr-8 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {['All','Situation','Impact','Operations','Forecast'].map(t => <option key={t}>{t}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">▼</span>
              </div>
              <div className="relative">
                <Settings className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select value={status} onChange={e=> { setStatus(e.target.value as any); setPage(1); }} className="pl-9 pr-8 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {['All','ready','generating','failed'].map(s => <option key={s}>{s}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">▼</span>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                {(['table','cards'] as const).map(m => (
                  <button key={m} onClick={()=> setLayout(m)} className={`px-3 py-1 rounded-full text-xs font-medium ${layout===m ? 'bg-white shadow border border-gray-300':'text-gray-600 hover:text-gray-900'}`}>{m}</button>
                ))}
              </div>
              <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-100"><RefreshCw className={`w-4 h-4 ${refreshing?'animate-spin':''}`} />Refresh</button>
              <button onClick={startGeneration} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800"><Plus className="w-4 h-4" /> Generate</button>
            </div>
          </section>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500 text-xs uppercase tracking-wide"><span>Total Ready</span><BarChart2 className="w-4 h-4" /></div>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.ready}</h3>
              <p className="text-[11px] text-gray-500">Documents available for download.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500 text-xs uppercase tracking-wide"><span>Failed</span><AlertTriangle className="w-4 h-4 text-red-500" /></div>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.failed}</h3>
              <p className="text-[11px] text-gray-500">Need regeneration or review.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500 text-xs uppercase tracking-wide"><span>Storage (KB)</span><FileText className="w-4 h-4" /></div>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.sizeTotal.toLocaleString()}</h3>
              <p className="text-[11px] text-gray-500">Aggregate footprint.</p>
            </div>
          </section>

            {/* Tag Filter Row */}
            <section className="flex flex-wrap items-center gap-2 text-xs">
              <span className="uppercase tracking-wide text-[11px] font-semibold text-gray-500 flex items-center gap-1"><Tag className="w-4 h-4 text-indigo-600" /> Tags:</span>
              {allTags.map(t => (
                <button key={t} onClick={()=> { setTagFilter(tagFilter===t?null:t); setPage(1); }} className={`px-2 py-1 rounded-full border font-medium ${tagFilter===t ? 'bg-black text-white border-black':'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>#{t}</button>
              ))}
              {tagFilter && <button onClick={()=> setTagFilter(null)} className="ml-1 text-[11px] text-blue-600 hover:underline">Reset tag</button>}
            </section>

          {/* Generation Queue */}
          {generating.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-3 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Generation Queue</h3>
              <ul className="space-y-3">
                {generating.map(item => (
                  <li key={item.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">{item.title}</span>
                      <span className="text-[11px] text-gray-500">ETA {item.etaSec}s</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${item.progress}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-gray-500">Generation runs asynchronously; this list auto-updates.</p>
            </section>
          )}

          {/* Report List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">Reports <span className="text-xs font-medium text-gray-500">({filtered.length})</span></h3>
              <div className="text-[11px] text-gray-500">Page {page} of {totalPages}</div>
            </div>

            {layout === 'table' ? (
              <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <th className="py-2 px-3 text-left font-medium">Title</th>
                      <th className="py-2 px-3 text-left font-medium">Type</th>
                      <th className="py-2 px-3 text-left font-medium">Status</th>
                      <th className="py-2 px-3 text-left font-medium">Created</th>
                      <th className="py-2 px-3 text-left font-medium">Pages</th>
                      <th className="py-2 px-3 text-left font-medium">Size (KB)</th>
                      <th className="py-2 px-3 text-left font-medium">Tags</th>
                      <th className="py-2 px-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(r => (
                      <tr key={r.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-800">{r.title}</td>
                        <td className="py-2 px-3 text-gray-700">{r.type}</td>
                        <td className="py-2 px-3">
                          {r.status === 'ready' && <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 className="w-4 h-4" /> Ready</span>}
                          {r.status === 'generating' && <span className="flex items-center gap-1 text-blue-600 text-xs font-medium"><Loader2 className="w-4 h-4 animate-spin" /> Generating</span>}
                          {r.status === 'failed' && <span className="flex items-center gap-1 text-red-600 text-xs font-medium"><XCircle className="w-4 h-4" /> Failed</span>}
                        </td>
                        <td className="py-2 px-3 text-gray-600 text-xs">{new Date(r.created).toLocaleString()}</td>
                        <td className="py-2 px-3 text-gray-700 tabular-nums">{r.pages || '-'}</td>
                        <td className="py-2 px-3 text-gray-700 tabular-nums">{r.sizeKB? r.sizeKB.toLocaleString(): '-'}</td>
                        <td className="py-2 px-3">
                          <div className="flex flex-wrap gap-1">
                            {r.tags.map(t => (
                              <button key={t} onClick={()=> { setTagFilter(t); setPage(1); }} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">#{t}</button>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex justify-end gap-2">
                            {r.status==='ready' && <button onClick={()=> {/* placeholder download */}} className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white" aria-label="Download"><Download className="w-4 h-4" /></button>}
                            <button onClick={()=> setDetail(r)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" aria-label="Details"><ExternalLink className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paged.length===0 && (
                      <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-600">No reports found. Adjust filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paged.map(r => (
                  <div key={r.id} className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 leading-snug line-clamp-2 mr-2">{r.title}</h4>
                      {r.status==='ready' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {r.status==='generating' && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
                      {r.status==='failed' && <XCircle className="w-4 h-4 text-red-600" />}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{r.type} • {new Date(r.created).toLocaleDateString()} • {r.pages || '-'} pp</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {r.tags.slice(0,4).map(t => (
                        <button key={t} onClick={()=> { setTagFilter(t); setPage(1); }} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">#{t}</button>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500">
                      <span className="tabular-nums">{r.sizeKB? r.sizeKB+' KB':'—'}</span>
                      <div className="flex gap-2">
                        {r.status==='ready' && <button className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white" aria-label="Download"><Download className="w-4 h-4" /></button>}
                        <button onClick={()=> setDetail(r)} className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" aria-label="Details"><ExternalLink className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <span className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-blue-200 pointer-events-none" />
                  </div>
                ))}
                {paged.length===0 && (
                  <div className="col-span-full text-center py-12 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-600">No reports found.</div>
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-gray-500">{filtered.length} total reports</div>
              <div className="flex gap-2">
                <button disabled={page===1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-white disabled:opacity-40">Prev</button>
                {Array.from({length: totalPages}).slice(0,5).map((_,i)=> { const num=i+1; return <button key={num} onClick={()=> setPage(num)} className={`px-3 py-1.5 text-xs rounded-full border ${page===num ? 'bg-black text-white border-black':'bg-white border-gray-300 hover:border-gray-400'}`}>{num}</button>; })}
                <button disabled={page===totalPages} onClick={()=> setPage(p=> Math.min(totalPages,p+1))} className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-white disabled:opacity-40">Next</button>
              </div>
            </div>
          </section>

          {/* Detail Drawer (simple) */}
          {detail && (
            <div className="fixed inset-0 z-40 flex">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=> setDetail(null)} />
              <div className="ml-auto w-full sm:w-[420px] h-full bg-white shadow-xl border-l border-gray-200 flex flex-col animate-slide-in">
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> {detail.title}</h4>
                  <button onClick={()=> setDetail(null)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">✕</button>
                </div>
                <div className="p-5 space-y-4 overflow-y-auto text-sm">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1"><p className="text-gray-500 uppercase tracking-wide">Type</p><p className="font-medium">{detail.type}</p></div>
                    <div className="space-y-1"><p className="text-gray-500 uppercase tracking-wide">Status</p><p className="font-medium">{detail.status}</p></div>
                    <div className="space-y-1"><p className="text-gray-500 uppercase tracking-wide">Created</p><p className="font-medium">{new Date(detail.created).toLocaleString()}</p></div>
                    <div className="space-y-1"><p className="text-gray-500 uppercase tracking-wide">Pages</p><p className="font-medium">{detail.pages || '-'}</p></div>
                    <div className="space-y-1"><p className="text-gray-500 uppercase tracking-wide">Size (KB)</p><p className="font-medium">{detail.sizeKB? detail.sizeKB.toLocaleString(): '-'}</p></div>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase tracking-wide text-xs mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {detail.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">#{t}</span>)}
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 leading-relaxed">
                    Placeholder summary: This report consolidates recent operational and environmental indicators to support decision cycles. It can be extended with dynamic HTML / PDF embedding.
                  </div>
                </div>
                <div className="mt-auto p-5 border-t border-gray-200 flex gap-3">
                  {detail.status==='ready' && <button className="flex-1 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download</button>}
                  <button onClick={()=> setDetail(null)} className="flex-1 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
            <span>Total documents: {REPORTS.length}</span>
            <span>Filters: {type}/{status}{tagFilter?'/#'+tagFilter:''}</span>
            <span className="ml-auto">© {new Date().getFullYear()} Banjay Analytics</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* Simple animation */
// Tailwind not configured for custom keyframes here; rely on default transitions.