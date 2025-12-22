'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/Home Page/HeroSection';
import WhySection from '@/components/Home Page/WhySection';
import FeaturedGamesSection from '@/components/Home Page/FeaturedGamesSection';
import AboutSection from '@/components/Home Page/AboutSection';
import FeaturesSection from '@/components/Home Page/FeaturesSection';
import HowItWorksSection from '@/components/Home Page/HowItWorksSection';
import CTASection from '@/components/Home Page/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen text-black premium-gaming-layout">
      <Navbar />
      <HeroSection />
      <WhySection />
      <FeaturedGamesSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}