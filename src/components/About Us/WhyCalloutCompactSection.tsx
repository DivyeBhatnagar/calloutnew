'use client';

import { motion } from 'framer-motion';
import { Trophy, Shield, Users, TrendingUp, Gamepad2, Target, Award, Zap } from 'lucide-react';

export default function WhyCalloutCompactSection() {
  const features = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Competitive Tournaments",
      description: "Regular structured tournaments with fair matchmaking"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fair & Transparent Play",
      description: "Anti-cheat systems and transparent tournament rules"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "College-Focused Esports",
      description: "Campus-level events and student-friendly competitions"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Community & Growth",
      description: "Supportive ecosystem for skill development and networking"
    }
  ];

  return (
    <section className="section-spacing" style={{backgroundColor: '#ffffff'}}>
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
            Why Callout Esports
          </h2>
          <p className="text-gray-500 text-lg">
            What makes us the preferred choice for competitive gaming
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card-base text-center h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* 3D Icon */}
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
              >
                <div className="absolute inset-1 bg-gradient-to-br from-white to-blue-50 rounded-xl"></div>
                <div className="relative z-10 text-blue-600">
                  {feature.icon}
                </div>
              </motion.div>

              {/* Content */}
              <h3 className="text-lg font-bold text-black mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}