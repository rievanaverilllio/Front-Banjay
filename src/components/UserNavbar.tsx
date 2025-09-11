'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaExpand, FaCompress, FaBars, FaBell } from 'react-icons/fa';

interface UserNavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLogoutCard, setShowLogoutCard] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{
    id: string;
    title: string;
    time: string;
    read: boolean;
    type?: 'info' | 'alert' | 'success';
  }[]>([
    { id: '1', title: 'Laporan banjir baru di Jakarta Utara', time: '2m', read: false, type: 'alert' },
    { id: '2', title: 'Analisis risiko mingguan siap dilihat', time: '15m', read: false, type: 'info' },
    { id: '3', title: 'Dokumen “Mitigasi_2025.pdf” berhasil diunggah', time: '1h', read: true, type: 'success' },
  ]);

  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        notifRef.current && !notifRef.current.contains(e.target as Node) &&
        profileRef.current && !profileRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
        setShowLogoutCard(false);
      } else {
        if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
          setShowNotifications((prev) => (profileRef.current?.contains(e.target as Node) ? prev : prev));
        }
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowLogoutCard(false);
      }
    };
    window.addEventListener('mousedown', handler);
    window.addEventListener('keydown', escHandler);
    return () => {
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('keydown', escHandler);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((s) => !s);
    setShowLogoutCard(false);
    // Mark all as read when opening (optional behavior)
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
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
          <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotifications}
              className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Toggle notifications"
            >
              <FaBell className="text-xl relative top-[2px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 max-h-[26rem] overflow-hidden flex flex-col bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                  <span className="font-semibold text-sm text-gray-700">Notifikasi</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >Tutup</button>
                </div>
                <div className="overflow-y-auto custom-scrollbar divide-y divide-gray-100">
                  {notifications.length === 0 && (
                    <div className="p-4 text-sm text-gray-500">Tidak ada notifikasi</div>
                  )}
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-3 text-sm flex gap-3 hover:bg-gray-50 ${!n.read ? 'bg-orange-50' : ''}`}>
                      <div className={`mt-0.5 w-2 h-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-orange-500 animate-pulse'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-700 line-clamp-2">{n.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] uppercase tracking-wide text-gray-400">{n.time}</span>
                          {n.type && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                              n.type === 'alert'
                                ? 'bg-red-100 text-red-600'
                                : n.type === 'info'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-green-100 text-green-600'
                            }`}>{n.type}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t bg-gray-50 flex gap-2">
                  <button
                    onClick={() => setNotifications([])}
                    className="flex-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded px-2 py-1"
                  >Bersihkan</button>
                  <button
                    onClick={() => setNotifications((l) => l.map((x) => ({ ...x, read: true })))}
                    className="flex-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded px-2 py-1"
                  >Tandai sudah dibaca</button>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={profileRef}>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setShowLogoutCard(!showLogoutCard); setShowNotifications(false); }}>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                J
              </div>
              <span>John Doe</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {showLogoutCard && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button onClick={() => router.push('/user/profile')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</button>
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