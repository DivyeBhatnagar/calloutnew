'use client';

import { motion } from 'framer-motion';
import { Users, UserPlus, Gamepad2, Trophy } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Users className="w-7 h-7" />,
      title: "Create Your Team",
      description: "Form a team with friends or join existing teams looking for players.",
      step: "01"
    },
    {
      icon: <UserPlus className="w-7 h-7" />,
      title: "Register for Tournaments",
      description: "Browse and register for tournaments that match your skill level.",
      step: "02"
    },
    {
      icon: <Gamepad2 className="w-7 h-7" />,
      title: "Play Matches",
      description: "Compete in structured matches with professional oversight.",
      step: "03"
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: "Win Rewards",
      description: "Earn prizes, recognition, and climb the competitive rankings.",
      step: "04"
    }
  ];

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
          <h2 className="section-heading">
            How It Works
          </h2>
          <p className="section-subheading">
            Get started in competitive esports with our simple four-step process.
          </p>
        </motion.div>

        {/* Steps Process */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-16 right-16 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
          
          {/* Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="card-base text-center h-full flex flex-col relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* 3D Step Number */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-lg mx-auto mb-6 relative z-10 shadow-lg transform hover:scale-105 transition-transform">
                  <div className="absolute inset-0.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl"></div>
                  <span className="relative z-10">{step.step}</span>
                </div>

                {/* 3D Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-md relative transform hover:scale-105 transition-transform">
                  <div className="absolute inset-1 bg-gradient-to-br from-white to-blue-50 rounded-xl"></div>
                  <div className="relative z-10">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="card-title mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed flex-1">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <button className="btn-primary">
            Start Your Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
}