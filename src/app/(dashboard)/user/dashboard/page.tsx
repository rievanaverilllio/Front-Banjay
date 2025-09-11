"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AlertTriangle, Activity, Users, MapPin, RefreshCw, Bell, Globe2, ShieldCheck, Target, Clock, TrendingUp } from 'lucide-react';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';

// Utility formatting
const formatNumber = (n: number) => n.toLocaleString('en-US');
const trendColor = (v: number) => v === 0 ? 'text-gray-500' : v > 0 ? 'text-green-600' : 'text-red-600';

// Simple sparkline path generator
function buildSparkPath(values: number[], width = 140, height = 40, pad = 4) {
  if (!values.length) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (width - pad * 2) / (values.length - 1);
  return values.map((v, i) => {
    const x = pad + i * step;
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
}

interface KPI {
  id: string; label: string; value: number; unit?: string; delta: number; icon: React.ReactNode; series: number[];}

export default function UserDashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [range, setRange] = useState<'24h'|'7d'|'30d'|'90d'>('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  const toggleSidebar = () => setIsSidebarOpen(s => !s);

  // Mock data (could be fetched)
  const kpis: KPI[] = useMemo(() => [
    { id: 'area', label: 'Areas Impacted', value: 129044, unit: 'ha', delta: 4301, icon: <MapPin className="w-5 h-5" />, series: [78,82,81,90,87,105,99] },
    { id: 'displaced', label: 'Displaced Persons', value: 15002, delta: 1442, icon: <Users className="w-5 h-5" />, series: [20,25,24,28,30,33,35] },
    { id: 'damage', label: 'Damages Reported', value: 25215, delta: 5142, icon: <AlertTriangle className="w-5 h-5" />, series: [210,220,230,240,260,255,268] },
    { id: 'rescues', label: 'Rescue Operations', value: 501379, delta: 10282, icon: <ShieldCheck className="w-5 h-5" />, series: [120,140,135,150,170,165,180] },
  ], []);

  const incidentsDaily = useMemo(() => ({
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    values: [312, 388, 401, 366, 520, 480, 455]
  }), []);

  const riskDistribution = [
    { label: 'High', value: 42, color: '#dc2626' },
    { label: 'Medium', value: 33, color: '#f59e0b' },
    { label: 'Low', value: 25, color: '#16a34a' },
  ];
  const totalRisk = riskDistribution.reduce((a,b)=>a+b.value,0);

  const activities = [
    { id:1, icon: <Bell className="w-4 h-4 text-blue-600" />, title:'New flood alert issued', desc:'Coastal zone - surge expected', time:'5m ago' },
    { id:2, icon: <Activity className="w-4 h-4 text-emerald-600" />, title:'Model retrained', desc:'Hydrology v2.3 deployed', time:'18m ago' },
    { id:3, icon: <MapPin className="w-4 h-4 text-purple-600" />, title:'Sensor offline', desc:'Station #A12 lost signal', time:'31m ago' },
    { id:4, icon: <Users className="w-4 h-4 text-rose-600" />, title:'Evacuation updated', desc:'Zone NW coverage +12%', time:'1h ago' },
  ];

  const regions = [
    { region:'London', impacted:22125, displaced:4038, rescued:757 },
    { region:'Kent', impacted:2597, displaced:49, rescued:145 },
    { region:'Birmingham', impacted:2361, displaced:8, rescued:241 },
    { region:'Hampshire', impacted:2251, displaced:5, rescued:135 },
    { region:'Lancashire', impacted:2170, displaced:5, rescued:98 },
    { region:'Surrey', impacted:2100, displaced:7, rescued:21 },
  ];

  const refreshAll = () => {
    setRefreshing(true);
    setTimeout(()=> setRefreshing(false), 1000);
  };

  return (
    <div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
      <UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden">
        <UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Header / Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                  Operational Dashboard
                  {refreshing && <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Real-time situational awareness, impact metrics, and response performance.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {(['24h','7d','30d','90d'] as const).map(r => (
                  <button key={r} onClick={()=>setRange(r)} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${range===r ? 'bg-black text-white border-black' : 'bg-white text-gray-600 hover:text-black border-gray-300'}`}>{r}</button>
                ))}
                <button onClick={refreshAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium bg-white hover:bg-gray-100">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>
            </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpis.map(k => {
              const spark = buildSparkPath(k.series);
              const lastDelta = k.delta;
              return (
                <div key={k.id} className="relative group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="p-2 rounded-lg bg-gray-100 text-gray-700">{k.icon}</span>
                      <span className="text-xs font-medium tracking-wide uppercase">{k.label}</span>
                    </div>
                    <span className={`text-xs font-medium ${trendColor(lastDelta)}`}>{lastDelta>0?`+${formatNumber(lastDelta)}`:formatNumber(lastDelta)}</span>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 leading-none">{formatNumber(k.value)} {k.unit && <span className="text-sm font-medium text-gray-500">{k.unit}</span>}</h3>
                      <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 7d trend</p>
                    </div>
                    <svg viewBox="0 0 140 40" className="w-24 h-10" preserveAspectRatio="none">
                      <path d={spark} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" />
                      {k.series.map((v,i,arr)=> i===arr.length-1 && (
                        <circle key={i} cx={140-4} cy={(() => { // compute last y
                          const min = Math.min(...arr); const max = Math.max(...arr); const span = max-min || 1; return 40-4 - ((v-min)/span)*(40-8);
                        })()} r={3} className="fill-blue-600" />
                      ))}
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-blue-200 pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
            {/* Left column: Map + Table */}
            <div className="space-y-6 2xl:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Globe2 className="w-5 h-5 text-blue-600" /> Geographic Impact Map</h3>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wide">Zoom & explore</span>
                </div>
                <div className="w-full rounded-lg overflow-hidden border border-gray-300 z-0 h-[420px] relative bg-gray-50">
                  {!isClient && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                      Loading map...
                    </div>
                  )}
                  {isClient && (
                    <MapContainer
                      center={[54.0, -2.0]}
                      zoom={6}
                      scrollWheelZoom
                      style={{ height: '100%', width: '100%' }}
                      preferCanvas
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[51.5, -0.1]} />
                      <Marker position={[51.2, 0.5]} />
                      <Marker position={[52.4, -1.9]} />
                      <Marker position={[51.0, -1.3]} />
                      <Marker position={[53.8, -2.5]} />
                      <Marker position={[51.2, -0.6]} />
                    </MapContainer>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-600" /> Regional Statistics</h3>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wide">Sorted by impact</span>
                </div>
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="py-2 text-left text-gray-600 font-medium">Region</th>
                        <th className="py-2 text-left text-gray-600 font-medium">Impacted</th>
                        <th className="py-2 text-left text-gray-600 font-medium">Displaced</th>
                        <th className="py-2 text-left text-gray-600 font-medium">Rescued</th>
                        <th className="py-2 text-left text-gray-600 font-medium">% Rescued</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regions.map(r => {
                        const pct = (r.rescued / (r.displaced || 1))*100;
                        return (
                          <tr key={r.region} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50">
                            <td className="py-2 font-medium text-gray-800">{r.region}</td>
                            <td className="py-2 tabular-nums">{formatNumber(r.impacted)}</td>
                            <td className="py-2 tabular-nums text-red-600">{formatNumber(r.displaced)}</td>
                            <td className="py-2 tabular-nums text-green-600">{formatNumber(r.rescued)}</td>
                            <td className="py-2">
                              <div className="flex items-center gap-2 w-24">
                                <div className="h-1.5 flex-1 bg-gray-200 rounded overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(pct,100)}%` }} />
                                </div>
                                <span className="text-[10px] text-gray-600 tabular-nums">{pct.toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right column widgets */}
            <div className="space-y-6">
              {/* Incident Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-pink-600" /> Daily Incident Trend</h3>
                <div className="relative h-48">
                  <svg viewBox="0 0 400 160" className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="gradLine" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    {/* grid */}
                    {Array.from({length:4}).map((_,i)=>(<line key={i} x1={0} x2={400} y1={i*40} y2={i*40} stroke="#e5e7eb" strokeWidth={1} />))}
                    {(()=>{ const vals=incidentsDaily.values; const min=Math.min(...vals); const max=Math.max(...vals); const span=max-min||1; const step=400/(vals.length-1); const pts=vals.map((v,i)=>({x:i*step,y:160- ((v-min)/span)*150 -5})); const path=pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' '); const area=path + ` L 400 160 L 0 160 Z`; return (<g>
                      <path d={area} fill="url(#gradLine)" />
                      <path d={path} fill="none" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
                      {pts.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r={4} className="fill-white stroke-blue-600" strokeWidth={2} />))}
                    </g>); })()}
                  </svg>
                  <div className="absolute top-2 right-2 flex gap-2 text-[10px] text-gray-500 uppercase tracking-wide">{incidentsDaily.labels.map(l=> <span key={l}>{l}</span>)}</div>
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-600" /> Risk Distribution</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 42 42" className="w-full h-full rotate-[-90deg]">
                      <circle cx="21" cy="21" r="15.915" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                      {(()=>{let offset=0; return riskDistribution.map(seg=>{ const frac=seg.value/totalRisk; const dash = frac*100; const circle=(<circle key={seg.label} cx="21" cy="21" r="15.915" fill="none" stroke={seg.color} strokeWidth="6" strokeDasharray={`${dash} ${100-dash}`} strokeDashoffset={offset} strokeLinecap="round" />); offset -= dash; return circle;}); })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs uppercase text-gray-500">Total</span>
                      <span className="text-xl font-bold text-gray-900">{totalRisk}</span>
                      <span className="text-[10px] text-gray-400">zones</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {riskDistribution.map(r => (
                      <div key={r.label} className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background:r.color }} />
                        <span className="text-sm font-medium w-16">{r.label}</span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded overflow-hidden">
                          <div className="h-full" style={{ width:`${(r.value/totalRisk)*100}%`, background:r.color }} />
                        </div>
                        <span className="text-xs font-medium tabular-nums w-10 text-right">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-sky-600" /> Recent Activity</h3>
                <ul className="space-y-4">
                  {activities.map(a => (
                    <li key={a.id} className="flex items-start gap-3">
                      <div className="mt-0.5">{a.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{a.title}</p>
                        <p className="text-xs text-gray-500">{a.desc}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer meta */}
          <div className="pt-4 border-t border-gray-200 text-[11px] text-gray-500 flex flex-wrap items-center gap-4">
            <span>Data latency: <strong className="font-semibold text-gray-700">~3 min</strong></span>
            <span>Last sync: 2m ago</span>
            <span>Version: v0.9.2-pre</span>
            <span className="ml-auto">© {new Date().getFullYear()} Banjay Analytics</span>
          </div>
        </main>
      </div>
    </div>
  );
}
