"use client";

import Navbar from '@/components/section/landing/nav-landing';
import Footer from '@/components/section/landing/footer-landing';
import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLenisSmoothScroll } from '@/lib/useLenisSmoothScroll';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { z } from 'zod';

type FormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\+?[0-9\s-]{8,15}$/.test(v),
      'Nomor HP tidak valid'
    ),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

export default function ContactPage() {
  // Dummy refs for Navbar/Footer (not used for scrolling on this page)
  const dummyRef = useRef<HTMLElement | null>(null);
  const dummyDivRef = useRef<HTMLDivElement>(null!);

  useLenisSmoothScroll();

  const [mainContentRef, mainContentInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fadeInFromBottom = useMemo(
    () => ({
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
    }),
    []
  );

  const staggerContainer = useMemo(
    () => ({
      hidden: { opacity: 1 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    }),
    []
  );

  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (data: FormData) => {
    const res = schema.safeParse({ ...data, phone: data.phone?.trim() || undefined });
    if (!res.success) {
      const fieldErrors = res.error.flatten().fieldErrors;
      const mapped: Partial<Record<keyof FormData, string>> = {};
      (Object.keys(fieldErrors) as (keyof FormData)[]).forEach((k) => {
        mapped[k] = fieldErrors[k]?.[0] || '';
      });
      return mapped;
    }
    return {} as Partial<Record<keyof FormData, string>>;
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      const next = { ...errors, [name]: undefined };
      setErrors(next);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setSubmitting(true);
    // Simulate submit
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="bg-[#FAFAF5] min-h-screen flex flex-col text-black">
      <Navbar
        scrollToSection={() => {}}
        homeRef={dummyRef}
        projectsRef={dummyRef}
        teamRef={dummyRef}
        servicesRef={dummyRef}
        processRef={dummyRef}
        pricingRef={dummyRef}
        contactRef={dummyRef}
      />
      <motion.main
        ref={mainContentRef}
        initial="hidden"
        animate={mainContentInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="flex-1 max-w-7xl mx-auto w-full px-4 pt-28 pb-16"
      >
        <motion.div variants={fadeInFromBottom} className="mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-500">Hubungi Kami</p>
          <h1 className="text-4xl md:text-5xl font-semibold mt-2">Mari diskusikan kebutuhan Anda</h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Ceritakan tantangan Anda. Kami akan merespons dalam 1–2 hari kerja
            dengan saran awal dan langkah lanjutan.
          </p>
        </motion.div>

  <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Info */}
          <motion.section variants={fadeInFromBottom} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informasi Kontak</CardTitle>
                <CardDescription>Beberapa cara sederhana untuk terhubung.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href="mailto:hello@banjay.ai" className="text-base font-medium hover:underline">hello@banjay.ai</a>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Phone className="size-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    <a href="tel:+621234567890" className="text-base font-medium hover:underline">+62 123 4567 890</a>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="text-base font-medium">Jakarta, Indonesia</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Jam Kerja</p>
                    <p className="text-base font-medium">Senin–Jumat, 09.00–17.00 WIB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Pertanyaan Umum</CardTitle>
                <CardDescription>Jawaban singkat untuk memulai.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border rounded-lg p-4 bg-white/70">
                  <p className="font-medium">Apa layanan yang tersedia?</p>
                  <p className="text-sm text-gray-600 mt-1">Konsultasi data, pengembangan model AI, integrasi sistem, dan implementasi dashboard.</p>
                </div>
                <div className="border rounded-lg p-4 bg-white/70">
                  <p className="font-medium">Berapa lama prosesnya?</p>
                  <p className="text-sm text-gray-600 mt-1">Tergantung cakupan. Proyek ringkas 2–4 minggu, proyek end-to-end 1–3 bulan.</p>
                </div>
                <div className="border rounded-lg p-4 bg-white/70">
                  <p className="font-medium">Bagaimana skema biayanya?</p>
                  <p className="text-sm text-gray-600 mt-1">Fixed-price untuk paket jelas, atau time & materials untuk eksplorasi.</p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Right: Form */}
          <motion.section variants={fadeInFromBottom}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Kirim Pesan</CardTitle>
                <CardDescription>Isi formulir di bawah ini. Tanda (*) wajib diisi.</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted && (
                  <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
                    Terima kasih! Pesan Anda sudah terkirim.
                  </div>
                )}
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama*</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Nama lengkap"
                        value={form.name}
                        onChange={onChange}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="nama@domain.com"
                        value={form.email}
                        onChange={onChange}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">No. HP (opsional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Contoh: +62 812 3456 7890"
                      value={form.phone}
                      onChange={onChange}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan*</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Ceritakan kebutuhan atau pertanyaan Anda..."
                      value={form.message}
                      onChange={onChange}
                      aria-invalid={!!errors.message}
                      className="border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 w-full min-w-0 rounded-md border px-3 py-2 text-sm outline-none"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <div className="pt-1">
                    <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
                      {submitting ? 'Mengirim...' : 'Kirim'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </motion.main>
      <Footer
        contactRef={dummyRef}
        footerRef={dummyDivRef}
        footerInView={true}
        staggerContainer={{}}
        fadeInFromBottom={{}}
        scrollToSection={() => {}}
        homeRef={dummyRef}
        projectsRef={dummyRef}
        aboutRef={dummyRef}
        servicesRef={dummyRef}
        pricingRef={dummyRef}
      />
    </div>
  );
}