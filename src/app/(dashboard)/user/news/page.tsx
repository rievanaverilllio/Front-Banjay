"use client";

import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Clock, Bookmark, Tag, Newspaper, Grid2X2, List, ArrowRight, RefreshCw, Flame } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  author: string;
  date: string; // ISO
  readMinutes: number;
  tags: string[];
  featured?: boolean;
}

const RAW_NEWS: NewsItem[] = [
  { id:'1', title:'Early Warning System Reduces Flood Impact in Coastal District', summary:'Deployment of IoT river gauges and ML models provided a 6‑hour lead time enabling timely evacuations.', image:'/flood4.jpg', category:'Technology', author:'Banjay Analytics', date:'2025-08-11T09:20:00Z', readMinutes:4, tags:['iot','prediction','evacuation'], featured:true },
  { id:'2', title:'Satellite Imagery Maps 129K ha Impacted Area', summary:'Radar satellites captured inundation extent despite heavy cloud cover; map supports relief logistics.', image:'/flood3.jpg', category:'Geospatial', author:'Geo Team', date:'2025-08-11T06:05:00Z', readMinutes:5, tags:['satellite','mapping'] },
  { id:'3', title:'Community Shelters Reach 85% Capacity', summary:'Updated occupancy data highlights urgent need for additional temporary housing units.', image:'/flood2.jpg', category:'Relief', author:'Field Ops', date:'2025-08-10T18:40:00Z', readMinutes:3, tags:['shelter','capacity'] },
  { id:'4', title:'Hydrology Model v2.3 Improves Peak Flow Accuracy', summary:'New calibration dataset reduces RMSE by 14% across monitored basins.', image:'/flood1.jpg', category:'Research', author:'Data Science', date:'2025-08-10T14:10:00Z', readMinutes:6, tags:['model','ml'] },
  { id:'5', title:'Rescue Operations Surpass 500K Milestone', summary:'Coordinated multi‑agency response accelerates extraction times in high‑risk clusters.', image:'/flood.jpg', category:'Operations', author:'Command Center', date:'2025-08-10T11:30:00Z', readMinutes:4, tags:['rescue','coordination'] },
  { id:'6', title:'Mobile Connectivity Restored in Northern Sector', summary:'Rapid deployment of portable towers re‑establishes essential communications.', image:'/flood3.jpg', category:'Infrastructure', author:'Network Team', date:'2025-08-09T16:00:00Z', readMinutes:2, tags:['connectivity','infrastructure'] },
  { id:'7', title:'Rainfall Anomaly Dashboard Launches Beta', summary:'Interactive portal contextualizes weekly precipitation deviations vs climatology.', image:'/flood2.jpg', category:'Analytics', author:'Climate Desk', date:'2025-08-09T09:55:00Z', readMinutes:5, tags:['rainfall','dashboard'] },
  { id:'8', title:'Evacuation Route Optimization Cuts Travel Time 12%', summary:'Graph algorithms prioritize road segments with lower flood probability.', image:'/flood1.jpg', category:'Logistics', author:'Routing Lab', date:'2025-08-08T20:15:00Z', readMinutes:7, tags:['routing','optimization'] },
  { id:'9', title:'Volunteer Onboarding Portal Goes Live', summary:'Streamlined credential checks reduce processing backlog by 43%.', image:'/flood4.jpg', category:'Community', author:'Volunteer Unit', date:'2025-08-08T12:45:00Z', readMinutes:3, tags:['volunteer'] },
  { id:'10', title:'Drone Recon Expands Coverage to Upland Areas', summary:'Thermal sensors assist in locating isolated households.', image:'/flood2.jpg', category:'Technology', author:'Aerial Ops', date:'2025-08-07T17:25:00Z', readMinutes:4, tags:['drone','thermal'] },
];

const categories = ['All','Technology','Geospatial','Relief','Research','Operations','Infrastructure','Analytics','Logistics','Community'];

