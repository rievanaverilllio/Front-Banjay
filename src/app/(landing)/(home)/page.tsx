'use client';

import Footer from '@/components/footer-landing';
import Navbar from '@/components/nav-landing';

import { motion } from 'framer-motion';
import { useLenisSmoothScroll } from '@/lib/useLenisSmoothScroll';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, ArrowUpRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import pageData from './data.json';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  useLenisSmoothScroll();
  const router = useRouter();
  const arrowCount = 5;

  // Load data from external JSON (kept in `data.json`)
  const teamMembers = (pageData as any).teamMembers || [];

  // Duplicate team members to create a seamless loop effect
  const duplicatedTeamMembers = [...teamMembers, ...teamMembers, ...teamMembers];

  // Animation variants for infinite horizontal scrolling
  const scrollVariants = {
    animate: {
      x: [0, -(teamMembers.length / duplicatedTeamMembers.length) * 100 + '%'],
      transition: {
        repeat: Infinity,
        repeatType: 'loop' as const,
        duration: 30,
        ease: 'linear' as const,
      },
    },
  };

  const serviceItems = (pageData as any).serviceItems || [];
  const processSteps = (pageData as any).processSteps || [];

  // Ref for the container that limits dragging
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  // State to store the width of the drag constraints, initialized to 0
  const [dragConstraintsWidth, setDragConstraintsWidth] = useState<number>(0);

  // Calculate drag constraints after component renders and when window size changes
  useEffect(() => {
    const calculateConstraints = () => {
      if (constraintsRef.current) {
        // Total draggable content width minus visible area width
        // This ensures cards cannot be dragged too far from the start or end
        if (constraintsRef.current) {
          setDragConstraintsWidth(constraintsRef.current.scrollWidth - constraintsRef.current.offsetWidth);
        }
      }
    };

    // Only calculate after the component has mounted on the client
    calculateConstraints();
    window.addEventListener('resize', calculateConstraints); // Recalculate when window size changes

    return () => {
      window.removeEventListener('resize', calculateConstraints); // Clean up event listener
    };
  }, [processSteps.length]); // Recalculate if number of steps changes (though unlikely here)


  const pricingPlans = (pageData as any).pricingPlans || [];

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
  const [mainRef, mainInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [achievementRef, achievementInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [teamSectionRef, teamSectionInView] = useInView({ triggerOnce: true, threshold: 0.3 }); // New for team section text
  const [servicesSectionRef, servicesSectionInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [processSectionRef, processSectionInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [processCardsContainerRef, processCardsContainerInView] = useInView({ triggerOnce: true, threshold: 0.1 }); // For the draggable process cards container
  const [pricingSectionRef, pricingSectionInView] = useInView({ triggerOnce: true, threshold: 0.3 });
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
    <div className="bg-[#0A0A0A] text-white font-sans flex flex-col overflow-x-hidden scroll-smooth">
      {/* Navbar */}
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

      {/* Main Content Section */}
      <main ref={homeRef} className="bg-[url('/flood1.jpg')] bg-cover bg-center bg-no-repeat flex-grow flex flex-col justify-end pt-24 pb-8 px-8 lg:px-20 min-h-screen">
        <motion.div
          ref={mainRef}
          initial="hidden"
          animate={mainInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-7xl mx-auto w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="text-left mb-4 lg:mb-0">
              <motion.h1 variants={fadeInFromBottom} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
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

      {/* Achievement Section */}
      <section ref={projectsRef} className="bg-[#FAFAF5] text-black py-6 px-2 lg:px-12 min-h-screen flex items-center">
        <motion.div
          ref={achievementRef}
          initial="hidden"
          animate={achievementInView ? "visible" : "hidden"}
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
              <p className="text-gray-600">
                Our AI model achieves high accuracy in predicting potential floods.
              </p>
            </motion.div>
            <motion.div variants={fadeInFromBottom}>
              <p className="text-5xl font-semibold">5+</p>
              <hr className="my-4 border-gray-300" />
              <p className="font-semibold mb-1">Integrated Data Sources</p>
              <p className="text-gray-600">
                Combining satellite imagery, historical data, journals, and environmental sensors.
              </p>
            </motion.div>
            <motion.div variants={fadeInFromBottom}>
              <p className="text-5xl font-semibold">10x</p>
              <hr className="my-4 border-gray-300" />
              <p className="font-semibold mb-1">Improved Early Response</p>
              <p className="text-gray-600">
                Enabling faster early warnings for disaster mitigation.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Arrow Motion Section */}
      <section className="bg-[#FAFAF5] flex justify-center items-center overflow-hidden min-h-[30vh]">
        <div className="flex items-center space-x-8 lg:space-x-12">
          {/* LEFT arrows */}
          {[...Array(arrowCount)].map((_, i) => (
            <motion.div
              key={`left-${i}`}
              animate={{ opacity: [0.2, 0.6, 1, 0.6, 0.2], x: [0, 15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
              className={`text-8xl font-bold ${i % 2 === 0 ? 'text-black' : 'text-gray-400'}`}
            >
              <ChevronRight size={96} />
            </motion.div>
          ))}

          {/* TRY OUR DEMO Button with modern animation */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0', borderColor: '#000000' }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push('/login')}
            className="flex items-center justify-between px-6 py-3 bg-white text-black rounded-full text-base font-medium border border-gray-300 shadow-sm transition-all duration-200"
            style={{ width: '250px', height: '56px' }}
          >
            TRY OUR DEMO
            <motion.div
              className="ml-4 bg-black rounded-full p-2 flex items-center justify-center"
              whileHover={{ x: 5, y: -5, rotate: 15, backgroundColor: '#333333' }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight className="w-5 h-5 text-white" />
            </motion.div>
          </motion.button>

          {/* RIGHT arrows */}
          {[...Array(arrowCount)].map((_, i) => (
            <motion.div
              key={`right-${i}`}
              animate={{ opacity: [0.2, 0.6, 1, 0.6, 0.2], x: [0, -15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
              className={`text-8xl font-bold ${i % 2 === 0 ? 'text-black' : 'text-gray-400'}`}
            >
              <ChevronLeft size={96} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Team Section */}
      <section ref={aboutRef} className="bg-[#FAFAF5] text-black py-16 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          ref={teamSectionRef} // Use the new ref here
          initial="hidden"
          animate={teamSectionInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <motion.p variants={fadeInFromBottom} className="text-sm uppercase tracking-widest text-gray-500 mb-4">• OUR TEAM</motion.p>
          <motion.p variants={fadeInFromBottom} className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed text-gray-800">
            We are a multidisciplinary team consisting of AI experts, data scientists, GIS specialists, and hydrologists, dedicated to developing innovative solutions in flood monitoring and mitigation.
          </motion.p>
        </motion.div>
        <div className="relative w-full overflow-hidden h-[400px] md:h-[500px]">
          <motion.div
            className="flex h-full gap-x-2"
            variants={scrollVariants}
            animate="animate"
            style={{ width: `${(duplicatedTeamMembers.length / 6) * 100}%` }}
          >
            {duplicatedTeamMembers.map((member, index) => (
              <div
                key={`${member.id}-${index}`}
                className="relative flex-shrink-0 w-1/6 h-full"
              >
                <img
                  src={member.src}
                  alt={`Team Member ${member.id}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white/10"></div>
              </div>
            ))}
          </motion.div>

          {/* Left gradient overlay */}
          <div className="absolute inset-y-0 left-0 w-[2%] bg-gradient-to-r from-[#FAFAF5] to-transparent z-20"></div>
          {/* Right gradient overlay */}
          <div className="absolute inset-y-0 right-0 w-[2%] bg-gradient-to-l from-[#FAFAF5] to-transparent z-20"></div>

          {/* "The Team" text and "Meet Us" button centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-30">
            <h2 className="text-5xl md:text-7xl font-bold mb-4 text-white">Our Team</h2>
            <button className="flex items-center px-4 py-2 border border-white text-white rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors">
              MEET US
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="bg-[#FAFAF5] text-black py-16 px-4 lg:px-12 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          ref={servicesSectionRef}
          initial="hidden"
          animate={servicesSectionInView ? "visible" : "hidden"}
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

        {/* Container for the service items with animation */}
        <div className="relative w-full">
          <div className="w-full flex flex-col gap-8">
            {serviceItems.map((item, index) => {
              const [serviceItemRef, serviceItemInView] = useInView({ triggerOnce: true, threshold: 0.2 });
              return (
                <motion.div
                  ref={serviceItemRef}
                  key={item.id}
                  initial="hidden"
                  animate={serviceItemInView ? "visible" : "hidden"}
                  variants={fadeInFromBottom}
                  transition={{ delay: index * 0.1 }} // Stagger animation for each item
                  className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#FAFAF5] p-4"
                >
                  {/* Left Column: Text Content */}
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl font-bold text-gray-400 mr-4">{item.id}</span>
                      <p className="text-lg font-semibold text-black">• {item.title}</p>
                    </div>
                    <h3 className="text-4xl font-bold text-black mb-4">{item.title}</h3>
                    <p className="text-gray-700 mb-6 max-w-md">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Image */}
                  <div className="flex justify-center items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded-lg shadow-lg w-full h-auto object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Arrow Motion Section */}
      <section className="bg-[#FAFAF5] flex justify-center items-center overflow-hidden min-h-[30vh]">
        <div className="flex items-center space-x-8 lg:space-x-12">
          {/* LEFT arrows */}
          {[...Array(arrowCount)].map((_, i) => (
            <motion.div
              key={`left-${i}`}
              animate={{ opacity: [0.2, 0.6, 1, 0.6, 0.2], x: [0, 15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
              className={`text-8xl font-bold ${i % 2 === 0 ? 'text-black' : 'text-gray-400'}`}
            >
              <ChevronRight size={96} />
            </motion.div>
          ))}

          {/* TRY OUR DEMO Button with modern animation */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0', borderColor: '#000000' }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push('/login')}
            className="flex items-center justify-between px-6 py-3 bg-white text-black rounded-full text-base font-medium border border-gray-300 shadow-sm transition-all duration-200"
            style={{ width: '250px', height: '56px' }}
          >
            TRY OUR DEMO
            <motion.div
              className="ml-4 bg-black rounded-full p-2 flex items-center justify-center"
              whileHover={{ x: 5, y: -5, rotate: 15, backgroundColor: '#333333' }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight className="w-5 h-5 text-white" />
            </motion.div>
          </motion.button>

          {/* RIGHT arrows */}
          {[...Array(arrowCount)].map((_, i) => (
            <motion.div
              key={`right-${i}`}
              animate={{ opacity: [0.2, 0.6, 1, 0.6, 0.2], x: [0, -15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
              className={`text-8xl font-bold ${i % 2 === 0 ? 'text-black' : 'text-gray-400'}`}
            >
              <ChevronLeft size={96} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section - Title and Description */}
      <section ref={processRef} className="bg-[#FAFAF5] text-black py-16 px-4 lg:px-12 flex flex-col items-center justify-center text-center">
        <motion.div
          ref={processSectionRef}
          initial="hidden"
          animate={processSectionInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-4xl mx-auto w-full"
        >
          <motion.p variants={fadeInFromBottom} className="text-sm uppercase tracking-widest text-gray-500 mb-4">• HOW WE WORK</motion.p>
          <motion.h2 variants={fadeInFromBottom} className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-8">
            Process
          </motion.h2>
          <motion.p variants={fadeInFromBottom} className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed text-gray-800">
            To ensure seamless and effortless flood monitoring, we have established a simple and efficient process that will help us get started on the Judul Banjay project as quickly as possible.
          </motion.p>
        </motion.div>
      </section>

      {/* Process Content Cards Section - Draggable */}
      <section className="bg-[#FAFAF5] text-black py-16">
        <motion.div
          ref={processCardsContainerRef} // New ref for the container
          initial="hidden"
          animate={processCardsContainerInView ? "visible" : "hidden"}
          // Removed staggerContainer from here to apply to individual cards
          className="relative w-full overflow-hidden cursor-grab px-4 lg:px-12"
        >
          <motion.div
            ref={constraintsRef} // Use constraintsRef here
            className="flex gap-8 py-4"
            drag="x"
            // Conditionally apply dragConstraints only if dragConstraintsWidth is a valid number
            {...(typeof dragConstraintsWidth === 'number' && { dragConstraints: { left: -dragConstraintsWidth, right: 0 } })}
            whileTap={{ cursor: "grabbing" }}
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial="hidden" // Each card starts hidden
                animate={processCardsContainerInView ? "visible" : "hidden"} // Animates when container is in view
                variants={fadeInFromBottom} // Apply fade-in-from-bottom animation
                transition={{ delay: index * 0.15 }} // Stagger animation for each card
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Image for process card */}
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-8 text-left">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 text-gray-600 text-lg font-bold mb-4">
                    {step.id}
                  </div>
                  <h3 className="text-2xl font-semibold text-black mb-2">{step.title}</h3>
                  <p className="text-base text-gray-700">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="bg-[#FAFAF5] text-black py-16 px-4 lg:px-12 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          ref={pricingSectionRef}
          initial="hidden"
          animate={pricingSectionInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-7xl mx-auto w-full text-center mb-16"
        >
          <motion.p variants={fadeInFromBottom} className="text-sm uppercase tracking-widest text-gray-500 mb-4">• Pricing</motion.p>
          <motion.h2 variants={fadeInFromBottom} className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-8">
            Project Packages
          </motion.h2>
        </motion.div>
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate={pricingSectionInView ? "visible" : "hidden"}
              variants={fadeInFromBottom}
              transition={{ delay: index * 0.15 }} // Stagger animation for each plan
              className={`rounded-lg shadow-lg p-8 flex flex-col ${plan.isDark ? 'bg-black text-white' : 'bg-white text-black border border-gray-200'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-semibold">{plan.name}</h3>
                {plan.icon && <div className={`${plan.isDark ? 'text-white' : 'text-black'}`}>{plan.icon}</div>}
              </div>
              <hr className={`mb-4 ${plan.isDark ? 'border-gray-700' : 'border-gray-300'}`} />
              <p className="text-4xl font-bold mb-2">
                {plan.price}<span className="text-xl font-medium">{plan.period}</span>
              </p>
              <p className={`mb-6 text-sm ${plan.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {plan.description}
              </p>
              <button className={`flex items-center justify-center px-6 py-3 rounded-full text-base font-medium transition-colors ${plan.isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                Start Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <svg className={`w-4 h-4 mr-2 ${plan.isDark ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
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
