'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type Step = { id: number; title: string; description: string; image: string };

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
  steps: Step[];
};

export default function ProcessSection({ sectionRef, steps }: Props) {
  const [processSectionRef, processSectionInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [processCardsContainerRef, processCardsContainerInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const [dragConstraintsWidth, setDragConstraintsWidth] = useState<number>(0);

  useEffect(() => {
    const calculateConstraints = () => {
      if (constraintsRef.current) {
        setDragConstraintsWidth(constraintsRef.current.scrollWidth - constraintsRef.current.offsetWidth);
      }
    };
    calculateConstraints();
    window.addEventListener('resize', calculateConstraints);
    return () => window.removeEventListener('resize', calculateConstraints);
  }, [steps.length]);

  const fadeInFromBottom = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } } };
  const staggerContainer = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <>
      <section ref={sectionRef} className="bg-[#FAFAF5] text-black py-16 px-4 lg:px-12 flex flex-col items-center justify-center text-center">
        <motion.div
          ref={processSectionRef}
          initial="hidden"
          animate={processSectionInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="max-w-4xl mx-auto w-full"
        >
          <motion.p variants={fadeInFromBottom} className="text-sm uppercase tracking-widest text-gray-500 mb-4">• HOW WE WORK</motion.p>
          <motion.h2 variants={fadeInFromBottom} className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-8">Process</motion.h2>
          <motion.p variants={fadeInFromBottom} className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed text-gray-800">
            To ensure seamless and effortless flood monitoring, we have established a simple and efficient process that will help us get started on the Judul Banjay project as quickly as possible.
          </motion.p>
        </motion.div>
      </section>

      <section className="bg-[#FAFAF5] text-black py-16">
        <motion.div
          ref={processCardsContainerRef}
          initial="hidden"
          animate={processCardsContainerInView ? 'visible' : 'hidden'}
          className="relative w-full overflow-hidden cursor-grab px-4 lg:px-12"
        >
          <motion.div
            ref={constraintsRef}
            className="flex gap-8 py-4"
            drag="x"
            {...(typeof dragConstraintsWidth === 'number' && { dragConstraints: { left: -dragConstraintsWidth, right: 0 } })}
            whileTap={{ cursor: 'grabbing' }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial="hidden"
                animate={processCardsContainerInView ? 'visible' : 'hidden'}
                variants={fadeInFromBottom}
                transition={{ delay: index * 0.15 }}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              >
                <img src={step.image} alt={step.title} className="w-full h-48 object-cover" />
                <div className="p-8 text-left">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 text-gray-600 text-lg font-bold mb-4">{step.id}</div>
                  <h3 className="text-2xl font-semibold text-black mb-2">{step.title}</h3>
                  <p className="text-base text-gray-700">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
