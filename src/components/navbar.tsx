import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface NavbarProps {
  scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void;
  homeRef: React.RefObject<HTMLElement | null>;
  projectsRef: React.RefObject<HTMLElement | null>;
  aboutRef: React.RefObject<HTMLElement | null>;
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection, homeRef, projectsRef, aboutRef }) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-20 px-6 py-4 flex justify-between items-center bg-white text-black shadow-md"
    >
      <div className="flex items-center">
        <span className="text-lg font-bold text-black tracking-wide">BANJAY®</span>
      </div>
      <div className="hidden md:flex space-x-6 text-sm font-medium text-black">
        <a href="#home" onClick={() => scrollToSection(homeRef)} className="hover:text-gray-700 transition-colors">HOME</a>
        <a href="#projects" onClick={() => scrollToSection(projectsRef)} className="hover:text-gray-700 transition-colors">PROJECTS</a>
        <a href="#about" onClick={() => scrollToSection(aboutRef)} className="hover:text-gray-700 transition-colors">ABOUT</a>
        <a href="#blog" className="hover:text-gray-700 transition-colors">BLOG</a>
      </div>
      <button className="flex items-center px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
        CONTACT
        <ArrowRight className="ml-1 w-3 h-3" />
      </button>
    </motion.nav>
  );
};

export default Navbar;
