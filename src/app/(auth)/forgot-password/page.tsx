"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle"|"loading">("idle");
	const [codeRequested, setCodeRequested] = useState(false);
	const CODE_LENGTH = 6;
	const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
	const inputsRef = useRef<(HTMLInputElement|null)[]>([]);
	const [error, setError] = useState("");
	const [codeError, setCodeError] = useState("");
	const [confirmLoading, setConfirmLoading] = useState(false);
	const router = useRouter();

	// Animations removed: static rendering only

		const handleSend = async () => {
		setError("");
		setCodeError("");
		if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			setError("Masukkan email yang valid.");
			return;
		}
			setStatus("loading");
			try {
				const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
				await res.json()
				setStatus("idle");
				setCodeRequested(true);
				setTimeout(() => inputsRef.current[0]?.focus(), 50);
			} catch {
				setStatus("idle");
				setError("Gagal mengirim kode. Coba lagi.");
			}
	};

	const handleChangeDigit = (idx: number, val: string) => {
		if (!/^[0-9]?$/.test(val)) return; // hanya angka 0-9 atau kosong
		const next = [...code];
		next[idx] = val;
		setCode(next);
		setCodeError("");
		if (val && idx < CODE_LENGTH - 1) inputsRef.current[idx+1]?.focus();
	};

	const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' && !code[idx] && idx > 0) {
			inputsRef.current[idx-1]?.focus();
		}
		if (e.key === 'ArrowLeft' && idx > 0) inputsRef.current[idx-1]?.focus();
		if (e.key === 'ArrowRight' && idx < CODE_LENGTH-1) inputsRef.current[idx+1]?.focus();
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const text = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, CODE_LENGTH);
		if (!text) return;
		const arr = text.split("");
		const filled = Array(CODE_LENGTH).fill("");
		for (let i=0; i<CODE_LENGTH && i<arr.length; i++) filled[i] = arr[i];
		setCode(filled);
		if (arr.length < CODE_LENGTH) inputsRef.current[arr.length]?.focus();
		setCodeError("");
	};

		const handleConfirm = async () => {
		if (confirmLoading) return;
		const codeStr = code.join("");
		if (!/^\d{6}$/.test(codeStr)) {
			setCodeError("Kode harus 6 digit.");
			return;
		}
		setCodeError("");
			setConfirmLoading(true);
			try {
				const res = await fetch("/api/auth/forgot-password/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code: codeStr }) })
				const data = await res.json()
				if (!res.ok) {
					setCodeError(data.error || "Kode tidak valid");
					return;
				}
				const params = new URLSearchParams({ email, code: codeStr })
				if (data.token) params.set("token", data.token)
				router.push(`/reset-password?${params.toString()}`);
			} catch {
				setCodeError("Gagal verifikasi kode. Coba lagi.");
			} finally {
				setConfirmLoading(false);
			}
	};

	return (
		<div className="min-h-screen w-full flex relative bg-[#FAFAF5]">
			{/* Back Home */}
			{/* <Link href="/dashboard" className="absolute top-6 left-6 z-20 flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full bg-white hover:bg-gray-100 hover:text-black transition font-medium text-sm shadow">
				<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
				Home
			</Link> */}
			{/* Left: Form */}
			<div className="w-full md:w-[55%] bg-white flex flex-col justify-center px-8 md:px-24 py-16 min-h-screen text-black">
				<p className="text-xs text-gray-600 mb-1">RESET YOUR PASSWORD</p>
				<h2 className="text-3xl sm:text-4xl font-semibold text-black mb-2 flex items-center">
					Forgot password
					<span className="text-gray-700 ml-1 text-4xl">.</span>
				</h2>
				<p className="text-sm text-gray-600 mb-6">Masukkan email kamu untuk menerima kode verifikasi. <Link href="/login" className="text-black hover:underline">Kembali login?</Link></p>
				<div className="space-y-6 max-w-md">
					<div>
						<label className="block text-xs text-gray-600 mb-1">Email</label>
						<div className="flex gap-2">
							<div className="relative flex-1">
								<input
									type="email"
									className="w-full px-4 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
									placeholder="email@domain.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={status === "loading"}
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
									<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v.217l8 5.333 8-5.333V6.5a.5.5 0 0 0-.5-.5h-15Zm15 13a.5.5 0 0 0 .5-.5V9.217l-7.51 5.006a1 1 0 0 1-1.08 0L4 9.217V17.5a.5.5 0 0 0 .5.5h15Z"/></svg>
								</span>
							</div>
							<button
								onClick={handleSend}
								disabled={status === "loading"}
								className="px-5 py-2 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-sm transition flex items-center gap-2 disabled:opacity-60"
							>
								{status === 'loading' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
								Send
							</button>
						</div>
						{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
				</div>
				{/* Code Inputs */}
				{codeRequested && (
					<div className="space-y-4">
						<p className="text-xs text-gray-600">Masukkan kode verifikasi 6 digit yang kami kirim ke <span className="font-medium">{email}</span>.</p>
						<div className="flex gap-2">
							{code.map((d, i) => (
								<input
									key={i}
									ref={(el) => { inputsRef.current[i] = el; }}
									inputMode="numeric"
									pattern="[0-9]*"
									maxLength={1}
									value={d}
									onChange={(e) => handleChangeDigit(i, e.target.value)}
									onKeyDown={(e) => handleKeyDown(i, e)}
									onPaste={i===0 ? handlePaste : undefined}
									className="w-12 h-12 text-center text-lg font-semibold rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
									placeholder="_"
									/>
							))}
						</div>
						{codeError && <p className="text-red-500 text-xs">{codeError}</p>}
						<div className="flex items-center gap-4 text-xs text-gray-500">
							<button type="button" onClick={() => { setCode(Array(CODE_LENGTH).fill("")); inputsRef.current[0]?.focus(); }} className="underline hover:text-gray-700">Reset kode</button>
							<button type="button" onClick={() => { handleSend(); }} className="underline hover:text-gray-700">Kirim ulang</button>
						</div>
						<div>
							<button
								onClick={handleConfirm}
								disabled={confirmLoading || code.some(d => !d)}
								className="w-full py-2 rounded-full bg-black hover:bg-gray-800 disabled:opacity-60 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
							>
								{confirmLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
								Konfirmasi kode
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
			{/* Right: Image */}
			<div className="hidden md:block w-[45%] relative min-h-screen">
				<div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent z-10" />
				<img src="flood4.jpg" alt="bg" className="w-full h-full object-cover" />
			</div>
		</div>
	);
}

