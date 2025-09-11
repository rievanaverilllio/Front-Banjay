'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
};

export default function HeroSection({ sectionRef }: Props) {
  const router = useRouter();
  const [mainRef, mainInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const fadeInFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <main ref={sectionRef} className="bg-[url('/flood1.jpg')] bg-cover bg-center bg-no-repeat flex-grow flex flex-col justify-end pt-24 pb-8 px-8 lg:px-20 min-h-screen">
      <motion.div
        ref={mainRef}
        initial="hidden"
        animate={mainInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="max-w-7xl mx-auto w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div className="text-left mb-4 lg:mb-0">
            <motion.h1 variants={fadeInFromBottom} className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              AI for Early Flood Monitoring: <br /> Banjay
            </motion.h1>
          </div>
          <div className="space-y-8 lg:text-right">
            <motion.p variants={fadeInFromBottom} className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-lg lg:ml-auto">
              This project aims to develop AI with LLM for early flood monitoring based on Himawari BMKG satellite imagery, various verified journals, historical flood data, and surrounding environmental data collected during sampling.
            </motion.p>
            <motion.div variants={fadeInFromBottom} className="flex flex-col sm:flex-row lg:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button onClick={() => router.push('/login')} className="px-6 py-3 bg-black border border-black text-white rounded-full text-base font-medium hover:bg-gray-800 transition-colors">
                TRY OUR DEMO
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
