'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaExpand, FaCompress, FaBars, FaBell } from 'react-icons/fa';

interface UserNavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLogoutCard, setShowLogoutCard] = useState(false);
  const router = useRouter();

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
    <header className="bg-white px-6 py-6 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 focus:outline-none mr-4">
          <FaBars className="text-xl" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={toggleFullScreen} className="text-gray-600 hover:text-gray-800 focus:outline-none">
          {isFullScreen ? <FaCompress className="text-xl" /> : <FaExpand className="text-xl" />}
        </button>
        <div className="flex items-center space-x-4">
          <FaBell className="text-gray-600 text-xl cursor-pointer hover:text-gray-800" />
          <div className="relative">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowLogoutCard(!showLogoutCard)}>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                J
              </div>
              <span>John Doe</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {showLogoutCard && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</button>
                <button onClick={() => router.push('/login')} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;