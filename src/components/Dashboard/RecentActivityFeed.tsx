'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
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
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
}

export default function RecentActivityFeed() {
  const { user, userProfile } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Generate recent activities based on user data
    const recentActivities: ActivityItem[] = [];

    // Welcome message for new users
    if (user) {
      recentActivities.push({
        id: 'welcome',
        type: 'welcome',
        message: 'Welcome to CallOut Esports! 🎮',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        icon: <PersonAdd />,
        color: '#1976d2',
      });
    }

    // Tournament registration activity
    if (userProfile?.stats?.tournamentsParticipated > 0) {
      recentActivities.push({
        id: 'tournament_reg',
        type: 'registration',
        message: 'Successfully registered for Campus Showdown',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        icon: <EmojiEvents />,
        color: '#2e7d32',
      });
    }

    // Rank achievement
    const currentRank = userProfile?.stats?.currentRank || 'Bronze';
    if (currentRank !== 'Bronze') {
      recentActivities.push({
        id: 'rank_up',
        type: 'rank_up',
        message: `Achieved ${currentRank} rank! 🏆`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
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
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        icon: <CheckCircle />,
        color: '#9c27b0',
      });
    }

    // Sort by timestamp and take only 3 most recent
    const sortedActivities = recentActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);

    setActivities(sortedActivities);
  }, [user, userProfile]);

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

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
                  secondary={
                    <Chip
                      label={getTimeAgo(activity.timestamp)}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        background: '#f5f5f5',
                        color: '#666',
                        mt: 0.5,
                      }}
                    />
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