"use client";

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import {
  BarChart3, Activity, MapPin, Users, AlertTriangle, RefreshCw, Calendar,
  LineChart, Layers, Globe2, Filter, ThermometerSun, Waves, CloudRain, Zap,
  Database, TrendingUp, Target
} from 'lucide-react';

// Leaflet (map) dynamic imports (avoid SSR issues)
import 'leaflet/dist/leaflet.css';
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr:false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr:false });

interface KPI { id:string; label:string; value:number; delta:number; icon:React.ReactNode; suffix?:string; }

const formatNumber = (n:number) => n.toLocaleString('en-US');
const trendColor = (d:number) => d === 0 ? 'text-gray-500' : d > 0 ? 'text-green-600' : 'text-red-600';

export default function StatisticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [range, setRange] = useState<'24h'|'7d'|'30d'|'90d'|'YTD'>('30d');
  const [hazard, setHazard] = useState<'all'|'flood'|'rain'|'heat'|'wind'>('all');
  const [region, setRegion] = useState<'all'|'north'|'south'|'west'|'central'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=> setIsClient(true), []);

  const toggleSidebar = () => setIsSidebarOpen(o=>!o);
  const doRefresh = () => { setRefreshing(true); setTimeout(()=> setRefreshing(false), 900); };

  // KPI data (mock) — could be fetched based on filters
  const kpis: KPI[] = useMemo(() => [
    { id:'exposed', label:'Population Exposed', value: 487_230, delta: 1320, icon:<Users className="w-5 h-5" /> },
    { id:'area', label:'Area Impacted (ha)', value: 129_044, delta: 4301, icon:<MapPin className="w-5 h-5" />, suffix:'ha' },
    { id:'incidents', label:'Active Incidents', value: 278, delta: -12, icon:<AlertTriangle className="w-5 h-5" /> },
    { id:'rescues', label:'Rescue Ops', value: 501_379, delta: 10_282, icon:<Activity className="w-5 h-5" /> },
  ], [range, hazard, region]);

  // Time-series data (mock multi-line) (flood vs rainfall vs temperature anomaly)
  const timeseries = useMemo(()=>{
    const labels = Array.from({length: 14}).map((_,i)=> `D${i+1}`);
    const flood = labels.map((_l,i)=> 200 + Math.sin(i/2)*40 + i*3);
    const rain = labels.map((_l,i)=> 80 + Math.cos(i/3)*25 + (i%3)*10);
    const heat = labels.map((_l,i)=> 2 + Math.sin(i/1.7)*1.2 + (i/10)); // anomaly °C
    return { labels, flood, rain, heat };
  }, [range, hazard, region]);

  // Correlation matrix (mock) among variables
  const variables = ['Flood','Rain','Soil','Temp','Wind'];
  const correlation: number[][] = [
    [1.00, 0.72, 0.51, 0.34, 0.28],
    [0.72, 1.00, 0.48, 0.29, 0.21],
    [0.51, 0.48, 1.00, 0.40, 0.17],
    [0.34, 0.29, 0.40, 1.00, 0.09],
    [0.28, 0.21, 0.17, 0.09, 1.00],
  ];

  // Distribution bars (impact severity tiers) mock
  const severity = [
    { label:'Critical', value:42, color:'bg-red-600' },
    { label:'High', value:33, color:'bg-orange-500' },
    { label:'Moderate', value:15, color:'bg-yellow-400' },
    { label:'Low', value:10, color:'bg-green-500' },
  ];
  const severityTotal = severity.reduce((a,b)=>a+b.value,0);

  // Regional breakdown table
  const regional = [
    { region:'North', exposures:120_500, incidents:82, responseTime:38 },
    { region:'South', exposures:98_340, incidents:74, responseTime:41 },
    { region:'West', exposures:76_280, incidents:56, responseTime:44 },
    { region:'Central', exposures:132_110, incidents:95, responseTime:35 },
    { region:'East', exposures:59_100, incidents:42, responseTime:47 },
  ];

  // Helper for correlation color
  const corrColor = (v:number) => {
    // scale -1..1 to blue->white->rose (but all positive here) simplify
    const intensity = Math.round(v*255);
    return `rgb(${255-intensity},${255-intensity},255)`; // light blue to white
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
                <BarChart3 className="w-7 h-7 text-indigo-600" /> Strategic Statistics
                {refreshing && <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Multi-dimensional situational analytics & performance indicators.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                {(['24h','7d','30d','90d','YTD'] as const).map(r => (
                  <button key={r} onClick={()=> setRange(r)} className={`px-3 py-1 rounded-full text-xs font-medium ${range===r? 'bg-white shadow border border-gray-300':'text-gray-600 hover:text-gray-900'}`}>{r}</button>
                ))}
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select value={hazard} onChange={e=> setHazard(e.target.value as any)} className="pl-9 pr-8 py-2 rounded-full border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="all">All Hazards</option>
                  <option value="flood">Flood</option>
                  <option value="rain">Rain</option>
                  <option value="heat">Heat</option>
                  <option value="wind">Wind</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">▼</span>
              </div>
              <div className="relative">
                <Globe2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select value={region} onChange={e=> setRegion(e.target.value as any)} className="pl-9 pr-8 py-2 rounded-full border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="all">All Regions</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="west">West</option>
                  <option value="central">Central</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">▼</span>
              </div>
              <button onClick={doRefresh} className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-300 text-sm bg-white hover:bg-gray-100"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin':''}`} />Refresh</button>
            </div>
          </section>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpis.map(k => (
              <div key={k.id} className="group relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="p-2 rounded-lg bg-gray-100 text-gray-700">{k.icon}</span>
                    <span className="text-xs font-medium tracking-wide uppercase">{k.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${trendColor(k.delta)}`}>{k.delta>0?`+${formatNumber(k.delta)}`:formatNumber(k.delta)}</span>
                </div>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 leading-none">{formatNumber(k.value)} {k.suffix && <span className="text-sm font-medium text-gray-500">{k.suffix}</span>}</h3>
                  <span className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> trend</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all" style={{ width: `${Math.min(100, 30 + (k.delta>0? (k.delta/ (k.value||1))*1000 : 10))}%` }} />
                </div>
                <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-indigo-200 pointer-events-none" />
              </div>
            ))}
          </section>

          {/* Main analytic grid */}
          <section className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
            {/* Left column (2 spans) */}
            <div className="space-y-8 2xl:col-span-2">
              {/* Multi-line Time Series */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><LineChart className="w-5 h-5 text-blue-600" /> Multi-Hazard Time Series</h3>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wide">{range} window</span>
                </div>
                <div className="relative h-64">
                  <svg viewBox="0 0 800 240" className="absolute inset-0 w-full h-full">
                    {/* grid */}
                    {Array.from({length:5}).map((_,i)=> <line key={i} x1={0} x2={800} y1={i*48} y2={i*48} stroke="#ececec" />)}
                    {(()=>{ const {labels,flood,rain,heat}=timeseries; const step=800/(labels.length-1); const build=(arr:number[])=> arr.map((v,i)=>`L${i*step},${200 - v/ (Math.max(...arr)+60) *180 +20}`).join(' ').replace('L','M');
                      const black = '#111';
                      const floodPath = build(flood);
                      const rainPath = build(rain);
                      const heatScaled = heat.map(v=> v*40); // scale for visibility
                      const heatPath = build(heatScaled);
                      return <g>
                        <path d={floodPath} fill="none" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
                        <path d={rainPath} fill="none" stroke="#10b981" strokeWidth={3} strokeLinecap="round" />
                        <path d={heatPath} fill="none" stroke="#f59e0b" strokeWidth={3} strokeDasharray="4 4" strokeLinecap="round" />
                        {labels.map((l,i)=> <text key={l} x={i*step} y={232} fontSize={10} textAnchor="middle" fill="#555">{l}</text>)}
                        <text x={10} y={14} fontSize={10} fill={black}>Flood Index</text>
                        <text x={110} y={14} fontSize={10} fill={black}>Rainfall Load</text>
                        <text x={230} y={14} fontSize={10} fill={black}>Temp Anomaly</text>
                      </g>; })()}
                  </svg>
                </div>
                <div className="mt-3 flex gap-4 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-blue-600" /> Flood</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-emerald-500" /> Rain</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-amber-500" /> Temp</span>
                </div>
              </div>

              {/* Regional Table */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-600" /> Regional Performance</h3>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wide">response KPI</span>
                </div>
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="py-2 text-left text-gray-600 font-medium">Region</th>
                        <th className="py-2 text-left text-gray-600 font-medium">Exposure</th>
                        <th className="py-2 text-left text-gray-600 font-medium">Incidents</th>
                        <th className="py-2 text-left text-gray-600 font-medium">Avg Response (min)</th>
                        <th className="py-2 text-left text-gray-600 font-medium">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regional.map(r => {
                        const efficiency = Math.min(100, (r.incidents / (r.exposures/1000)) * 12);
                        return (
                          <tr key={r.region} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50">
                            <td className="py-2 font-medium text-gray-800">{r.region}</td>
                            <td className="py-2 tabular-nums">{formatNumber(r.exposures)}</td>
                            <td className="py-2 tabular-nums text-blue-600">{formatNumber(r.incidents)}</td>
                            <td className="py-2 tabular-nums text-gray-700">{r.responseTime}</td>
                            <td className="py-2">
                              <div className="flex items-center gap-2 w-28">
                                <div className="h-1.5 flex-1 bg-gray-200 rounded overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{width:`${efficiency}%`}} />
                                </div>
                                <span className="text-[10px] text-gray-600 tabular-nums">{efficiency.toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Map & Severity Distribution */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-rose-600" /> Spatial Overview</h3>
                    <span className="text-[11px] text-gray-500 uppercase tracking-wide">interactive</span>
                  </div>
                  <div className="h-72 w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-50 relative">
                    {!isClient && <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">Loading map...</div>}
                    {isClient && (
                      <MapContainer center={[54,-2]} zoom={6} scrollWheelZoom style={{height:'100%', width:'100%'}}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      </MapContainer>
                    )}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-600" /> Severity Distribution</h3>
                  <ul className="space-y-3 mb-4">
                    {severity.map(s => (
                      <li key={s.label} className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-sm ${s.color}`} />
                        <span className="text-sm font-medium w-20">{s.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                          <div className={`h-full ${s.color}`} style={{ width: `${(s.value/severityTotal)*100}%` }} />
                        </div>
                        <span className="text-xs font-medium tabular-nums w-8 text-right">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto text-[11px] text-gray-500">Total zones: {severityTotal}</div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              {/* Correlation Heatmap */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-fuchsia-600" /> Variable Correlation</h3>
                <div className="overflow-auto">
                  <table className="border-collapse text-[11px]">
                    <thead>
                      <tr>
                        <th className="p-1" />
                        {variables.map(v => <th key={v} className="px-2 py-1 font-medium text-gray-600 text-center">{v}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {correlation.map((row,i) => (
                        <tr key={i}>
                          <th className="pr-2 py-1 font-medium text-gray-600 text-right sticky left-0 bg-white">{variables[i]}</th>
                          {row.map((val,j)=>(
                            <td key={j} className="w-14 h-10 relative text-center font-semibold" style={{ background: corrColor(val) }}>
                              <span className="absolute inset-0 flex items-center justify-center" style={{ color: val>0.6? '#111':'#333'}}>{val.toFixed(2)}</span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[10px] text-gray-500">Positive Pearson correlations among monitored environmental & impact indicators.</p>
              </div>

              {/* Hazard Legend / Icons */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-sky-600" /> Hazard Layers</h3>
                <ul className="grid grid-cols-2 gap-3 text-sm">
                  <li className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-600" /> Rainfall Accumulation</li>
                  <li className="flex items-center gap-2"><Waves className="w-4 h-4 text-cyan-600" /> River Discharge</li>
                  <li className="flex items-center gap-2"><ThermometerSun className="w-4 h-4 text-amber-500" /> Temperature Anomaly</li>
                  <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> Lightning Density</li>
                </ul>
                <p className="mt-4 text-[11px] text-gray-500">Layer combinations aid rapid situational interpretation.</p>
              </div>

              {/* Meta / Notes */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-600" /> Data Notes</h3>
                <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600">
                  <li>Population exposure derived from gridded census & hazard overlap.</li>
                  <li>Incidents consolidated from field, sensor & remote sensing triggers.</li>
                  <li>Response KPIs exclude unresolved queries older than 48h.</li>
                  <li>Correlations recalculated nightly from rolling 30‑day window.</li>
                  <li>All timestamps in UTC; update latency ~3–5 minutes.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
            <span>Stats version: v1.0-beta</span>
            <span>Data window: {range}</span>
            <span>Hazard: {hazard}</span>
            <span className="ml-auto">© {new Date().getFullYear()} Banjay Analytics</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
