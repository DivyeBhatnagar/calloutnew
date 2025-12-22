'use client';

import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Eye, TrendingUp } from 'lucide-react';

export default function VisionSection() {
  const visionPoints = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Indian Esports Ecosystem",
      description: "Building the foundation for India's competitive gaming future with local tournaments and regional championships"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "College-Level Focus",
      description: "Empowering students and young gamers to pursue their passion while maintaining academic excellence"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Transparency & Growth",
      description: "Open, fair, and transparent platform that prioritizes player development and community feedback"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Professional Pathway",
      description: "Creating opportunities for talented players to transition from amateur to professional esports"
    }
  ];

  return (
    <section className="section-spacing" style={{backgroundColor: '#f0f4ff'}}>
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
            OUR VISION
          </h2>
          <p className="section-subheading">
            The lore of CALLOUT ESPORTS - where passion meets purpose in the digital arena
          </p>
        </motion.div>

        {/* Vision Story */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="card-base max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              In the rapidly evolving landscape of Indian esports, we saw a gap - talented players scattered across colleges and communities, lacking a unified platform to showcase their skills and compete at the highest level.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              CALLOUT ESPORTS was born from this vision: to create India's most comprehensive, fair, and community-driven esports ecosystem where every gamer has the opportunity to rise, compete, and achieve greatness.
            </p>
          </div>
        </motion.div>

        {/* Vision Points Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {visionPoints.map((point, index) => (
            <motion.div
              key={index}
              className="card-base flex gap-6 group"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
                {point.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="card-title mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {point.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-black transition-colors duration-300">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Statement */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl inline-block">
            <p className="text-2xl font-bold text-blue-600 mb-3">
              "Every Champion Was Once a Beginner"
            </p>
            <p className="text-gray-600 text-lg">
              Join us in building the future of Indian esports
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}