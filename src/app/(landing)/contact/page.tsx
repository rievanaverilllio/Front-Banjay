"use client";

import Navbar from '@/components/nav-landing';
import Footer from '@/components/footer-landing';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLenisSmoothScroll } from '@/lib/useLenisSmoothScroll';
import { useInView } from 'react-intersection-observer';

export default function ContactPage() {
  // Dummy refs for Navbar (not used for scrolling on this page)
  const dummyRef = useRef<HTMLElement | null>(null);
  const dummyDivRef = useRef<HTMLDivElement>(null!); // For footerRef, non-null assertion

  useLenisSmoothScroll();

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
        animate={mainContentInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="flex-1 max-w-7xl mx-auto w-full px-4 pt-32 pb-16"
      >
        <motion.h1 variants={fadeInFromBottom} className="text-5xl font-semibold mb-2">Contact</motion.h1>
        <motion.hr variants={fadeInFromBottom} className="border-gray-300 mb-8" />
        <motion.div variants={staggerContainer} className="flex flex-col lg:flex-row gap-12">
          {/* Left: Intro */}
          <motion.div variants={fadeInFromBottom} className="flex-1">
            <motion.p variants={fadeInFromBottom} className="text-2xl font-bold mb-2"><span className="font-semibold">Have an idea?</span> <span className="font-normal text-lg align-middle">We're always looking for passionate clients and talented professionals to join us in creating impactful work. Whether you have a bold vision you want to bring to life or expertise to contribute, let's collaborate and make something great together.</span></motion.p>
            <motion.div variants={fadeInFromBottom} className="mt-12">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">• Get in touch</p>
              <form className="bg-white rounded-lg shadow p-6 w-full max-w-xl">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name*</label>
                  <input type="text" className="w-full border-b border-gray-200 bg-transparent py-2 px-1 focus:outline-none" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email*</label>
                  <input type="email" className="w-full border-b border-gray-200 bg-transparent py-2 px-1 focus:outline-none" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" className="w-full border-b border-gray-200 bg-transparent py-2 px-1 focus:outline-none" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea className="w-full border-b border-gray-200 bg-transparent py-2 px-1 focus:outline-none" rows={3}></textarea>
                </div>
                <button type="submit" className="w-full py-2 rounded border border-gray-300 text-gray-400 font-semibold text-sm cursor-not-allowed bg-gray-50" disabled>SUBMIT</button>
              </form>
            </motion.div>
          </motion.div>
          {/* Right: FAQ */}
          <motion.div variants={fadeInFromBottom} className="flex-1 flex flex-col justify-start mt-8 lg:mt-0">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">• FAQ</p>
            <div className="space-y-2">
              <div className="bg-white rounded shadow-sm p-4 text-gray-400 cursor-pointer select-none">What services do you offer?</div>
              <div className="bg-white rounded shadow-sm p-4 text-gray-400 cursor-pointer select-none">How do you determine project pricing?</div>
              <div className="bg-white rounded shadow-sm p-4 text-gray-400 cursor-pointer select-none">How long does a typical project take?</div>
              <div className="bg-white rounded shadow-sm p-4 font-semibold text-black cursor-pointer select-none">Can you handle ongoing marketing and design support?</div>
            </div>
          </motion.div>
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