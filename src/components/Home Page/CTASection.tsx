'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="section-spacing bg-gray-50/90 backdrop-blur-sm">
      <div className="main-container">
        <div className="center-content">
          <motion.div
            className="card-base text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Logo */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img 
              src="/Media/Logo/Logo2.png" 
              alt="CALLOUT ESPORTS Logo" 
              className="logo-cta mx-auto opacity-80"
            />
          </motion.div>
          
          {/* Main Heading */}
          <motion.h2 
            className="section-heading mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Compete?
          </motion.h2>
          
          {/* Description */}
          <motion.p
            className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join thousands of players already competing in India's most trusted esports platform. Your competitive journey starts here.
          </motion.p>
          
          {/* CTA Button with 3D Trophy */}
          <motion.div
            className="mb-16 relative flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button className="btn-primary text-lg px-12 py-4 relative z-10">
              Join CALLOUT ESPORTS
            </button>
            
            {/* 3D Trophy Element */}
            <motion.div
              className="absolute -top-4 -right-8 w-12 h-12 opacity-30"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.3, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-lg relative transform rotate-12">
                {/* Trophy cup */}
                <div className="absolute inset-1 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md">
                  {/* Trophy handles */}
                  <div className="absolute top-2 -left-1 w-2 h-4 bg-yellow-400 rounded-l-full"></div>
                  <div className="absolute top-2 -right-1 w-2 h-4 bg-yellow-400 rounded-r-full"></div>
                  {/* Trophy base */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-yellow-500 rounded-b-md"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-sm text-gray-600 font-medium">Active Players</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-gray-600 font-medium">Monthly Tournaments</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹10L+</div>
              <div className="text-sm text-gray-600 font-medium">Prize Pool</div>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}