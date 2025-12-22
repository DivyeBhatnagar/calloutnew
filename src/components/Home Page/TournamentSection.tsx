'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Gamepad2, Medal, Crown, Zap } from 'lucide-react';

export default function TournamentSection() {
  const tournaments = [
    {
      game: "VALORANT",
      title: "College Championship 2024",
      entryFee: "₹500",
      prizePool: "₹50,000",
      status: "Open",
      participants: "24/32 teams",
      date: "Dec 25, 2024"
    },
    {
      game: "CS2",
      title: "Winter Showdown",
      entryFee: "₹300",
      prizePool: "₹25,000",
      status: "Upcoming",
      participants: "16/16 teams",
      date: "Jan 5, 2025"
    },
    {
      game: "BGMI",
      title: "Mobile Masters",
      entryFee: "₹200",
      prizePool: "₹15,000",
      status: "Open",
      participants: "18/24 teams",
      date: "Dec 30, 2024"
    }
  ];

  return (
    <section className="section-spacing relative overflow-hidden" style={{backgroundColor: '#f0f4ff'}}>
      {/* 3D Gaming Elements Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 3D Trophy */}
        <motion.div
          className="absolute top-16 left-16 w-14 h-14 opacity-10"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy className="w-full h-full text-yellow-500" />
        </motion.div>
        
        {/* 3D Target */}
        <motion.div
          className="absolute top-32 right-20 w-12 h-12 opacity-12"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Target className="w-full h-full text-red-500" />
        </motion.div>

        {/* 3D Crown */}
        <motion.div
          className="absolute bottom-32 right-16 w-10 h-10 opacity-15"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Crown className="w-full h-full text-yellow-600" />
        </motion.div>

        {/* 3D Medal */}
        <motion.div
          className="absolute bottom-20 left-20 w-8 h-8 opacity-12"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Medal className="w-full h-full text-orange-500" />
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
            Active Tournaments
          </h2>
          <p className="section-subheading">
            Join ongoing and upcoming tournaments. Compete with the best players across India.
          </p>
        </motion.div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {tournaments.map((tournament, index) => (
            <motion.div
              key={index}
              className="card-base flex flex-col h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Header with 3D Game Badge and Status */}
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-2xl text-xs font-bold uppercase shadow-lg transform hover:scale-105 transition-transform">
                    {tournament.game}
                  </span>
                  {/* 3D Gaming icon */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <Gamepad2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase shadow-lg transform hover:scale-105 transition-transform ${
                  tournament.status === 'Open' 
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                    : tournament.status === 'Live'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                }`}>
                  {tournament.status === 'Open' && <Zap className="w-3 h-3 inline mr-1" />}
                  {tournament.status}
                </span>
              </div>

              {/* Tournament Title */}
              <h3 className="card-title mb-6">
                {tournament.title}
              </h3>

              {/* Tournament Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8 flex-1">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-xs text-gray-500 uppercase mb-2 font-medium">Entry Fee</div>
                  <div className="font-bold text-blue-600 text-sm">{tournament.entryFee}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-xs text-gray-500 uppercase mb-2 font-medium">Prize Pool</div>
                  <div className="font-bold text-blue-600 text-sm">{tournament.prizePool}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-xs text-gray-500 uppercase mb-2 font-medium">Teams</div>
                  <div className="font-bold text-blue-600 text-sm">{tournament.participants}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-xs text-gray-500 uppercase mb-2 font-medium">Date</div>
                  <div className="font-bold text-blue-600 text-sm">{tournament.date}</div>
                </div>
              </div>

              {/* Register Button */}
              <button className="btn-primary w-full">
                Register Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button className="btn-secondary">
            View All Tournaments
          </button>
        </motion.div>
      </div>
    </section>
  );
}