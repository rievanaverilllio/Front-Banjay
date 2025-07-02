'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { FaChartPie, FaWater, FaExclamationTriangle, FaHistory, FaFileAlt, FaSyncAlt, FaUserShield, FaCog } from 'react-icons/fa';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen }) => {
  const pathname = usePathname();
  return (
    <aside className={`bg-gray-200 text-gray-800 flex flex-col p-4 shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center text-xl font-bold mb-8 text-white">
        <img src="/favicon.png" alt="BANJAY Logo" className="h-8 w-8 mr-2" />
        {isSidebarOpen && <span className="text-gray-800">BANJAY</span>}
      </div>
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <a href="/admin/dashboard" className={`flex items-center p-2 rounded-lg hover:bg-gray-300 ${pathname === '/admin/dashboard' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-800'}`}>
              <FaChartPie className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span className="text-gray-800">Dashboard</span>}
            </a>
          </li>
          <li className="mb-2">
            <a href="/admin/input_data" className={`flex items-center p-2 rounded-lg hover:bg-gray-300 ${pathname === '/admin/input_data' ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}>
              <FaWater className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span className="text-gray-800">Input Data</span>}
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-300 text-gray-800">
              <FaExclamationTriangle className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span className="text-gray-800">Alerts</span>} {isSidebarOpen && <span className="ml-auto text-xs bg-red-500 rounded-full px-2 py-1">5</span>}
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-300 text-gray-800">
              <FaHistory className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span className="text-gray-800">Historical Data</span>}
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-300 text-gray-800">
              <FaFileAlt className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span className="text-gray-800">Reports</span>}
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-300 text-gray-800">
              <FaSyncAlt className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span className="text-gray-800">Integrations</span>}
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-300 text-gray-800">
              <FaUserShield className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span className="text-gray-800">Personnel</span>}
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-300 text-gray-800">
          <FaCog className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span className="text-gray-800">Settings</span>}
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar; 