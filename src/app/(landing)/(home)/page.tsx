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

export default function LandingPage() {
  useLenisSmoothScroll();
  const arrowCount = 5;

  // Data for team members (kept generic, focusing on team expertise)
  const teamMembers = [
    { id: 1, src: "afin1.jpg" },
    { id: 2, src: "rievan1.png" },
    { id: 3, src: "afin1.jpg" },
    { id: 4, src: "rievan1.png" },
  ];

  // (moved loop/variants into TeamSection)

  // Data for new service items (adapted to the flood project)
  const serviceItems = [
    {
      id: 1,
      title: "AI & LLM Model Development",
      description: "Building artificial intelligence and Large Language Models for comprehensive flood data analysis and accurate predictions.",
      tags: ["Machine Learning", "Deep Learning", "Natural Language Processing", "Flood Prediction"],
      image: "llm_development.jpeg"
    },
    {
      id: 2,
      title: "Himawari Satellite Image Analysis",
      description: "Processing and analyzing Himawari BMKG satellite imagery to detect changes in water levels and cloud conditions relevant to floods.",
      tags: ["Satellite Imagery", "BMKG", "GIS", "Change Detection"],
      image: "satelit.jpeg"
    },
    {
      id: 3,
      title: "Multi-Source Data Integration",
      description: "Combining historical flood data, verified journals, and surrounding environmental data for a holistic understanding.",
      tags: ["Historical Data", "Scientific Journals", "Environmental Data", "Big Data"],
      image: "Data_Integration.jpeg"
    },
    {
      id: 4,
      title: "Early Flood Warning System",
      description: "Designing and implementing an efficient early warning system for risk mitigation and rapid response to potential floods.",
      tags: ["Early Warning", "Disaster Mitigation", "Rapid Response", "Information System"],
      image: "flood.jpeg"
    },
  ];

  // Data for process steps, now with image properties (adapted to the AI project)
  const processSteps = [
    {
      id: 1,
      title: "Data Collection & Briefing",
      description: "Understanding project needs, collecting Himawari satellite imagery, historical data, journals, and environmental data.",
      image: "data_colection.jpeg"
    },
    {
      id: 2,
      title: "System Design & Architecture",
      description: "Designing AI and LLM architecture, and planning data integration from various sources.",
      image: "design_system.jpeg"
    },
    {
      id: 3,
      title: "Model Development & Training",
      description: "Building AI and LLM models, training them with relevant data, and performing initial validation.",
      image: "model_development.jpeg"
    },
    {
      id: 4,
      title: "Integration & Testing",
      description: "Integrating the models into the monitoring system and conducting thorough testing for accuracy and performance.",
      image: "testing.jpeg"
    },
    {
      id: 5,
      title: "Implementation & Launch",
      description: "Deploying the early flood warning system and launching it for operational use.",
      image: "implementation.jpeg"
    },
    {
      id: 6,
      title: "Continuous Monitoring & Optimization",
      description: "Continuously monitoring system performance, gathering feedback, and performing optimizations for improvement.",
      image: "optimization.jpeg"
    },
  ];

  // (drag logic moved into ProcessSection)


  const pricingPlans = [
    {
      name: "Basic Package",
      price: "$5,000",
      period: "/project",
      description: "For initial feasibility studies and prototype development of the AI flood monitoring model.",
      features: [
        "Needs Analysis",
        "Initial Data Collection",
        "Basic Architecture Design",
        "AI Model Prototype",
        "Initial Report",
      ],
      isDark: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: "Development Package",
      price: "$15,000",
      period: "/project",
      description: "For core AI and LLM model development with comprehensive data integration.",
      features: [
        "All from Basic Package",
        "Advanced AI Model Development",
        "Himawari Satellite Image Integration",
        "Historical & Environmental Data Processing",
        "Model Training & Validation",
        "Technical Support",
      ],
      isDark: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: "Full Package",
      price: "$25,000",
      period: "/project",
      description: "A complete solution for early flood monitoring with system implementation and ongoing support.",
      features: [
        "All from Development Package",
        "Early Warning System Implementation",
        "Integration with Existing Infrastructure",
        "User Training",
        "Continuous Monitoring & Optimization",
        "Priority Support (24/7)",
      ],
      isDark: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
        </svg>
      )
    },
  ];

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
