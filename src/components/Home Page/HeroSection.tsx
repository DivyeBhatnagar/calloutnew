'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="hero-premium-bg min-h-screen flex items-center relative overflow-hidden">
      {/* Floating Gaming Elements */}
      <div className="floating-gaming-elements">
        <motion.div 
          className="gaming-element gaming-controller"
          initial={{ opacity: 0, y: 20, rotate: -15 }}
          animate={{ opacity: 0.1, y: 0, rotate: 0 }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div 
          className="gaming-element gaming-joystick"
          initial={{ opacity: 0, x: -20, rotate: 15 }}
          animate={{ opacity: 0.08, x: 0, rotate: 0 }}
          transition={{ delay: 2, duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      <div className="main-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Blue Accent Line */}
            <motion.div
              className="accent-line-premium"
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            
            {/* Main Heading */}
            <motion.h1 
              className="hero-heading-premium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              CALLOUT ESPORTS
            </motion.h1>
            
            {/* Tagline */}
            <motion.p 
              className="hero-tagline-premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              India's Competitive Esports Tournament Platform
            </motion.p>
            
            {/* Description */}
            <motion.p
              className="hero-description-premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Play. Compete. Win. Trusted tournaments for serious gamers.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <button className="btn-cta-premium">
                Join Tournament
              </button>
            </motion.div>
          </motion.div>

          {/* Right Gaming Vector Illustration */}
          <motion.div
            className="relative flex justify-center items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="gaming-vector-container">
              <motion.img
                src="/Media/Background/GamingVector.png"
                alt="Gaming Vector Illustration"
                className="gaming-vector-image"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1, 1.05, 1],
                  opacity: 1 
                }}
                transition={{ 
                  scale: {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  },
                  opacity: {
                    delay: 0.6,
                    duration: 1,
                    ease: "easeOut"
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}