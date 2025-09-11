"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ResetSuccessPage() {
	const router = useRouter();
	const [counter, setCounter] = useState(6);

	useEffect(() => {
		if (counter <= 0) {
			router.push("/login");
			return;
		}
		const t = setTimeout(() => setCounter(c => c - 1), 1000);
		return () => clearTimeout(t);
	}, [counter, router]);

		const fade = {
			hidden: { opacity: 0, y: 40 },
			visible: { opacity: 1, y: 0, transition: { duration: .7, ease: 'easeOut' as const } }
		};

	return (
		<div className="min-h-screen w-full flex relative bg-[#FAFAF5]">
			<Link href="/dashboard" className="absolute top-6 left-6 z-20 flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full bg-white hover:bg-gray-100 hover:text-black transition font-medium text-sm shadow">
				<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
				Home
			</Link>
			<div className="w-full md:w-[55%] bg-white flex flex-col justify-center px-8 md:px-24 py-16 min-h-screen text-black">
				<motion.div initial="hidden" animate="visible" variants={fade} className="max-w-md">
					<p className="text-xs text-gray-600 mb-2 tracking-wide">PASSWORD RESET</p>
					<h1 className="text-3xl sm:text-4xl font-extrabold mb-4 flex items-center">Password updated<span className="text-gray-700 ml-1 text-4xl">.</span></h1>
					<div className="mb-6 text-sm text-gray-600 leading-relaxed">
						Password kamu berhasil diperbarui. Kamu bisa langsung kembali login dan melanjutkan aktivitas.
					</div>
					<div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-6">
						<div className="flex items-start gap-3">
							<div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13.2 9.2 17.5 19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
							</div>
							<div className="flex-1 text-sm text-green-800">
								<p className="font-semibold mb-0.5">Berhasil disimpan</p>
								<p className="text-green-700 text-xs">Mengalihkan otomatis ke halaman login dalam {counter} detik...</p>
							</div>
						</div>
					</div>
					<div>
						<Link href="/login" className="w-full block py-2 rounded-full bg-black hover:bg-gray-800 text-white text-sm font-semibold text-center transition">Pergi ke Login sekarang</Link>
					</div>
					<div className="mt-10 text-[11px] text-gray-400 tracking-wide">
						Jika ini bukan kamu, segera hubungi support.
					</div>
				</motion.div>
			</div>
			<div className="hidden md:block w-[45%] relative min-h-screen">
				<div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent z-10" />
				<img src="flood4.jpg" alt="bg" className="w-full h-full object-cover" />
			</div>
		</div>
	);
}

