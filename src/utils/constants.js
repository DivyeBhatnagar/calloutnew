// Application constants

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DASHBOARD: '/dashboard',
  LOGIN: '/authentication/login',
  REGISTER: '/authentication/register',
  FORGOT_PASSWORD: '/authentication/forgot-password',
  TOURNAMENTS: '/dashboard/tournaments',
  MATCHES: '/dashboard/matches',
  STATS: '/dashboard/stats',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
};

export const USER_ROLES = {
  GAMER: 'gamer',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

export const GAME_TYPES = {
  VALORANT: 'VALORANT',
  CS2: 'CS2',
  BGMI: 'BGMI',
  FREE_FIRE: 'FREE_FIRE',
};

export const TOURNAMENT_STATUS = {
  OPEN: 'Open',
  LIVE: 'Live',
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const MATCH_STATUS = {
  SCHEDULED: 'Scheduled',
  LIVE: 'Live',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const RANKS = {
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
  DIAMOND: 'Diamond',
  IMMORTAL: 'Immortal',
  RADIANT: 'Radiant',
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  WEAK_PASSWORD: 'Password must be at least 6 characters long',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_USERNAME: 'Username must be between 3-20 characters',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};