"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

import AdminSidebar from '@/components/AdminSidebar';
import AdminNavbar from '@/components/AdminNavbar';

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

export default function AdminDashboardPage() {
  const [lastUpdateDate, setLastUpdateDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLogoutCard, setShowLogoutCard] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set the date on the client-side after hydration
  useEffect(() => {
    setLastUpdateDate(new Date().toLocaleString());
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullScreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullScreen(false));
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      {/* Sidebar */}
      <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {/* Top row - VEHICLES ON THE ROAD -> FLOOD OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
              <p className="text-sm text-gray-500 mb-1">AREAS UNDER WATER</p>
              <h3 className="text-3xl font-bold text-gray-900">243 km² <span className="text-red-500 text-sm ml-2">+13%</span></h3>
              <p className="text-xs text-gray-400">from last month</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
              <p className="text-sm text-gray-500 mb-1">ACTIVE SENSORS</p>
              <h3 className="text-3xl font-bold text-gray-900">71</h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
              <p className="text-sm text-gray-500 mb-1">DISPLACED POPULATION</p>
              <h3 className="text-3xl font-bold text-gray-900">1460</h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-start">
              <p className="text-sm text-gray-500 mb-1">CRITICAL ALERTS</p>
              <h3 className="text-3xl font-bold text-gray-900">11</h3>
            </div>
          </div>

          {/* Middle Section: Map and Reports/Fleet Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Map */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Real-time Flood Impact Map</h3>
              <div className="flex-1 w-full rounded-lg overflow-hidden border border-gray-300 z-0">
                {isClient && (
                  <MapContainer center={[48.69096, 9.17657]} zoom={4} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* You can add markers or other Leaflet layers here */}
                    {/* Example Marker */}
                    <Marker position={[48.69096, 9.17657]}></Marker>
                  </MapContainer>
                )}
              </div>
            </div>

            {/* New Flood Alerts & Current Fleet Status */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* New Flood Alerts */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">NEW FLOOD ALERTS</h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">10:15 AM <span className="text-gray-500">15.05.24</span></p>
                      <p className="text-red-700">River overflow in Central District</p>
                    </div>
                    <button className="px-4 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition">VIEW</button>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">09:30 AM <span className="text-gray-500">15.05.24</span></p>
                      <p className="text-orange-700">Flash flood warning - Western Region</p>
                    </div>
                    <button className="px-4 py-1 bg-orange-100 text-orange-700 rounded-md text-sm hover:bg-orange-200 transition">VIEW</button>
                  </li>
                </ul>
              </div>

              {/* Status of Sensors */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">STATUS OF SENSORS</h3>
                <div className="flex items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm mr-4">
                    [Pie Chart]
                  </div>
                  <ul className="text-sm space-y-1">
                    <li><span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>Operational <span className="font-bold ml-2">310</span></li>
                    <li><span className="inline-block w-3 h-3 bg-red-400 rounded-full mr-2"></span>Offline <span className="font-bold ml-2">5</span></li>
                    <li><span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>Needs Maintenance <span className="font-bold ml-2">12</span></li>
                    <li><span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>New Deployment <span className="font-bold ml-2">8</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Basic Stats, Crashes Chart, Profitable Routes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col items-start">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">RESPONSE EFFICIENCY</h3>
              <div className="flex justify-around w-full">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mb-2">85%</div>
                  <p className="text-xs text-gray-600 text-center">SUCCESSFUL<br/>EVACUATIONS</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mb-2">72%</div>
                  <p className="text-xs text-gray-600 text-center">AFFECTED AREA<br/>MONITORED</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mb-2">79%</div>
                  <p className="text-xs text-gray-600 text-center">POPULATION<br/>INFORMED</p>
                </div>
              </div>
            </div>

            {/* Reported Crashes Chart -> DAILY FLOOD INCIDENTS */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col items-start">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">DAILY FLOOD INCIDENTS</h3>
              <div className="flex-1 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-lg border border-gray-300 min-h-[150px]">
                [ Bar Chart Placeholder ]
              </div>
            </div>

            {/* Most Profitable Routes -> RESOURCE DEPLOYMENT PRIORITY */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">RESOURCE DEPLOYMENT PRIORITY</h3>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left text-gray-500 font-normal">Area</th>
                    <th className="py-2 text-left text-gray-500 font-normal">Severity</th>
                    <th className="py-2 text-left text-gray-500 font-normal">Population</th>
                    <th className="py-2 text-left text-gray-500 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Northern Plains</td>
                    <td className="py-2">High</td>
                    <td className="py-2">12,500</td>
                    <td className="py-2 text-red-500">Critical ▲</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Coastal Region</td>
                    <td className="py-2">Medium</td>
                    <td className="py-2">8,200</td>
                    <td className="py-2 text-orange-500">Warning ▼</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Mountain Valley</td>
                    <td className="py-2">Low</td>
                    <td className="py-2">3,100</td>
                    <td className="py-2 text-green-500">Stable ▲</td>
                  </tr>
                  <tr>
                    <td className="py-2">Eastern Riverbank</td>
                    <td className="py-2">High</td>
                    <td className="py-2">9,800</td>
                    <td className="py-2 text-red-500">Critical ▲</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
