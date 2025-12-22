'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Gamepad2 } from 'lucide-react';

export default function UpcomingMatches() {
  const matches = [
    {
      id: 1,
      tournament: 'VALORANT Pro League',
      opponent: 'Team Phoenix',
      time: '6:00 PM',
      date: 'Today',
      map: 'Ascent',
      type: 'Quarterfinal'
    },
    {
      id: 2,
      tournament: 'CS2 Championship',
      opponent: 'Elite Squad',
      time: '8:30 PM',
      date: 'Tomorrow',
      map: 'Dust2',
      type: 'Group Stage'
    },
    {
      id: 3,
      tournament: 'BGMI Tournament',
      opponent: 'Mobile Legends',
      time: '2:00 PM',
      date: 'Dec 25',
      map: 'Erangel',
      type: 'Semifinal'
    }
  ];

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="card-title">Upcoming Matches</h2>
        <button className="card-action">Schedule</button>
      </div>

      <div className="matches-list">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            className="match-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="match-header">
              <div className="match-tournament">{match.tournament}</div>
              <div className="match-type">{match.type}</div>
            </div>

            <div className="match-vs">
              <div className="team team-you">
                <div className="team-avatar">
                  <img src="/default-avatar.svg" alt="Your Team" />
                </div>
                <span>You</span>
              </div>
              
              <div className="vs-indicator">VS</div>
              
              <div className="team team-opponent">
                <div className="team-avatar">
                  <Gamepad2 size={20} />
                </div>
                <span>{match.opponent}</span>
              </div>
            </div>

            <div className="match-details">
              <div className="match-info">
                <span className="info-item">
                  <Clock size={14} />
                  {match.date} at {match.time}
                </span>
                <span className="info-item">
                  <MapPin size={14} />
                  {match.map}
                </span>
              </div>
              
              <button className="match-join-btn">
                Join Match
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="matches-footer">
        <button className="btn-secondary w-full">
          View All Matches
        </button>
      </div>
    </div>
  );
}