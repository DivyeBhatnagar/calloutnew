'use client';

import { motion } from 'framer-motion';
import { UserPlus, CreditCard, Users, Settings, Heart, Shield, Gamepad2, Trophy, Zap } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: "College-Exclusive Tournaments",
      description: "Compete in tournaments designed specifically for college students, ensuring fair competition among peers from similar environments."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Squad-Based Team Play",
      description: "Form teams with your college friends, manage your squad easily, and represent your campus in organized esports events."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Simple & Fast Registration",
      description: "Quick registration with minimal steps so students can join tournaments without unnecessary formalities."
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Clear Match Schedules",
      description: "Access well-defined match timings, fixtures, and results so you can balance academics and esports smoothly."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Affordable Entry & Transparent Prizes",
      description: "Student-friendly entry fees with clearly displayed prize pools and transparent reward distribution."
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Fair Play & Admin Moderation",
      description: "All matches are monitored and managed by admins to ensure fair play, rule enforcement, and a cheat-free experience."
    }
  ];

  return (
    <section className="section-spacing bg-gray-50/90 backdrop-blur-sm relative overflow-hidden">
      {/* 3D Gaming Elements Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 3D Shield */}
        <motion.div
          className="absolute top-20 right-10 w-12 h-12 opacity-10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <Shield className="w-full h-full text-blue-500" />
        </motion.div>
        
        {/* 3D Trophy */}
        <motion.div
          className="absolute bottom-20 left-10 w-10 h-10 opacity-15"
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy className="w-full h-full text-yellow-500" />
        </motion.div>

        {/* 3D Lightning */}
        <motion.div
          className="absolute top-1/2 left-5 w-8 h-8 opacity-12"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap className="w-full h-full text-blue-400" />
        </motion.div>
      </div>

      <div className="main-container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">
            Platform Features
          </h2>
          <p className="section-subheading">
            Everything you need for competitive esports, designed with simplicity and functionality in mind.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card-base text-center h-full flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 via-blue-50 to-white border border-blue-200 flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-lg relative transform hover:scale-110 transition-all duration-300">
                <div className="absolute inset-1 bg-gradient-to-br from-white to-blue-50 rounded-xl"></div>
                <div className="relative z-10 transform hover:rotate-12 transition-transform duration-300">
                  {feature.icon}
                </div>
                {/* 3D highlight */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-60"></div>
              </div>
              
              <h3 className="card-title mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed flex-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}