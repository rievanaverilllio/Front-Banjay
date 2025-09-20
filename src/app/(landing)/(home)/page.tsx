'use client';

import Footer from '@/components/section/landing/footer-landing';
import Navbar from '@/components/section/landing/nav-landing';
import HeroSection from '@/components/section/landing/hero';
import AchievementsSection from '@/components/section/landing/achievements';
import CtaArrowsSection from '@/components/section/landing/cta-arrows';
import TeamSection from '@/components/section/landing/team';
import ServicesSection from '@/components/section/landing/services';
import ProcessSection from '@/components/section/landing/process';
import PricingSection from '@/components/section/landing/pricing';

import { useLenisSmoothScroll } from '@/lib/useLenisSmoothScroll';
import { useInView } from 'react-intersection-observer';
import { useRef } from 'react';
import data from './data.json';

export default function LandingPage() {
  useLenisSmoothScroll();
  const arrowCount = data.arrowCount ?? 5;

  const teamMembers = data.teamMembers ?? [];
  const serviceItems = data.serviceItems ?? [];
  const processSteps = data.processSteps ?? [];

  // Pricing plans are plain data in JSON; attach React SVG icons here
  const pricingPlans = (data.pricingPlans ?? []).map((plan, idx) => {
    const icon = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
      </svg>
    );
    return { ...plan, icon };
  });

  // Refs for sections to enable smooth scrolling to them
  const homeRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const processRef = useRef<HTMLElement | null>(null);
  const pricingRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null); // Added contactRef for footer link

  // Function to handle smooth scroll to section
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // InView hooks for various sections
  // Only footer needs inView state here; sections handle their own inView internally
  const [footerRef, footerInView] = useInView({ triggerOnce: true, threshold: 0.1 }); // New for footer

  // Animation variants for common fade-in-up effect
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
    <div className="bg-[#0A0A0A] text-white font-sans flex flex-col overflow-x-hidden overflow-y-auto">
      <Navbar
        scrollToSection={scrollToSection}
        homeRef={homeRef}
        projectsRef={projectsRef}
        teamRef={aboutRef}
        servicesRef={servicesRef}
        processRef={processRef}
        pricingRef={pricingRef}
        contactRef={contactRef}
      />

      <HeroSection sectionRef={homeRef} />

      <AchievementsSection sectionRef={projectsRef} />

      <CtaArrowsSection arrowCount={arrowCount} />

      <TeamSection sectionRef={aboutRef} teamMembers={teamMembers} />

      <ServicesSection sectionRef={servicesRef} items={serviceItems} />

      <CtaArrowsSection arrowCount={arrowCount} />

      <ProcessSection sectionRef={processRef} steps={processSteps} />

      <PricingSection sectionRef={pricingRef} plans={pricingPlans} />

      <Footer
        contactRef={contactRef}
        footerRef={footerRef}
        footerInView={footerInView}
        staggerContainer={staggerContainer}
        fadeInFromBottom={fadeInFromBottom}
        scrollToSection={scrollToSection}
        homeRef={homeRef}
        projectsRef={projectsRef}
        aboutRef={aboutRef}
        servicesRef={servicesRef}
        pricingRef={pricingRef}
      />
    </div>
  );
}
