'use client';

import { motion } from 'framer-motion';
import { User, Shield, Crown } from 'lucide-react';

export default function FounderSection() {
  return (
    <section className="section-spacing" style={{backgroundColor: '#ffffff'}}>
      <div className="main-container">
        <motion.div
          className="card-base max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Founder Info */}
            <motion.div
              className="text-center lg:text-left w-full"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
                Faizan Ali Rahman
              </h2>
              
              <h3 className="text-xl font-semibold text-blue-600 mb-8">
                Founder & CEO
              </h3>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Faizan Ali Rahman is the driving force behind Callout Esports, dedicated to building a strong and competitive esports ecosystem for India's youth. With experience in esports tournament management, campus-level events, and community building, he has successfully led multiple gaming championships and large offline events.
                </p>
                
                <p>
                  His vision is to create a platform where gamers can compete regularly, grow their skills, and gain recognition in the professional esports space. Under his leadership, Callout Esports continues to expand as a trusted name in the gaming community.
                </p>
              </div>
            </motion.div>

            {/* 3D Avatar Visual */}
            <motion.div
              className="flex justify-center lg:justify-end w-full"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Main Avatar Container */}
                <motion.div
                  className="w-56 h-56 bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>
                  
                  {/* Central Avatar */}
                  <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>

                  {/* Leadership Elements */}
                  <motion.div
                    className="absolute top-6 right-6 w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl shadow-lg flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Crown className="w-5 h-5 text-yellow-700" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-green-300 to-green-500 rounded-full shadow-lg flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Shield className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute -top-3 -left-3 w-6 h-6 bg-blue-200 rounded-full opacity-60"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
                
                <motion.div
                  className="absolute -bottom-3 -right-3 w-4 h-4 bg-yellow-200 rounded-full opacity-60"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}