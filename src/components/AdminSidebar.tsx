'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaChartPie, FaWater, FaExclamationTriangle, FaHistory, FaFileAlt, FaSyncAlt, FaUserShield, FaCog } from 'react-icons/fa';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen }) => {
  const pathname = usePathname();
  const baseItem = 'flex items-center p-2 rounded-lg transition-colors';
  const inactive = 'text-gray-700 hover:bg-gray-100 hover:text-gray-600';
  const active = 'bg-blue-100 text-blue-600 font-semibold';

  return (
    <aside className={`bg-white p-4 shadow-lg flex flex-col justify-between rounded-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div>
        <div className="flex items-center text-xl font-bold mb-8 text-black">
          <img src="/favicon.png" alt="BANJAY Logo" className="h-8 w-8 mr-2" />
          {isSidebarOpen && <span>BANJAY</span>}
        </div>
        <nav className="flex-1">
          <ul>
            <li className="mb-2">
              <Link href="/admin/dashboard" className={`${baseItem} ${pathname === '/admin/dashboard' ? active : inactive}`}>
                <FaChartPie className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/input_data" className={`${baseItem} ${pathname === '/admin/input_data' ? active : inactive}`}>
                <FaWater className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Input Data</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className={`${baseItem} ${inactive}`}>
                <FaExclamationTriangle className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <><span>Alerts</span> <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2 py-0.5">5</span></>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className={`${baseItem} ${inactive}`}>
                <FaHistory className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Historical Data</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className={`${baseItem} ${inactive}`}>
                <FaFileAlt className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Reports</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className={`${baseItem} ${inactive}`}>
                <FaSyncAlt className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Integrations</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className={`${baseItem} ${inactive}`}>
                <FaUserShield className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Personnel</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mt-auto">
        <Link href="#" className={`${baseItem} ${inactive}`}>
          <FaCog className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;