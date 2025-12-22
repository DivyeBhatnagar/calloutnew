'use client';

import { motion } from 'framer-motion';

export default function FeaturedGamesSection() {
  const games = [
    {
      name: 'BGMI',
      logo: '/Media/Game Titles/BGMI.jpeg'
    },
    {
      name: 'Free Fire',
      logo: '/Media/Game Titles/FREEFIRE_MAX.png'
    },
    {
      name: 'Valorant',
      logo: '/Media/Game Titles/Valorant.png'
    },
    {
      name: 'Call of Duty',
      logo: '/Media/Game Titles/COD.png'
    }
  ];

  // Create 15 copies of 4 games = 60 tiles total
  const duplicatedGames = Array(15).fill(games).flat();

  return (
    <section className="section-spacing" style={{backgroundColor: '#f0f4ff'}}>
      <div className="main-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading mb-6">
            Featured Games
          </h2>
          <p className="text-gray-500 text-lg">
            Tournaments hosted across top competitive titles
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="marquee-wrapper">
          <div className="marquee-container">
            {duplicatedGames.map((game, index) => (
              <div
                key={`${game.name}-${index}`}
                className="game-tile"
              >
                <div className="game-tile-inner">
                  <img
                    src={game.logo}
                    alt={game.name}
                    className="game-logo"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}