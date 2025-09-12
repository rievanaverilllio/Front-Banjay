'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';

type ServiceItem = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
};

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
  items: ServiceItem[];
};

export default function ServicesSection({ sectionRef, items }: Props) {
  const [servicesSectionRef, servicesSectionInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const fadeInFromBottom = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } } };
  const staggerContainer = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <section ref={sectionRef} className="bg-[#FAFAF5] text-black py-16 px-4 lg:px-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        ref={servicesSectionRef}
        initial="hidden"
        animate={servicesSectionInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <motion.p variants={fadeInFromBottom} className="text-sm uppercase tracking-widest text-gray-500 mb-4">• WHAT WE OFFER</motion.p>
        <motion.h2 variants={fadeInFromBottom} className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-8">
          Services
        </motion.h2>
        <motion.p variants={fadeInFromBottom} className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed text-gray-800">
          Our team brings together developers, data scientists, and hydrologists to create seamless digital experiences in flood monitoring. Every product is built with precision, staying true to its original vision.
        </motion.p>
      </motion.div>

      <div className="relative w-full">
        <div className="w-full flex flex-col gap-8">
          {items.map((item, index) => {
            const [serviceItemRef, serviceItemInView] = useInView({ triggerOnce: true, threshold: 0.2 });
            return (
              <motion.div
                ref={serviceItemRef}
                key={item.id}
                initial="hidden"
                animate={serviceItemInView ? 'visible' : 'hidden'}
                variants={fadeInFromBottom}
                transition={{ delay: index * 0.1 }}
                className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#FAFAF5] p-4"
              >
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold text-gray-400 mr-4">{item.id}</span>
                    <p className="text-lg font-semibold text-black">• {item.title}</p>
                  </div>
                  <h3 className="text-4xl font-semibold text-black mb-4">{item.title}</h3>
                  <p className="text-gray-700 mb-6 max-w-md">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <img src={item.image} alt={item.title} className="rounded-lg shadow-lg w-full h-auto object-cover" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
