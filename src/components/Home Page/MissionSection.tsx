'use client';

import { motion } from 'framer-motion';
import { Target, Users, Trophy } from 'lucide-react';

export default function MissionSection() {
  const missions = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Competitive Excellence",
      description: "Host structured tournaments with fair play and professional standards"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community First",
      description: "Building connections between college students and esports enthusiasts"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Growth Platform",
      description: "Providing opportunities for players to showcase their skills and grow"
    }
  ];

  return (
    <section className="section-spacing bg-gray-50/90 backdrop-blur-sm">
      <div className="main-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">
            MISSION BRIEF
          </h2>
          <p className="section-subheading">
            What is CALLOUT ESPORTS? We're not just another gaming platform - we're the future of competitive esports in India.
          </p>
        </motion.div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-12">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              className="card-base text-center h-full flex flex-col group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                {mission.icon}
              </div>
              <h3 className="card-title mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {mission.title}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-1 group-hover:text-black transition-colors duration-300">
                {mission.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}