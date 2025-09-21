"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const email = searchParams.get("email");
	const code = searchParams.get("code");

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState("");
	const [status, setStatus] = useState<"idle"|"loading">("idle");
	const [strength, setStrength] = useState<0|1|2|3|4>(0);

	useEffect(() => {
		let s = 0;
		if (password.length >= 8) s++;
		if (/[A-Z]/.test(password)) s++;
		if (/[0-9]/.test(password)) s++;
		if (/[^A-Za-z0-9]/.test(password)) s++;
		if (s > 4) s = 4;
		setStrength(s as 0|1|2|3|4);
	}, [password]);

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			setError("");
			if (!password || password.length < 8) {
				setError("Password minimal 8 karakter.");
				return;
			}
			if (password !== confirm) {
				setError("Konfirmasi password tidak sama.");
				return;
			}
			if (!token && !(email && code)) {
				setError("Token atau (email + kode) tidak ditemukan.");
				return;
			}
			setStatus("loading");
			try {
				const payload: any = { password };
				if (token) payload.token = token;
				else { payload.email = email; payload.code = code; }
				const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
				const data = await res.json()
				if (!res.ok) throw new Error(data.error || "Gagal reset password")
				router.push("/reset-success");
			} catch (err: any) {
				setError(err.message || "Gagal reset password");
			} finally {
				setStatus("idle");
			}
		};

	const strengthLabels = ["Sangat lemah", "Lemah", "Cukup", "Baik", "Kuat"];
	const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-emerald-500"];

	return (
		<div className="min-h-screen w-full flex relative bg-[#FAFAF5]">
			<div className="w-full md:w-[55%] bg-white flex flex-col justify-center px-8 md:px-24 py-16 min-h-screen text-black">
				<p className="text-xs text-gray-600 mb-1">SET NEW PASSWORD</p>
				<h2 className="text-3xl sm:text-4xl font-semibold text-black mb-2 flex items-center">
					Reset password
					<span className="text-gray-700 ml-1 text-4xl">.</span>
				</h2>
				<p className="text-sm text-gray-600 mb-6">Buat password baru untuk akun kamu. <Link href="/login" className="text-black hover:underline">Kembali login?</Link></p>
				{(token || (email && code)) && (
					<div className="text-[11px] tracking-wide text-gray-500 mb-4 select-all">
						{token ? (
							<>Token: {token.slice(0,32)}{token.length>32 && '...'}</>
						) : (
							<>Email: {email} • Code: {code}</>
						)}
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-5 max-w-md">
					<div>
						<label className="block text-xs text-gray-600 mb-1">Password baru</label>
						<div className="relative">
							<input
								type="password"
								className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={status === "loading"}
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
								<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6V9a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Zm-8-2a4 4 0 1 1 8 0v2H8V9Zm10 9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5Z"/></svg>
							</span>
						</div>
						<div className="mt-2 flex items-center gap-2">
							<div className="flex-1 flex gap-1">
								{[0,1,2,3].map(i => (
									<span key={i} className={`h-1 w-full rounded ${strength > i ? strengthColors[strength] : 'bg-gray-200'}`}></span>
								))}
							</div>
							<span className="text-[10px] uppercase tracking-wide text-gray-500">{strengthLabels[strength]}</span>
						</div>
					</div>

					<div>
						<label className="block text-xs text-gray-600 mb-1">Konfirmasi password</label>
						<div className="relative">
							<input
								type="password"
								className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
								placeholder="Ulangi password"
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								disabled={status === "loading"}
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
								<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6V9a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Zm-8-2a4 4 0 1 1 8 0v2H8V9Zm10 9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5Z"/></svg>
							</span>
						</div>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<button
						type="submit"
						disabled={status === "loading"}
						className="w-full py-2 rounded-full bg-black hover:bg-gray-800 disabled:opacity-60 text-white font-semibold text-base transition flex items-center justify-center gap-2"
					>
						{status === "loading" && (<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />)}
						Simpan password baru
					</button>
				</form>
			</div>
			<div className="hidden md:block w-[45%] relative min-h-screen">
				<div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent z-10" />
				<img src="flood4.jpg" alt="bg" className="w-full h-full object-cover" />
			</div>
		</div>
	);
}

