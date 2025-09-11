'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminNavbar from '@/components/AdminNavbar';

export default function InputDataPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Input Flood Data</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <form className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" id="location" name="location" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Central District, River XYZ" />
              </div>
              <div>
                <label htmlFor="waterLevel" className="block text-sm font-medium text-gray-700">Water Level (meters)</label>
                <input type="number" id="waterLevel" name="waterLevel" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 2.5" />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" id="date" name="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <input type="time" id="time" name="time" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea id="description" name="description" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Any additional notes or observations..."></textarea>
              </div>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Submit Data
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 