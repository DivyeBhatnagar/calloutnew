'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PerformanceChart() {
  const performanceData = [
    { month: 'Jul', wins: 8, losses: 4 },
    { month: 'Aug', wins: 12, losses: 3 },
    { month: 'Sep', wins: 10, losses: 5 },
    { month: 'Oct', wins: 15, losses: 2 },
    { month: 'Nov', wins: 18, losses: 4 },
    { month: 'Dec', wins: 22, losses: 3 }
  ];

  const maxValue = Math.max(...performanceData.map(d => Math.max(d.wins, d.losses)));

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="card-title">Performance Overview</h2>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color wins"></div>
            <span>Wins</span>
          </div>
          <div className="legend-item">
            <div className="legend-color losses"></div>
            <span>Losses</span>
          </div>
        </div>
      </div>

      <div className="performance-stats">
        <div className="stat-item">
          <div className="stat-value">87%</div>
          <div className="stat-label">
            <TrendingUp size={16} className="text-green-500" />
            Win Rate
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-value">105</div>
          <div className="stat-label">Total Matches</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">+12%</div>
          <div className="stat-label">
            <TrendingUp size={16} className="text-green-500" />
            This Month
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-grid">
          {performanceData.map((data, index) => (
            <motion.div
              key={data.month}
              className="chart-bar-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="chart-bars">
                <motion.div
                  className="chart-bar wins-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.wins / maxValue) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                >
                  <div className="bar-value">{data.wins}</div>
                </motion.div>
                <motion.div
                  className="chart-bar losses-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.losses / maxValue) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                >
                  <div className="bar-value">{data.losses}</div>
                </motion.div>
              </div>
              <div className="chart-label">{data.month}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}