"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex relative">
      {/* Kembali ke Home Button */}
      <Link href="/landing_page" className="absolute top-6 left-6 z-20 flex items-center px-4 py-2 border border-gray-600 text-gray-200 rounded-full bg-[#181C23] hover:bg-[#232A36] hover:text-white transition font-medium text-sm shadow">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Home
      </Link>
      {/* Left: Form Section */}
      <div className="w-full md:w-[55%] bg-[#181C23] flex flex-col justify-center px-8 md:px-24 py-16 min-h-screen">
        <span className="text-white text-lg font-bold italic mb-8">BANJAY</span>
        <p className="text-xs text-gray-400 mb-1">START FOR FREE</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center">
          Create new account
          <span className="text-blue-400 ml-1 text-4xl">.</span>
        </h2>
        <p className="text-sm text-gray-400 mb-6">Already a member? <Link href="/login" className="text-blue-400 hover:underline">Log In</Link></p>
        <form className="space-y-4 max-w-md">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-300 mb-1">First Name</label>
              <div className="relative">
                <input type="text" className="w-full px-4 py-2 rounded bg-[#232A36] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" placeholder="John" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/></svg>
                </span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-300 mb-1">Last Name</label>
              <div className="relative">
                <input type="text" className="w-full px-4 py-2 rounded bg-[#232A36] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" placeholder="Doe" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/></svg>
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Email</label>
            <div className="relative">
              <input type="email" className="w-full px-4 py-2 rounded bg-[#232A36] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" placeholder="johndoe@email.com" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v.217l8 5.333 8-5.333V6.5a.5.5 0 0 0-.5-.5h-15Zm15 13a.5.5 0 0 0 .5-.5V9.217l-7.51 5.006a1 1 0 0 1-1.08 0L4 9.217V17.5a.5.5 0 0 0 .5.5h15Z"/></svg>
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input type="password" className="w-full px-4 py-2 rounded bg-[#232A36] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" placeholder="Password" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6V9a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Zm-8-2a4 4 0 1 1 8 0v2H8V9Zm10 9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5Z"/></svg>
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" className="flex-1 py-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-semibold text-base transition">Change method</button>
            <button type="submit" className="flex-1 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition">Create account</button>
          </div>
        </form>
      </div>
      {/* Right: Image Section */}
      <div className="hidden md:block w-[45%] relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent z-10" />
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="bg" className="w-full h-full object-cover" />
      </div>
    </div>
  );
} 