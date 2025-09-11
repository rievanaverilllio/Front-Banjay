import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void;
  homeRef: React.RefObject<HTMLElement | null>;
  projectsRef: React.RefObject<HTMLElement | null>;
  teamRef: React.RefObject<HTMLElement | null>;
  servicesRef: React.RefObject<HTMLElement | null>;
  processRef: React.RefObject<HTMLElement | null>;
  pricingRef: React.RefObject<HTMLElement | null>;
  contactRef: React.RefObject<HTMLElement | null>;
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection, homeRef, projectsRef, teamRef, servicesRef, processRef, pricingRef, contactRef }) => {
  const router = useRouter();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-20 px-6 py-4 flex justify-between items-center bg-white text-black shadow-md"
    >
      <Link href="/dashboard" className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md cursor-pointer">
        <img src="/favicon.png" alt="Logo" className="w-10 h-10 mr-2 ml-2 transition-transform group-hover:scale-105" />
        <span className="text-lg font-bold text-black tracking-wide group-hover:text-gray-800">BANJAY</span>
      </Link>
      <div className="hidden md:flex space-x-6 text-sm font-medium text-black">
        <a href="#home" onClick={() => router.push('#')} className="hover:text-gray-700 transition-colors">HOME</a>
        <a href="#projects" onClick={() => scrollToSection(projectsRef)} className="hover:text-gray-700 transition-colors">PROJECT</a>
        <a href="#team" onClick={() => scrollToSection(teamRef)} className="hover:text-gray-700 transition-colors">TEAM</a>
        <a href="#services" onClick={() => scrollToSection(servicesRef)} className="hover:text-gray-700 transition-colors">SERVICE</a>
        <a href="#process" onClick={() => scrollToSection(processRef)} className="hover:text-gray-700 transition-colors">PROCESS</a>
        <a href="#pricing" onClick={() => scrollToSection(pricingRef)} className="hover:text-gray-700 transition-colors">PRICING</a>
      </div>
      <button onClick={() => router.push('/contact')} className="flex items-center px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
        CONTACT
        <ArrowRight className="ml-1 w-3 h-3" />
      </button>
    </motion.nav>
  );
};

export default Navbar;
