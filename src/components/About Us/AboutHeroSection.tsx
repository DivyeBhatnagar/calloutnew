'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Gamepad2 } from 'lucide-react';

export default function AboutHeroSection() {
  return (
    <section className="section-spacing-large" style={{backgroundColor: '#f0f4ff'}}>
      <div className="main-container">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            className="text-center lg:text-left w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
            <span className="text-blue-600">CALLOUT ESPORTS</span>
            </h1>
            
            <h2 className="text-xl lg:text-2xl font-semibold text-black-600 mb-8">
              Building India's Competitive Esports Future
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl">
              Callout Esports is a competitive gaming platform focused on empowering Indian gamers through structured tournaments, fair play, and community-driven esports experiences.
            </p>
          </motion.div>

          {/* Callout Logo */}
          <motion.div
            className="flex justify-center lg:justify-end w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Logo Container */}
              <motion.div
                className="w-80 h-80 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden border border-blue-100"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent"></div>
                
                {/* Callout Logo */}
                <motion.img
                  src="/Media/Logo/Logo2.png"
                  alt="CALLOUT ESPORTS Logo"
                  className="relative z-10 w-64 h-64 object-contain drop-shadow-lg"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Floating Gaming Elements */}
                <motion.div
                  className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-500 rounded-xl shadow-lg flex items-center justify-center opacity-80"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Gamepad2 className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  className="absolute bottom-8 left-8 w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg flex items-center justify-center opacity-80"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Trophy className="w-5 h-5 text-yellow-700" />
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full opacity-60"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
              
              <motion.div
                className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-300 rounded-full opacity-60"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}