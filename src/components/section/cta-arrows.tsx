'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  arrowCount?: number;
};

export default function CtaArrowsSection({ arrowCount = 5 }: Props) {
  const router = useRouter();
  return (
    <section className="bg-[#FAFAF5] flex justify-center items-center overflow-hidden min-h-[30vh]">
      <div className="flex items-center space-x-8 lg:space-x-12">
        {[...Array(arrowCount)].map((_, i) => (
          <motion.div
            key={`left-${i}`}
            animate={{ opacity: [0.2, 0.6, 1, 0.6, 0.2], x: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: i * 0.15 }}
            className={`text-8xl font-bold ${i % 2 === 0 ? 'text-black' : 'text-gray-400'}`}
          >
            <ChevronRight size={96} />
          </motion.div>
        ))}

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0', borderColor: '#000000' }}
          transition={{ duration: 0.2 }}
          onClick={() => router.push('/login')}
          className="flex items-center justify-between px-6 py-3 bg-white text-black rounded-full text-base font-medium border border-gray-300 shadow-sm transition-all duration-200"
          style={{ width: '250px', height: '56px' }}
        >
          TRY OUR DEMO
          <motion.div className="ml-4 bg-black rounded-full p-2 flex items-center justify-center" whileHover={{ x: 5, y: -5, rotate: 15, backgroundColor: '#333333' }} transition={{ duration: 0.2 }}>
            <ArrowUpRight className="w-5 h-5 text-white" />
          </motion.div>
        </motion.button>

        {[...Array(arrowCount)].map((_, i) => (
          <motion.div
            key={`right-${i}`}
            animate={{ opacity: [0.2, 0.6, 1, 0.6, 0.2], x: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: i * 0.15 }}
            className={`text-8xl font-bold ${i % 2 === 0 ? 'text-black' : 'text-gray-400'}`}
          >
            <ChevronLeft size={96} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
