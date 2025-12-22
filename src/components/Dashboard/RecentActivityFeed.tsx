'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserRegistrations } from '../../firebase/firestore';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  EmojiEvents,
  PersonAdd,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';

interface ActivityItem {
  id: string;
  type: 'registration' | 'rank_up' | 'achievement' | 'welcome';
  message: string;
  icon: React.ReactNode;
  color: string;
}

export default function RecentActivityFeed() {
  const { user, userProfile } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const generateActivities = async () => {
      const recentActivities: ActivityItem[] = [];

      // Welcome message for new users
      if (user) {
        recentActivities.push({
          id: 'welcome',
          type: 'welcome',
          message: 'Welcome to CallOut Esports! 🎮',
          icon: <PersonAdd />,
          color: '#1976d2',
        });
      }

      // Tournament registration activity (from real data)
      if (user?.uid) {
        try {
          const registrations = await getUserRegistrations(user.uid);
          if (registrations.length > 0) {
            const latestRegistration = registrations[0]; // Most recent
            recentActivities.push({
              id: 'tournament_reg',
              type: 'registration',
              message: `Successfully registered for ${latestRegistration.tournament || 'Campus Showdown'}`,
              icon: <EmojiEvents />,
              color: '#2e7d32',
            });
          }
        } catch (error) {
          console.log('Could not fetch registrations for activity feed:', error);
        }
      }

      // Rank achievement
      const currentRank = userProfile?.stats?.currentRank || 'Bronze';
      if (currentRank !== 'Bronze') {
        recentActivities.push({
          id: 'rank_up',
          type: 'rank_up',
          message: `Achieved ${currentRank} rank! 🏆`,
          icon: <TrendingUp />,
          color: '#ed6c02',
        });
      }

      // Profile completion
      if (userProfile?.username) {
        recentActivities.push({
          id: 'profile_complete',
          type: 'achievement',
          message: 'Profile setup completed',
          icon: <CheckCircle />,
          color: '#9c27b0',
        });
      }

      // Take only 3 most recent
      setActivities(recentActivities.slice(0, 3));
    };

    generateActivities();
  }, [user, userProfile]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: '#FFFFFF',
        boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.06), -6px -6px 12px rgba(255, 255, 255, 0.9)',
        border: '1px solid #f0f0f0',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#333',
            mb: 2,
          }}
        >
          Recent Activity
        </Typography>

        {activities.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" sx={{ color: '#999' }}>
              No recent activity
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <ListItem
                key={activity.id}
                sx={{
                  px: 0,
                  py: 1.5,
                  borderBottom: index < activities.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: `${activity.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activity.color,
                    }}
                  >
                    {activity.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: '#333',
                        fontSize: 14,
                      }}
                    >
                      {activity.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}