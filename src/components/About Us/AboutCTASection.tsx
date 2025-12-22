'use client';

import { motion } from 'framer-motion';
import { Trophy, Gamepad2 } from 'lucide-react';

export default function AboutCTASection() {
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
            {/* Main Heading */}
            <motion.h2 
              className="section-heading mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Join the Callout Esports Journey
            </motion.h2>
            
            {/* Description */}
            <motion.p
              className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Whether you're a casual gamer or an aspiring professional, Callout Esports is your platform to compete, grow, and get recognized.
            </motion.p>
            
            {/* CTA Button with 3D Gaming Element */}
            <motion.div
              className="mb-16 relative flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <button className="btn-primary text-lg px-12 py-4 relative z-10">
                Explore Tournaments
              </button>
              
              {/* 3D Gaming Controller Element */}
              <motion.div
                className="absolute -top-6 -right-10 w-14 h-14 opacity-30"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.3, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-500 rounded-2xl shadow-lg relative transform rotate-12">
                  {/* Controller body */}
                  <div className="absolute inset-1 bg-gradient-to-br from-blue-200 to-blue-400 rounded-xl flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  {/* Controller buttons */}
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="absolute bottom-1 left-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </motion.div>

              {/* 3D Trophy Element */}
              <motion.div
                className="absolute -top-4 -left-8 w-10 h-10 opacity-25"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.25, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-lg relative transform -rotate-12">
                  <div className="absolute inset-1 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-yellow-700" />
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