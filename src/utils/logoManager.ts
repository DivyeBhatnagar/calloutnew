/**
 * Logo Management System
 * Handles logo URLs for tournaments, colleges, and games
 * Provides fallbacks and structured asset management
 */

// Base paths for different types of logos
const LOGO_PATHS = {
  tournaments: '/Media/Logo',
  colleges: '/Media/Colleges',
  games: '/Media/Game Titles',
  fallback: '/Media/Logo'
};

// Predefined college logos mapping
const COLLEGE_LOGOS: Record<string, string> = {
  'IILM': '/Media/Colleges/IILM.png',
  'IILM University': '/Media/Colleges/IILM.png',
  'IIMT': '/Media/Colleges/IIMT.png',
  'IIMT College': '/Media/Colleges/IIMT.png',
  'NIET': '/Media/Colleges/NIET.jpg',
  'NIET Greater Noida': '/Media/Colleges/NIET.jpg',
};

// Predefined game logos mapping
const GAME_LOGOS: Record<string, string> = {
  'BGMI': '/Media/Game Titles/BGMI.jpeg',
  'COD': '/Media/Game Titles/COD.png',
  'Call of Duty': '/Media/Game Titles/COD.png',
  'Call of Duty Mobile': '/Media/Game Titles/COD.png',
  'Free Fire MAX': '/Media/Game Titles/FREEFIRE_MAX.png',
  'FREEFIRE_MAX': '/Media/Game Titles/FREEFIRE_MAX.png',
  'VALORANT': '/Media/Game Titles/Valorant.png',
  'Valorant': '/Media/Game Titles/Valorant.png',
};

// Default tournament logo
const DEFAULT_TOURNAMENT_LOGO = '/Media/Logo/Logo2.png';

/**
 * Get college logo URL with fallback
 */
export const getCollegeLogo = (collegeName: string): string => {
  // Check for exact match
  if (COLLEGE_LOGOS[collegeName]) {
    return COLLEGE_LOGOS[collegeName];
  }
  
  // Check for partial match (case insensitive)
  const normalizedName = collegeName.toLowerCase();
  for (const [key, value] of Object.entries(COLLEGE_LOGOS)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Generate SVG fallback with college initial
  return generateSVGLogo(collegeName, '#1976d2');
};

/**
 * Get game logo URL with fallback
 */
export const getGameLogo = (gameName: string): string => {
  // Check for exact match
  if (GAME_LOGOS[gameName]) {
    return GAME_LOGOS[gameName];
  }
  
  // Check for partial match (case insensitive)
  const normalizedName = gameName.toLowerCase();
  for (const [key, value] of Object.entries(GAME_LOGOS)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Generate SVG fallback with game initial
  return generateSVGLogo(gameName, '#2e7d32');
};

/**
 * Get tournament logo URL with fallback
 */
export const getTournamentLogo = (tournamentName?: string): string => {
  if (tournamentName) {
    // For now, use default tournament logo or generate one
    return DEFAULT_TOURNAMENT_LOGO;
  }
  return DEFAULT_TOURNAMENT_LOGO;
};

/**
 * Generate SVG logo with text
 */
export const generateSVGLogo = (text: string, backgroundColor: string = '#1976d2'): string => {
  const initial = text.charAt(0).toUpperCase();
  const svg = `
    <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" fill="${backgroundColor}" rx="8"/>
      <text x="30" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            text-anchor="middle" fill="white">${initial}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Get all available college options with logos
 */
export const getAvailableColleges = () => {
  return Object.keys(COLLEGE_LOGOS).map(name => ({
    id: `college_${name.toLowerCase().replace(/\s+/g, '_')}`,
    name,
    logoUrl: COLLEGE_LOGOS[name]
  }));
};

/**
 * Get all available game options with logos
 */
export const getAvailableGames = () => {
  return Object.keys(GAME_LOGOS).map(name => ({
    id: `game_${name.toLowerCase().replace(/\s+/g, '_')}`,
    name,
    logoUrl: GAME_LOGOS[name]
  }));
};

/**
 * Validate if logo URL is accessible
 */
export const validateLogoUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get logo with validation and fallback
 */
export const getValidatedLogo = async (
  name: string, 
  type: 'college' | 'game' | 'tournament'
): Promise<string> => {
  let logoUrl: string;
  
  switch (type) {
    case 'college':
      logoUrl = getCollegeLogo(name);
      break;
    case 'game':
      logoUrl = getGameLogo(name);
      break;
    case 'tournament':
      logoUrl = getTournamentLogo(name);
      break;
    default:
      logoUrl = generateSVGLogo(name);
  }
  
  // If it's not an SVG (data URL), validate it
  if (!logoUrl.startsWith('data:')) {
    const isValid = await validateLogoUrl(logoUrl);
    if (!isValid) {
      const color = type === 'game' ? '#2e7d32' : '#1976d2';
      return generateSVGLogo(name, color);
    }
  }
  
  return logoUrl;
};