"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  // Animations removed
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    // TODO: submit form to API
    console.log({ name, email, password });
  };

  return (
    <div className="min-h-screen w-full flex relative bg-[#FAFAF5]">
      {/* Kembali ke Home Button */}
      {/* <Link href="/dashboard" className="absolute top-6 left-6 z-20 flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full bg-white hover:bg-gray-100 hover:text-black transition font-medium text-sm shadow">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Home
      </Link> */}
      {/* Left: Form Section */}
      <div className="w-full md:w-[55%] bg-white flex flex-col justify-center px-8 md:px-24 py-16 min-h-screen text-black">
        <p className="text-xs text-gray-600 mb-1">START FOR FREE</p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-2 flex items-center">
          Create new account
          <span className="text-gray-700 ml-1 text-4xl">.</span>
        </h2>
        <p className="text-sm text-gray-600 mb-6">Already a member? <Link href="/login" className="text-black hover:underline">Log In</Link></p>
        <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                placeholder="John Doe"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/></svg>
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                placeholder="johndoe@email.com"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v.217l8 5.333 8-5.333V6.5a.5.5 0 0 0-.5-.5h-15Zm15 13a.5.5 0 0 0 .5-.5V9.217l-7.51 5.006a1 1 0 0 1-1.08 0L4 9.217V17.5a.5.5 0 0 0 .5.5h15Z"/></svg>
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                placeholder="Password"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6V9a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Zm-8-2a4 4 0 1 1 8 0v2H8V9Zm10 9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5Z"/></svg>
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (password && e.target.value !== password) setError("Passwords do not match");
                  else setError("");
                }}
                className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                placeholder="Confirm Password"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6V9a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Zm-8-2a4 4 0 1 1 8 0v2H8V9Zm10 9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5Z"/></svg>
              </span>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
          <div className="flex gap-2 mt-4">
            {/* <button type="button" className="flex-1 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-black font-semibold text-base transition">Change method</button> */}
            <button type="submit" className="flex-1 py-2 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-base transition">Create account</button>
          </div>
        </form>
      </div>
      {/* Right: Image Section */}
      <div className="hidden md:block w-[45%] relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent z-10" />
        <img src="flood4.jpg" alt="bg" className="w-full h-full object-cover" />
      </div>
    </div>
  );
} 