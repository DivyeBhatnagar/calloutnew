'use client';

import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, Award } from 'lucide-react';

export default function RecentTournaments() {
  const tournaments = [
    {
      id: 1,
      name: 'VALORANT College Championship',
      game: 'VALORANT',
      status: 'Won',
      position: '1st',
      prize: '₹15,000',
      date: 'Dec 15, 2024',
      participants: 32
    },
    {
      id: 2,
      name: 'CS2 Winter Showdown',
      game: 'CS2',
      status: 'Runner-up',
      position: '2nd',
      prize: '₹8,000',
      date: 'Dec 10, 2024',
      participants: 16
    },
    {
      id: 3,
      name: 'BGMI Mobile Masters',
      game: 'BGMI',
      status: 'Participated',
      position: '5th',
      prize: '₹2,000',
      date: 'Dec 5, 2024',
      participants: 24
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Won': return 'text-green-600 bg-green-100';
      case 'Runner-up': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="card-title">Recent Tournaments</h2>
        <button className="card-action">View All</button>
      </div>

      <div className="tournament-list">
        {tournaments.map((tournament, index) => (
          <motion.div
            key={tournament.id}
            className="tournament-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <div className="tournament-info">
              <div className="tournament-header">
                <h3 className="tournament-name">{tournament.name}</h3>
                <span className={`tournament-status ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </span>
              </div>
              
              <div className="tournament-details">
                <span className="tournament-game">{tournament.game}</span>
                <div className="tournament-meta">
                  <span className="meta-item">
                    <Calendar size={14} />
                    {tournament.date}
                  </span>
                  <span className="meta-item">
                    <Users size={14} />
                    {tournament.participants} teams
                  </span>
                </div>
              </div>
            </div>

            <div className="tournament-result">
              <div className="position-badge">
                <Award size={16} />
                {tournament.position}
              </div>
              <div className="prize-amount">{tournament.prize}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}