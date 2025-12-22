'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHeroSection from '@/components/About Us/AboutHeroSection';
import FounderSection from '@/components/About Us/FounderSection';
import VisionMissionSection from '@/components/About Us/VisionMissionSection';
import WhyCalloutCompactSection from '@/components/About Us/WhyCalloutCompactSection';
import AboutCTASection from '@/components/About Us/AboutCTASection';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AboutHeroSection />
      <FounderSection />
      <VisionMissionSection />
      <WhyCalloutCompactSection />
      <AboutCTASection />
      <Footer />
    </main>
  );
}