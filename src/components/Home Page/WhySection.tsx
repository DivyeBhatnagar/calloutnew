'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Settings, Trophy } from 'lucide-react';
export default function WhySection() {
  const reasons = [
    {
      icon: <Gamepad2 className="w-10 h-10" />,
      title: "Competitive Tournaments",
      description: "Fair matches, strict rules, real competition"
    },
    {
      icon: <Settings className="w-10 h-10" />,
      title: "Smart Match Management",
      description: "Automated rooms, results & admin control"
    },
    {
      icon: <Trophy className="w-10 h-10" />,
      title: "Built for Winners",
      description: "Real prizes, recognition & community growth"
    }
  ];

  return (
    <section className="pt-12 pb-20 bg-gray-50/90 backdrop-blur-sm">
      <div className="main-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">
            Why CALLOUT ESPORTS?
          </h2>
          <p className="section-subheading">
            The platform that serious gamers choose for competitive esports
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="card-base text-center h-full flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-md relative transform hover:scale-105 transition-transform">
                <div className="absolute inset-1 bg-gradient-to-br from-white to-blue-50 rounded-xl"></div>
                <div className="relative z-10">
                  {reason.icon}
                </div>
              </div>
              
              <h3 className="card-title mb-4">
                {reason.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed flex-1">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}