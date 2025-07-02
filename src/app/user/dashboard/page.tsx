"use client";

import { useState, useMemo, useRef } from 'react';
import Link from "next/link";

export default function UserDashboardPage() {
  const lastUpdateDate = useMemo(() => new Date().toLocaleString(), []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#181818] p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:text-blue-400">Dashboard</a></li>
          <li><a href="/user/profile" className="hover:text-blue-400">Profile</a></li>
          <li><a href="/login" className="hover:text-blue-400">Logout</a></li>
        </ul>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 bg-white text-black">
        {/* Left Section: Map */}
        <section className="flex-1 bg-white rounded-lg shadow-lg p-6 flex flex-col border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">My Flood Monitoring Map</h2>
          <div className="flex-1 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-lg border border-gray-200">
            {/* Placeholder for a large map component */}
            [ Your Personalized Interactive Map Here ]
          </div>
          <p className="text-sm text-gray-700 mt-4">Data last updated: {lastUpdateDate}</p>
        </section>

        {/* Right Section: Other Content */}
        <section className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6 flex flex-col border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Key Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-black">Recent Alerts</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Flood advisory for Area A - High Risk</li>
                <li>River levels rising in Sector B</li>
                <li>Heavy rainfall alert issued</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">My Properties</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Property 1: Safe</li>
                <li>Property 2: Monitor closely</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Help & Support</h3>
              <p className="text-gray-700">Contact support for any issues or questions.</p>
              <button className="mt-2 py-1 px-3 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white">Contact Support</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
