'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
};

export default function AchievementsSection({ sectionRef }: Props) {
  const [achievementRef, achievementInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const fadeInFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
  };
  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <section ref={sectionRef} className="bg-[#FAFAF5] text-black py-6 px-2 lg:px-12 min-h-screen flex items-center">
      <motion.div
        ref={achievementRef}
        initial="hidden"
        animate={achievementInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="max-w-7xl mx-auto w-full"
      >
        <motion.p variants={fadeInFromBottom} className="text-sm uppercase tracking-widest text-gray-500 mb-4">• PROJECT HIGHLIGHTS</motion.p>
        <motion.h2 variants={fadeInFromBottom} className="text-2xl sm:text-3xl lg:text-4xl font-light leading-snug max-w-4xl mb-16">
          As a data-driven team, we let the numbers <br /> speak for us
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div variants={fadeInFromBottom}>
            <p className="text-5xl font-semibold">95%+</p>
            <hr className="my-4 border-gray-300" />
            <p className="font-semibold mb-1">Prediction Accuracy</p>
            <p className="text-gray-600">Our AI model achieves high accuracy in predicting potential floods.</p>
          </motion.div>
          <motion.div variants={fadeInFromBottom}>
            <p className="text-5xl font-semibold">5+</p>
            <hr className="my-4 border-gray-300" />
            <p className="font-semibold mb-1">Integrated Data Sources</p>
            <p className="text-gray-600">Combining satellite imagery, historical data, journals, and environmental sensors.</p>
          </motion.div>
          <motion.div variants={fadeInFromBottom}>
            <p className="text-5xl font-semibold">10x</p>
            <hr className="my-4 border-gray-300" />
            <p className="font-semibold mb-1">Improved Early Response</p>
            <p className="text-gray-600">Enabling faster early warnings for disaster mitigation.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