export default function UserNewsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [layout, setLayout] = useState<'grid'|'list'>('grid');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(()=> setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(o => !o);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return RAW_NEWS.filter(n => {
      if (category !== 'All' && n.category !== category) return false;
      if (tagFilter && !n.tags.includes(tagFilter)) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }).sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search, category, tagFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);

  const featured = RAW_NEWS.find(n => n.featured) || RAW_NEWS[0];
  const trendingTags = useMemo(() => {
    const counts: Record<string, number> = {};
    RAW_NEWS.forEach(n => n.tags.forEach(t => { counts[t] = (counts[t]||0)+1;}));
    return Object.entries(counts).sort((a,b)=> b[1]-a[1]).slice(0,7).map(([t])=>t);
  }, []);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(()=> setRefreshing(false), 800);
  };

  const skeletonCards = Array.from({length: layout==='grid'? pageSize: Math.min(pageSize, paged.length||pageSize)}).map((_,i)=>(
    <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="w-full h-40 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="mt-auto flex gap-2">
        <div className="h-3 w-12 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  ));

  return (
    <div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
      <UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden">
        <UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 space-y-10">
          {/* Header & Controls */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
                  <Newspaper className="w-7 h-7 text-blue-600" /> News Updates
                  {refreshing && <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Curated operational news, analytics releases, and response progress.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={search}
                    onChange={e=> { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search updates..."
                    className="pl-9 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white w-56"
                  />
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                  {(['grid','list'] as const).map(m => (
                    <button key={m} onClick={()=> setLayout(m)} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${layout===m ? 'bg-white shadow border border-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>{m==='grid'?<Grid2X2 className="w-3.5 h-3.5" />:<List className="w-3.5 h-3.5" />}{m}</button>
                  ))}
                </div>
                <div className="relative">
                  <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select value={category} onChange={e=> { setCategory(e.target.value); setPage(1); }} className="appearance-none pl-9 pr-8 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <span className="pointer-events-none text-gray-400 text-xs absolute right-3 top-1/2 -translate-y-1/2">▼</span>
                </div>
                <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-300 text-sm bg-white hover:bg-gray-100"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin':''}`} />Refresh</button>
              </div>
            </div>

            {/* Trending Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="uppercase tracking-wide text-[11px] font-semibold text-gray-500 flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> Trending:</span>
              {trendingTags.map(t => (
                <button key={t} onClick={()=> { setTagFilter(tagFilter===t?null:t); setPage(1); }} className={`px-2 py-1 rounded-full border text-[11px] font-medium ${tagFilter===t ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>#{t}</button>
              ))}
              {tagFilter && <button onClick={()=> setTagFilter(null)} className="ml-1 text-[11px] text-blue-600 hover:underline">Reset tag</button>}
            </div>
          </section>

          {/* Featured */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
            <div className="xl:col-span-2 relative group rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 transition-opacity group-hover:opacity-90" />
              <img src={featured.image} alt={featured.title} className="h-80 w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col gap-3 text-white">
                <div className="flex flex-wrap gap-2 items-center text-[11px] uppercase tracking-wide">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/90 font-semibold">{featured.category}</span>
                  <span className="opacity-80 flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readMinutes} min read</span>
                  <span className="opacity-80">{new Date(featured.date).toLocaleDateString()}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-snug drop-shadow">{featured.title}</h2>
                <p className="text-sm md:text-base max-w-2xl text-gray-200">{featured.summary}</p>
                <button className="self-start mt-2 flex items-center gap-2 text-sm font-medium bg-white text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100">
                  Read full update <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-1 flex flex-col">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-indigo-600" /> Quick Filters</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['prediction','rescue','infrastructure','mapping','model','volunteer'].map(t => (
                    <button key={t} onClick={()=> { setTagFilter(tagFilter===t?null:t); setPage(1); }} className={`px-2.5 py-1 rounded-full border text-xs font-medium ${tagFilter===t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>#{t}</button>
                  ))}
                </div>
                <div className="mt-auto text-[11px] text-gray-500">Select a tag to narrow down the intelligence feed.</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-3">At a Glance</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between"><span>Total Articles</span><span className="font-semibold">{RAW_NEWS.length}</span></li>
                  <li className="flex justify-between"><span>Categories</span><span className="font-semibold">{categories.length-1}</span></li>
                  <li className="flex justify-between"><span>Active Tag</span><span className="font-semibold">{tagFilter || '-'}</span></li>
                  <li className="flex justify-between"><span>Current Page</span><span className="font-semibold">{page}/{totalPages}</span></li>
                </ul>
                <div className="mt-4 text-[10px] uppercase tracking-wide text-gray-400">Auto refresh every 10 min (planned)</div>
              </div>
            </div>
          </section>

          {/* Articles List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">Recent Updates <span className="text-xs font-medium text-gray-500">({filtered.length})</span></h3>
              <div className="text-[11px] text-gray-500">Showing page {page} of {totalPages}</div>
            </div>
            {loading ? (
              <div className={`grid gap-6 ${layout==='grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>{skeletonCards}</div>
            ) : (
              <div className={`grid gap-6 ${layout==='grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {paged.map(item => (
                  <article key={item.id} className={`group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition flex ${layout==='list' ? 'flex-row gap-5 p-4':'flex-col p-4'} overflow-hidden`}>
                    <div className={`${layout==='list' ? 'w-48 flex-shrink-0':'w-full'} relative rounded-lg overflow-hidden`}> 
                      <img src={item.image} alt={item.title} className={`${layout==='list' ? 'h-32 w-full object-cover':'h-44 w-full object-cover'} group-hover:scale-105 transition-transform duration-500`} />
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{item.category}</span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.summary}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0,4).map(t => (
                          <button key={t} onClick={()=> { setTagFilter(t); setPage(1); }} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">#{t}</button>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.readMinutes}m</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span className="truncate max-w-[120px]">{item.author}</span>
                        <button className="text-gray-400 hover:text-gray-700"><Bookmark className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <span className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-blue-200 pointer-events-none" />
                  </article>
                ))}
                {paged.length===0 && (
                  <div className="col-span-full text-center py-16 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-1">No results found</p>
                    <p className="text-xs text-gray-500">Try adjusting filters or clearing the active tag.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-gray-500">{filtered.length} total items</div>
                <div className="flex gap-2">
                  <button disabled={page===1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-white disabled:opacity-40">Prev</button>
                  {Array.from({length: totalPages}).slice(0,5).map((_,i)=> {
                    const num=i+1; return (
                      <button key={num} onClick={()=> setPage(num)} className={`px-3 py-1.5 text-xs rounded-full border ${page===num ? 'bg-black text-white border-black':'bg-white border-gray-300 hover:border-gray-400'}`}>{num}</button>
                    );
                  })}
                  <button disabled={page===totalPages} onClick={()=> setPage(p=> Math.min(totalPages,p+1))} className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-white disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
            <span>Feed latency: <strong className="text-gray-700 font-semibold">~2 min</strong></span>
            <span>Auto-update planned</span>
            <span className="ml-auto">© {new Date().getFullYear()} Banjay Intelligence</span>
          </footer>
        </main>
      </div>
    </div>
  );
}