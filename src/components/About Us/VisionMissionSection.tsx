'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Star, Flag } from 'lucide-react';

export default function VisionMissionSection() {
  return (
    <section className="section-spacing" style={{backgroundColor: '#f0f4ff'}}>
      <div className="main-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading mb-4">
            Vision & Mission
          </h2>
          <p className="text-gray-500 text-lg">
            Our commitment to building India's esports future
          </p>
        </motion.div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vision Card */}
          <motion.div
            className="card-base h-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {/* 3D Icon */}
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-200 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0 shadow-lg relative"
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-1 bg-gradient-to-br from-white to-yellow-50 rounded-xl"></div>
              <div className="relative z-10 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
              </div>
            </motion.div>

            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-black mb-6">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become India's most trusted and accessible esports platform, where every gamer has the opportunity to compete, improve, and shine.
              </p>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            className="card-base h-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* 3D Icon */}
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0 shadow-lg relative"
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="absolute inset-1 bg-gradient-to-br from-white to-blue-50 rounded-xl"></div>
              <div className="relative z-10 flex items-center justify-center">
                <Target className="w-8 h-8 text-blue-600" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-300 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                ></motion.div>
              </div>
            </motion.div>

            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-black mb-6">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To provide structured tournaments, fair competition, and a supportive ecosystem that helps gamers grow from campus-level events to professional esports.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}