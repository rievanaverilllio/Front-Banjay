'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaRegNewspaper, FaChartPie, FaChartBar, FaUserMd, FaEnvelope, FaFileAlt, FaCog, FaHeadset } from 'react-icons/fa';

interface UserSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isSidebarOpen }) => {
  const pathname = usePathname();
  return (
    <aside className={`bg-white p-4 shadow-lg flex flex-col justify-between rounded-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div>
        <div className="flex items-center text-xl font-bold mb-8 text-black">
          <img src="/favicon.png" alt="BANJAY Logo" className="h-8 w-8 mr-2" />
          {isSidebarOpen && <span>BANJAY</span>}
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/user/news" className={`flex items-center p-2 rounded-lg ${pathname === '/user/news' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-600'}`}>
                <FaRegNewspaper className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>News</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/user/dashboard" className={`flex items-center p-2 rounded-lg ${pathname === '/user/dashboard' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-600'}`}>
                <FaChartPie className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/user/statistics" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-600">
                <FaChartBar className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Statistics</span>}
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/user/reports" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-600">
                <FaUserMd className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Flood Reports</span>}
              </Link>
            </li>
            {/* <li className="mb-2">
              <Link href="/user/messages" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-600">
                <FaEnvelope className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Messages</span>}
              </Link>
            </li> */}
            <li className="mb-2">
              <Link href="/user/documents" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-600">
                <FaFileAlt className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Documents</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mt-auto">
        <ul>
          <li className="mb-2">
            <Link href="/user/settings" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-600">
              <FaCog className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Settings</span>}
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/user/contact" className={`flex items-center p-2 rounded-lg ${pathname === '/contact' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-600'}`}>
              <FaEnvelope className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Contact</span>}
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/user/help" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-600">
              <FaHeadset className={`${isSidebarOpen ? 'mr-3' : 'mr-0'}`} /> {isSidebarOpen && <span>Help</span>}
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default UserSidebar; 