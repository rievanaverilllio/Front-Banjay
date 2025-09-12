import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useMemo } from 'react';

interface FooterProps {
  contactRef: React.RefObject<HTMLElement | null>;
  footerRef: React.RefObject<HTMLDivElement> | ((node?: Element | null) => void);
  footerInView: boolean;
  staggerContainer: any;
  fadeInFromBottom: any;
  scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void;
  homeRef: React.RefObject<HTMLElement | null>;
  projectsRef: React.RefObject<HTMLElement | null>;
  aboutRef: React.RefObject<HTMLElement | null>;
  servicesRef: React.RefObject<HTMLElement | null>;
  pricingRef: React.RefObject<HTMLElement | null>;
}

export default function Footer({
  contactRef,
  footerRef,
  footerInView,
  staggerContainer,
  fadeInFromBottom,
  scrollToSection,
  homeRef,
  projectsRef,
  aboutRef,
  servicesRef,
  pricingRef,
}: FooterProps) {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer ref={contactRef} className="bg-[#0A0A0A] text-white py-12 px-4 lg:px-12">
      <motion.div
        ref={footerRef}
        initial="hidden"
        animate={footerInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-16 md:gap-y-12"
      >
        {/* Logo and Copyright */}
        <motion.div variants={fadeInFromBottom} className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-2xl font-bold tracking-wide mb-2">BANJAY®</span>
          <p className="text-sm text-gray-400 mt-2">&copy; {year} Banjay. All rights reserved.</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              {/* Twitter Icon */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.007-.533A8.349 8.349 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 10.702v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.844"/>
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              {/* Facebook Icon */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              {/* GitHub Icon */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.872 7.85 6.821 9.15.5.092.682-.217.682-.483 0-.237-.008-.867-.013-1.7C6.73 18.495 6.18 17.394 6.18 17.394c-.436-1.107-.98-1.403-.98-1.403-.8-.547.06-.535.06-.535.887.063 1.359.91 1.359.91.785 1.348 2.053.96 2.559.734.079-.57.307-.96.56-1.18-.01-.092-.03-.207-.03-.332-2.327-.252-4.78-1.162-4.78-5.174 0-1.147.409-2.084 1.077-2.828-.109-.25-.468-1.336.103-2.795 0 0 .878-.283 2.874 1.076.835-.23 1.72-.346 2.604-.35C15.71 6.13 16.595 6.246 17.43 6.476c1.996-1.359 2.873-1.076 2.873-1.076.571 1.459.212 2.545.103 2.795.67.744 1.079 1.681 1.079 2.828 0 4.02-2.457 4.918-4.792 5.166.313.27.592.812.592 1.637 0 1.18-.01 2.126-.01 2.413 0 .267.18.577.688.484C21.128 19.85 24 16.237 24 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/>
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              {/* Instagram Icon (simple placeholder) */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.715-2.118 1.374L.63 4.14c-.297.765-.498 1.635-.558 2.913-.057 1.28-.072 1.668-.072 4.004s.015 2.724.072 4.004c.06 1.278.261 2.148.558 2.913.306.789.715 1.459 1.374 2.118l1.374 1.374c.765.297 1.635.498 2.913.558 1.28.057 1.668.072 4.004.072s2.724-.015 4.004-.072c1.278-.06 2.148-.261 2.913-.558.789-.306 1.459-.715 2.118-1.374l1.374-1.374c.297-.765.498-1.635.558-2.913.057-1.28.072-1.668.072-4.004s-.015-2.724-.072-4.004c-.06-1.278-.261-2.148-.558-2.913-.306-.789-.715-1.459-1.374-2.118L19.86 2.63c-.765-.297-1.635-.498-2.913-.558C15.668.015 15.27.001 12 0zm0 2.16c3.203 0 3.585.016 4.85.072 1.17.055 1.8.245 2.227.42.673.272 1.157.66 1.604 1.107.447.447.835.93 1.107 1.604.174.427.365 1.057.42 2.227.056 1.265.072 1.646.072 4.85s-.016 3.585-.072 4.85c-.055 1.17-.245 1.8-.42 2.227-.272.673-.66 1.157-1.107 1.604-.447.447-.835.93-1.604 1.107-.427.174-1.057.365-2.227.42-1.265.056-1.646.072-4.85.072s-3.585-.016-4.85-.072c-1.17-.055-1.8-.245-2.227-.42-.673-.272-1.157-.66-1.604-1.107-.447-.447-.93-.835-1.604-1.107.427-.174 1.057-.365 2.227-.42C2.16 15.668 2.144 15.27 2.144 12s.016-3.585.072-4.85c.055-1.17.245-1.8.42-2.227.272-.673.66-1.157 1.107-1.604.447-.447-.93-.835-1.604-1.107.427-.174 1.057-.365 2.227-.42C8.415 2.16 8.797 2.144 12 2.144zm0 3.627c-3.407 0-6.173 2.766-6.173 6.173S8.593 18.143 12 18.143s6.173-2.766 6.173-6.173S15.407 5.787 12 5.787zm0 2.16c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 1.62c-1.325 0-2.4 1.075-2.4 2.4s1.075 2.4 2.4 2.4 2.4-1.075 2.4-2.4-1.075-2.4-2.4-2.4zm5.782-5.92c-.87-.001-1.579.709-1.579 1.58 0 .87.709 1.579 1.579 1.58.87 0 1.579-.709 1.579-1.58 0-.87-.709-1.579-1.579-1.58z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeInFromBottom} className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#home" onClick={() => scrollToSection(homeRef)} className="text-gray-300 hover:text-white transition-colors text-sm">Home</a></li>
            <li><a href="#projects" onClick={() => scrollToSection(projectsRef)} className="text-gray-300 hover:text-white transition-colors text-sm">Projects</a></li>
            <li><a href="#about" onClick={() => scrollToSection(aboutRef)} className="text-gray-300 hover:text-white transition-colors text-sm">About Us</a></li>
            <li><a href="#services" onClick={() => scrollToSection(servicesRef)} className="text-gray-300 hover:text-white transition-colors text-sm">Services</a></li>
            <li><a href="#pricing" onClick={() => scrollToSection(pricingRef)} className="text-gray-300 hover:text-white transition-colors text-sm">Project Packages</a></li>
            <li><a href="#blog" className="text-gray-300 hover:text-white transition-colors text-sm">Blog</a></li>
            <li><a href="#contact" onClick={() => scrollToSection(contactRef)} className="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
          </ul>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={fadeInFromBottom} className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2">
            <li className="text-gray-300 text-sm">Email: <a href="mailto:info@banjay.com" className="hover:text-white transition-colors">info@banjay.com</a></li>
            <li className="text-gray-300 text-sm">Phone: <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a></li>
            <li className="text-gray-300 text-sm">Address: 123 Design St, Creative City, CA 90210</li>
          </ul>
          <h4 className="text-lg font-semibold mt-6 mb-4">Follow Us</h4>
          <div className="flex flex-wrap space-x-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Behance</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Dribbble</a>
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div variants={fadeInFromBottom} className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest news and insights on flood monitoring.</p>
          <form className="w-full max-w-sm">
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
      <div className="max-w-7xl mx-auto w-full text-center mt-8 pt-8 border-t border-gray-700">
        <p className="text-xs text-gray-500">Designed with passion by Banjay. Built with React and Tailwind CSS.</p>
        <p className="text-xs text-gray-500 mt-1">Privacy Policy | Terms of Service | Cookie Policy</p>
      </div>
    </footer>
  );
}
