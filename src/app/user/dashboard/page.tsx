"use client";

import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';

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

export default function UserDashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
      <UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden">
        <UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Top Row - Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
              <p className="text-sm text-gray-500 mb-1">AREAS IMPACTED</p>
              <h3 className="text-3xl font-bold text-gray-900">129,044 ha <span className="text-red-500 text-sm ml-2">+4,301</span></h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
              <p className="text-sm text-gray-500 mb-1">DISPLACED PERSONS</p>
              <h3 className="text-3xl font-bold text-gray-900">15,002 <span className="text-red-500 text-sm ml-2">+1,442</span></h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
              <p className="text-sm text-gray-500 mb-1">DAMAGES REPORTED</p>
              <h3 className="text-3xl font-bold text-gray-900">25,215 <span className="text-red-500 text-sm ml-2">+5,142</span></h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
              <p className="text-sm text-gray-500 mb-1">RESCUE OPERATIONS</p>
              <h3 className="text-3xl font-bold text-gray-900">501,379 <span className="text-green-500 text-sm ml-2">+10,282</span></h3>
            </div>
          </div>

          {/* Middle Section: Map and Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Map */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Map</h3>
              <div className="flex-1 w-full rounded-lg overflow-hidden border border-gray-300 z-0 min-h-[300px]">
                {isClient && (
                  <MapContainer center={[54.0, -2.0]} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Example Markers for UK regions - These are placeholders and should be replaced with actual data */}
                    <Marker position={[51.5, -0.1]}></Marker> {/* London */}
                    <Marker position={[51.2, 0.5]}></Marker> {/* Kent */}
                    <Marker position={[52.4, -1.9]}></Marker> {/* Birmingham */}
                    <Marker position={[51.0, -1.3]}></Marker> {/* Hampshire */}
                    <Marker position={[53.8, -2.5]}></Marker> {/* Lancashire */}
                    <Marker position={[51.2, -0.6]}></Marker> {/* Surrey */}
                  </MapContainer>
                )}
              </div>
            </div>

            {/* Statistics Table */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Statistics</h3>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-2 text-left text-gray-600 font-normal">Region</th>
                    <th className="py-2 text-left text-gray-600 font-normal">Impacted</th>
                    <th className="py-2 text-left text-gray-600 font-normal">Displaced</th>
                    <th className="py-2 text-left text-gray-600 font-normal">Rescued</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">London</td>
                    <td className="py-2">22,125</td>
                    <td className="py-2 text-red-500">4,038</td>
                    <td className="py-2 text-green-500">757</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Kent</td>
                    <td className="py-2">2,597</td>
                    <td className="py-2 text-red-500">49</td>
                    <td className="py-2 text-green-500">145</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Birmingham</td>
                    <td className="py-2">2,361</td>
                    <td className="py-2 text-red-500">8</td>
                    <td className="py-2 text-green-500">241</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Hampshire</td>
                    <td className="py-2">2,251</td>
                    <td className="py-2 text-red-500">5</td>
                    <td className="py-2 text-green-500">135</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Lancashire</td>
                    <td className="py-2">2,170</td>
                    <td className="py-2 text-red-500">5</td>
                    <td className="py-2 text-green-500">98</td>
                  </tr>
                  <tr>
                    <td className="py-2">Surrey</td>
                    <td className="py-2">2,100</td>
                    <td className="py-2 text-red-500">7</td>
                    <td className="py-2 text-green-500">21</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Diagram Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Diagram: Daily Flood Incidents</h3>
            <div className="h-64 bg-white rounded-lg flex items-end justify-around p-4 relative">
              {/* Y-axis labels - placeholders for visual alignment */}
              <div className="absolute left-4 top-4 text-xs text-gray-400">120k</div>
              <div className="absolute left-4 top-1/4 text-xs text-gray-400">90k</div>
              <div className="absolute left-4 top-1/2 text-xs text-gray-400">60k</div>
              <div className="absolute left-4 bottom-4 text-xs text-gray-400">0</div>

              {/* Bars for chart - adjusted to mimic the image visually */}
              {/* Values are scaled to visually match the relative heights in the image */}
              <div className="h-full w-px bg-gray-200 absolute left-14"></div> {/* Y-axis line */}
              {[ /* value, is_active */
                [70, false], // 13 Apr
                [85, false], // 14 Apr
                [90, false], // 15 Apr
                [105, false], // 17 Apr
                [120, true],  // 19 Apr - Active bar
                [95, false], // 20 Apr
                [80, false], // 21 Apr
              ].map(([value, isActive], index) => (
                <div
                  key={index}
                  className={`w-10 rounded-t-lg ${isActive ? 'bg-blue-600' : 'bg-blue-100'}`}
                  style={{ height: `${(value as number) * 0.7}%`, marginLeft: '10px', marginRight: '10px' }} // Explicit cast to number
                ></div>
              ))}
            </div>
            <div className="flex justify-around text-xs text-gray-500 mt-2">
              <span>13 Apr</span><span>14 Apr</span><span>15 Apr</span><span>17 Apr</span><span>19 Apr</span><span>20 Apr</span><span>21 Apr</span><span>22 Apr</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
