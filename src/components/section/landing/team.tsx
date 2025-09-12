'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import React from 'react';

type Member = { id: number; src: string };

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
  teamMembers: Member[];
};

export default function TeamSection({ sectionRef, teamMembers }: Props) {
  const [teamSectionRef, teamSectionInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const duplicatedTeamMembers = [...teamMembers, ...teamMembers, ...teamMembers];
  const scrollVariants = {
    animate: {
      x: [0, -(teamMembers.length / duplicatedTeamMembers.length) * 100 + '%'],
      transition: { repeat: Infinity, repeatType: 'loop' as const, duration: 30, ease: 'linear' as const },
    },
  };
  const fadeInFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
  };
  const staggerContainer = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <section ref={sectionRef} className="bg-[#FAFAF5] text-black py-16 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        ref={teamSectionRef}
        initial="hidden"
        animate={teamSectionInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <motion.p variants={fadeInFromBottom} className="text-sm uppercase tracking-widest text-gray-500 mb-4">• OUR TEAM</motion.p>
        <motion.p variants={fadeInFromBottom} className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed text-gray-800">
          We are a multidisciplinary team consisting of AI experts, data scientists, GIS specialists, and hydrologists, dedicated to developing innovative solutions in flood monitoring and mitigation.
        </motion.p>
      </motion.div>
      <div className="relative w-full overflow-hidden h-[400px] md:h-[500px]">
        <motion.div className="flex h-full gap-x-2" variants={scrollVariants} animate="animate" style={{ width: `${(duplicatedTeamMembers.length / 6) * 100}%` }}>
          {duplicatedTeamMembers.map((member, index) => (
            <div key={`${member.id}-${index}`} className="relative flex-shrink-0 w-1/6 h-full">
              <img src={member.src} alt={`Team Member ${member.id}`} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-white/10"></div>
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-[2%] bg-gradient-to-r from-[#FAFAF5] to-transparent z-20"></div>
        <div className="absolute inset-y-0 right-0 w-[2%] bg-gradient-to-l from-[#FAFAF5] to-transparent z-20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-30">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 text-white">Our Team</h2>
          <button className="flex items-center px-4 py-2 border border-white text-white rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors">
            MEET US
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
