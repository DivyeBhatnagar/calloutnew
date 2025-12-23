'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import {
  SportsEsports,
  EmojiEvents,
  PlayArrow,
  ArrowBack,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config.js';

interface Game {
  id: string;
  name: string;
  title: string;
  image: string;
  description: string;
  genre: string;
  tournaments: number;
  features: string[];
}

const initialGames: Game[] = [
  {
    id: 'bgmi',
    name: 'BGMI',
    title: 'Battlegrounds Mobile India',
    image: '/Media/Game Titles/BGMI.jpeg',
    description: 'The ultimate battle royale experience on mobile. Drop into the battleground and fight to be the last one standing in this intense multiplayer game.',
    genre: 'Battle Royale',
    tournaments: 0,
    features: ['Battle Royale', 'Squad Play', 'Multiple Maps', 'Ranked Matches']
  },
  {
    id: 'cod',
    name: 'Call of Duty Mobile',
    title: 'Call of Duty: Mobile',
    image: '/Media/Game Titles/COD.png',
    description: 'Experience the thrill of Call of Duty on mobile with iconic maps, weapons, and characters from the legendary franchise.',
    genre: 'First-Person Shooter',
    tournaments: 0,
    features: ['Multiplayer', 'Battle Royale', 'Zombies Mode', 'Ranked Play']
  },
  {
    id: 'valorant',
    name: 'VALORANT',
    title: 'VALORANT',
    image: '/Media/Game Titles/Valorant.png',
    description: 'A character-based tactical FPS where precise gunplay meets unique agent abilities. Compete in the ultimate test of skill and strategy.',
    genre: 'Tactical Shooter',
    tournaments: 0,
    features: ['Tactical Gameplay', 'Unique Agents', 'Competitive Ranked', 'Esports Ready']
  },
  {
    id: 'freefire',
    name: 'Free Fire MAX',
    title: 'Free Fire MAX',
    image: '/Media/Game Titles/FREEFIRE_MAX.png',
    description: 'The enhanced version of the popular battle royale game with improved graphics, new features, and intense matches.',
    genre: 'Battle Royale',
    tournaments: 0,
    features: ['Enhanced Graphics', 'Fast-Paced Action', 'Character System', 'Guild Wars']
  }
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>(initialGames);
  const router = useRouter();

  // Fetch real-time tournament counts
  useEffect(() => {
    const fetchTournamentCounts = async () => {
      try {
        const tournamentsRef = collection(db, 'tournaments');
        const tournamentsSnapshot = await getDocs(tournamentsRef);
        
        const tournamentCounts: { [key: string]: number } = {};
        
        tournamentsSnapshot.forEach((doc) => {
          const tournament = doc.data();
          const gameName = tournament.game?.toLowerCase();
          
          if (gameName) {
            // Map tournament game names to our game IDs
            let gameId = '';
            if (gameName.includes('bgmi') || gameName.includes('battlegrounds')) {
              gameId = 'bgmi';
            } else if (gameName.includes('cod') || gameName.includes('call of duty')) {
              gameId = 'cod';
            } else if (gameName.includes('valorant')) {
              gameId = 'valorant';
            } else if (gameName.includes('free fire') || gameName.includes('freefire')) {
              gameId = 'freefire';
            }
            
            if (gameId) {
              tournamentCounts[gameId] = (tournamentCounts[gameId] || 0) + 1;
            }
          }
        });

        // Update games with real tournament counts
        setGames(prevGames => 
          prevGames.map(game => ({
            ...game,
            tournaments: tournamentCounts[game.id] || 0
          }))
        );
      } catch (error) {
        console.error('Error fetching tournament counts:', error);
      }
    };

    fetchTournamentCounts();
  }, []);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  const handleJoinTournament = () => {
    router.push('/authentication/login');
  };

  if (selectedGame) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <Box sx={{ mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBackToGames}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  bgcolor: '#f8faff',
                },
              }}
            >
              Back to Games
            </Button>
          </Box>

          {/* Game Details */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
                  boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                  border: '1px solid #f0f0f0',
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={selectedGame.image}
                  alt={selectedGame.title}
                  sx={{ objectFit: 'cover' }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 2 }}>
                  {selectedGame.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Chip
                    label={selectedGame.genre}
                    sx={{
                      background: '#e3f2fd',
                      color: '#1976d2',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Typography variant="body1" sx={{ color: '#666', mb: 4, lineHeight: 1.6 }}>
                  {selectedGame.description}
                </Typography>

                {/* Features */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Game Features
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedGame.features.map((feature, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={feature}
                          variant="outlined"
                          sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                              bgcolor: '#f8faff',
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Tournament Info */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    color: 'white',
                    mb: 4,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmojiEvents sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Active Tournaments
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {selectedGame.tournaments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    tournaments available for registration
                  </Typography>
                </Paper>

                {/* Action Button */}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleJoinTournament}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 2,
                    fontSize: 18,
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    boxShadow: '4px 4px 8px rgba(25, 118, 210, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      boxShadow: '6px 6px 12px rgba(25, 118, 210, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Join Tournament
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
      py: 8
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 3,
            }}
          >
            Featured Games
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#666',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Compete in the most popular esports titles and showcase your skills
          </Typography>
        </Box>

        {/* Games Grid */}
        <Grid container spacing={4}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={game.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
                  boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => handleGameSelect(game)}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={game.image}
                  alt={game.title}
                  sx={{ 
                    objectFit: 'contain',
                    objectPosition: 'center',
                    backgroundColor: '#f8f9fa',
                    p: 2
                  }}
                />
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: '#1a1a1a',
                      mb: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    {game.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      mb: 3,
                      lineHeight: 1.5,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {game.description}
                  </Typography>

                  {/* Game Stats */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                    <Chip
                      label={game.genre}
                      size="small"
                      sx={{
                        background: '#e3f2fd',
                        color: '#1976d2',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Tournament Count */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <EmojiEvents sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {game.tournaments} Active Tournaments
                    </Typography>
                  </Box>

                  {/* Action Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SportsEsports />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      boxShadow: '4px 4px 8px rgba(25, 118, 210, 0.2)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        boxShadow: '6px 6px 12px rgba(25, 118, 210, 0.3)',
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Paper
            sx={{
              p: 6,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              boxShadow: '8px 8px 16px rgba(25, 118, 210, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Compete?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of players in exciting esports tournaments
            </Typography>
            <Button
              component={Link}
              href="/authentication/register"
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 2,
                px: 4,
                fontSize: 18,
                background: '#FFFFFF',
                color: '#1976d2',
                '&:hover': {
                  background: '#f8faff',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Get Started Now
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}