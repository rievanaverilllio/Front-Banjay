"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const [mainContentRef, mainContentInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fadeInFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between children animations
      },
    },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (email === "user@user.com" && password === "user") {
      router.push("/user/dashboard");
    } else if (email === "admin@admin.com" && password === "admin") {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    // TODO: Integrasi OAuth Google nyata (misal NextAuth / Firebase). Simulasi sementara:
    setTimeout(() => {
      setGoogleLoading(false);
      router.push("/user/dashboard");
    }, 1400);
  };

  return (
    <div className="min-h-screen w-full flex relative bg-[#FAFAF5]">
      {/* Kembali ke Home Button */}
      <Link href="/dashboard" className="absolute top-6 left-6 z-20 flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full bg-white hover:bg-gray-100 hover:text-black transition font-medium text-sm shadow">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Home
      </Link>
      {/* Left: Form Section */}
      <motion.div
        ref={mainContentRef}
        initial="hidden"
        animate={mainContentInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="w-full md:w-[55%] bg-white flex flex-col justify-center px-8 md:px-24 py-16 min-h-screen text-black"
      >
        <motion.p variants={fadeInFromBottom} className="text-xs text-gray-600 mb-1">START FOR FREE</motion.p>
        <motion.h2 variants={fadeInFromBottom} className="text-3xl sm:text-4xl font-extrabold text-black mb-2 flex items-center">
          Log in to your account
          <span className="text-gray-700 ml-1 text-4xl">.</span>
        </motion.h2>
        <motion.p variants={fadeInFromBottom} className="text-sm text-gray-600 mb-6">Not a member? <Link href="/signup" className="text-black hover:underline">Create account</Link></motion.p>
        <div className="w-full max-w-md">
          {/* Google Login Button */}
          <motion.button
            variants={fadeInFromBottom}
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-60 text-gray-700 font-medium text-sm transition shadow-sm"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.8v3.6h5.06c-.22 1.16-.9 2.14-1.93 2.8l3.12 2.42C20.3 18.07 21.2 15.7 21.2 13c0-.7-.06-1.37-.18-2H12Z" />
                <path fill="#34A853" d="M6.56 14.32a5.18 5.18 0 0 1 0-4.64L3.3 7.18a9.02 9.02 0 0 0 0 9.64l3.26-2.5Z" />
                <path fill="#FBBC05" d="M12 5.4c1.04 0 1.98.36 2.72 1.06l2.04-2.04A8.58 8.58 0 0 0 12 2.2a8.8 8.8 0 0 0-8.7 5l3.26 2.5A5.2 5.2 0 0 1 12 5.4Z" />
                <path fill="#4285F4" d="M12 21.8c2.16 0 3.98-.7 5.34-1.92l-3.12-2.42c-.86.56-1.94.9-3.22.9a5.2 5.2 0 0 1-4.44-2.54L3.3 16.82A8.8 8.8 0 0 0 12 21.8Z" />
              </svg>
            )}
            <span className="leading-none">Sign in with Google</span>
          </motion.button>
          <motion.div variants={fadeInFromBottom} className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] tracking-wider text-gray-500 font-medium uppercase">or</span>
            <span className="h-px flex-1 bg-gray-200" />
          </motion.div>
          <form className="space-y-4" onSubmit={handleLogin}>
          <motion.div variants={fadeInFromBottom}>
            <label className="block text-xs text-gray-600 mb-1">Email</label>
            <div className="relative">
              <input type="email" className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" placeholder="johndoe@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v.217l8 5.333 8-5.333V6.5a.5.5 0 0 0-.5-.5h-15Zm15 13a.5.5 0 0 0 .5-.5V9.217l-7.51 5.006a1 1 0 0 1-1.08 0L4 9.217V17.5a.5.5 0 0 0 .5.5h15Z"/></svg>
              </span>
            </div>
          </motion.div>
          <motion.div variants={fadeInFromBottom}>
            <label className="block text-xs text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input type="password" className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6V9a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Zm-8-2a4 4 0 1 1 8 0v2H8V9Zm10 9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5Z"/></svg>
              </span>
            </div>
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-xs font-medium text-gray-600 hover:text-black transition underline-offset-2 hover:underline">
                  Forgot password?
                </Link>
              </div>
          </motion.div>
          {error && <motion.p variants={fadeInFromBottom} className="text-red-500 text-sm mt-2">{error}</motion.p>}
          <motion.button variants={fadeInFromBottom} type="submit" className="w-full py-2 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-base transition mt-2">Log In</motion.button>
        </form>
        </div>
      </motion.div>
      {/* Right: Image Section */}
      <div className="hidden md:block w-[45%] relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent z-10" />
        <img src="flood4.jpg" alt="bg" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
