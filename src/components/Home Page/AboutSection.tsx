'use client';

import { motion } from 'framer-motion';
import { Trophy, Users, Shield, Gamepad2, Target, Zap, Crown } from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Competitive Tournaments",
      description: "Professional-grade tournaments with structured brackets and fair matchmaking systems."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "College-Focused Esports",
      description: "Designed specifically for college students and young gaming enthusiasts across India."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fair & Transparent",
      description: "Complete transparency in matches, results, and prize distribution with secure systems."
    }
  ];

  return (
    <section className="section-spacing relative overflow-hidden" style={{backgroundColor: '#f0f4ff'}}>
      {/* 3D Gaming Elements Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 3D Gamepad */}
        <motion.div
          className="absolute top-24 right-12 w-16 h-16 opacity-8"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gamepad2 className="w-full h-full text-blue-400" />
        </motion.div>
        
        {/* 3D Target */}
        <motion.div
          className="absolute bottom-32 right-24 w-12 h-12 opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Target className="w-full h-full text-red-400" />
        </motion.div>

        {/* 3D Crown */}
        <motion.div
          className="absolute top-1/3 left-8 w-10 h-10 opacity-12"
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Crown className="w-full h-full text-yellow-500" />
        </motion.div>
      </div>

      <div className="main-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column - Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-1 bg-blue-600 rounded mb-8"></div>
            <h2 className="section-heading text-left mb-8">
              Elevating Indian Esports
            </h2>
            <div className="space-y-6 max-w-lg">
              <p className="text-lg text-gray-600 leading-relaxed">
                CALLOUT ESPORTS is more than just a tournament platform. We're building a comprehensive ecosystem where Indian gamers can compete, grow, and achieve their esports dreams in a professional and supportive environment.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                From college-level competitions to professional tournaments, we provide the infrastructure and community that Indian esports deserves.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Feature Cards */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card-base"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 via-blue-50 to-white border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-lg relative transform hover:scale-110 transition-all duration-300">
                    <div className="absolute inset-1 bg-gradient-to-br from-white to-blue-50 rounded-xl"></div>
                    <div className="relative z-10 transform hover:rotate-12 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    {/* 3D highlight */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-70"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="card-title mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}