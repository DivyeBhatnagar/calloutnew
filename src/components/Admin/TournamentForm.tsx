'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Grid,
  Alert,
  Chip,
  Paper,
} from '@mui/material';
import {
  Add,
  Delete,
  CloudUpload,
  Image as ImageIcon,
} from '@mui/icons-material';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { getCollegeLogo, getGameLogo, getTournamentLogo, getAvailableColleges, getAvailableGames } from '../../utils/logoManager';

interface College {
  id: string;
  name: string;
  logoUrl: string;
}

interface Game {
  id: string;
  name: string;
  logoUrl: string;
}

interface Tournament {
  id?: string;
  name: string;
  logoUrl?: string;
  description?: string;
  status: 'draft' | 'active' | 'closed';
  maxSlots: number;
  currentRegistrations?: number;
  createdAt: string;
  updatedAt: string;
  colleges: College[];
  games: Game[];
}

interface TournamentFormProps {
  open: boolean;
  onClose: () => void;
  tournament?: Tournament | null;
  onSuccess: () => void;
}

export default function TournamentForm({ open, onClose, tournament, onSuccess }: TournamentFormProps) {
  const [formData, setFormData] = useState<Tournament>({
    name: '',
    logoUrl: '',
    description: '',
    status: 'draft',
    maxSlots: 50,
    currentRegistrations: 0,
    createdAt: '',
    updatedAt: '',
    colleges: [],
    games: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  // College form state
  const [newCollege, setNewCollege] = useState({ name: '', logoFile: null as File | null });
  const [collegeLogoPreview, setCollegeLogoPreview] = useState('');
  const [addingCollege, setAddingCollege] = useState(false);

  // Game form state
  const [newGame, setNewGame] = useState({ name: '', logoFile: null as File | null });
  const [gameLogoPreview, setGameLogoPreview] = useState('');
  const [addingGame, setAddingGame] = useState(false);

  useEffect(() => {
    if (tournament) {
      setFormData(tournament);
      setLogoPreview(tournament.logoUrl || '');
    } else {
      setFormData({
        name: '',
        logoUrl: '',
        description: '',
        status: 'draft',
        maxSlots: 50,
        currentRegistrations: 0,
        createdAt: '',
        updatedAt: '',
        colleges: [],
        games: [],
      });
      setLogoPreview('');
    }
    setError('');
    setLogoFile(null);
    setNewCollege({ name: '', logoFile: null });
    setCollegeLogoPreview('');
    setNewGame({ name: '', logoFile: null });
    setGameLogoPreview('');
    setAddingCollege(false);
    setAddingGame(false);
  }, [tournament, open]);

  const handleInputChange = (field: keyof Tournament, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Tournament logo must be an image file (JPG, JPEG, PNG, SVG, etc.)');
        return;
      }
      setError(''); // Clear any existing errors
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      console.log('Tournament logo selected:', file.name, 'Type:', file.type);
    }
  };

  const handleCollegeLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('College logo must be an image file (JPG, JPEG, PNG, SVG, etc.)');
        return;
      }
      setError(''); // Clear any existing errors
      setNewCollege(prev => ({ ...prev, logoFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => setCollegeLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      console.log('College logo selected:', file.name, 'Type:', file.type);
    }
  };

  const handleGameLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Game logo must be an image file (JPG, JPEG, PNG, SVG, etc.)');
        return;
      }
      setError(''); // Clear any existing errors
      setNewGame(prev => ({ ...prev, logoFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => setGameLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      console.log('Game logo selected:', file.name, 'Type:', file.type);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      console.log('Attempting to upload file:', file.name, 'to path:', path);
      
      if (!storage) {
        throw new Error('Firebase Storage is not initialized');
      }
      
      const storageRef = ref(storage, path);
      console.log('Storage reference created:', storageRef.fullPath);
      
      const snapshot = await uploadBytes(storageRef, file);
      console.log('File uploaded successfully:', snapshot.ref.fullPath);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Upload error details:', error);
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddCollege = async () => {
    if (!newCollege.name.trim()) {
      setError('Please provide college name');
      return;
    }

    try {
      setAddingCollege(true);
      setError('');
      
      console.log('Adding college:', newCollege.name);
      
      // Use logo manager to get appropriate logo
      const logoUrl = getCollegeLogo(newCollege.name.trim());

      const college: College = {
        id: `college_${Date.now()}`,
        name: newCollege.name.trim(),
        logoUrl,
      };

      console.log('Creating college object:', college);

      setFormData(prev => ({
        ...prev,
        colleges: [...prev.colleges, college],
      }));

      // Clear the form
      setNewCollege({ name: '', logoFile: null });
      setCollegeLogoPreview('');
      
      console.log('✅ College added successfully:', college.name);
      console.log('Logo URL:', logoUrl);
      
    } catch (error) {
      console.error('❌ Error adding college:', error);
      setError('Failed to add college. Please try again.');
    } finally {
      setAddingCollege(false);
    }
  };

  const handleAddGame = async () => {
    if (!newGame.name.trim()) {
      setError('Please provide game name');
      return;
    }

    try {
      setAddingGame(true);
      setError('');
      
      console.log('Adding game:', newGame.name);
      
      // Use logo manager to get appropriate logo
      const logoUrl = getGameLogo(newGame.name.trim());

      const game: Game = {
        id: `game_${Date.now()}`,
        name: newGame.name.trim(),
        logoUrl,
      };

      console.log('Creating game object:', game);

      setFormData(prev => ({
        ...prev,
        games: [...prev.games, game],
      }));

      // Clear the form
      setNewGame({ name: '', logoFile: null });
      setGameLogoPreview('');
      
      console.log('✅ Game added successfully:', game.name);
      console.log('Logo URL:', logoUrl);
      
    } catch (error) {
      console.error('❌ Error adding game:', error);
      setError('Failed to add game. Please try again.');
    } finally {
      setAddingGame(false);
    }
  };

  const handleRemoveCollege = (collegeId: string) => {
    setFormData(prev => ({
      ...prev,
      colleges: prev.colleges.filter(c => c.id !== collegeId),
    }));
  };

  const handleRemoveGame = (gameId: string) => {
    setFormData(prev => ({
      ...prev,
      games: prev.games.filter(g => g.id !== gameId),
    }));
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      logoUrl: '',
      description: '',
      status: 'draft',
      maxSlots: 50,
      currentRegistrations: 0,
      createdAt: '',
      updatedAt: '',
      colleges: [],
      games: [],
    });
    setLogoPreview('');
    setLogoFile(null);
    setNewCollege({ name: '', logoFile: null });
    setCollegeLogoPreview('');
    setNewGame({ name: '', logoFile: null });
    setGameLogoPreview('');
    setError('');
    console.log('Form cleared');
  };

  const handleSubmit = async (status: 'draft' | 'active') => {
    // Clear any existing errors
    setError('');
    
    // Validation
    if (!formData.name.trim()) {
      setError('Tournament name is required');
      return;
    }

    if (formData.colleges.length === 0) {
      setError('At least one college is required. Please add a college before saving.');
      return;
    }

    if (formData.games.length === 0) {
      setError('At least one game is required. Please add a game before saving.');
      return;
    }

    try {
      setLoading(true);
      console.log(`Saving tournament as ${status}...`);

      let logoUrl = formData.logoUrl;
      if (logoFile) {
        // For now, use tournament logo manager
        console.log('Using tournament logo manager');
        logoUrl = getTournamentLogo(formData.name);
      } else if (!logoUrl) {
        // If no logo is set, use default tournament logo
        logoUrl = getTournamentLogo(formData.name);
      }

      const tournamentData = {
        ...formData,
        name: formData.name.trim(),
        logoUrl,
        status,
        updatedAt: new Date().toISOString(),
      };

      if (tournament?.id) {
        // Update existing tournament
        await updateDoc(doc(db, 'tournaments', tournament.id), tournamentData);
        console.log(`✅ Tournament "${formData.name}" updated successfully`);
      } else {
        // Create new tournament
        tournamentData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'tournaments'), tournamentData);
        console.log(`✅ Tournament "${formData.name}" created successfully`);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving tournament:', error);
      setError(`Failed to save tournament: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {tournament ? 'Edit Tournament' : 'Create New Tournament'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Basic Tournament Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. Basic Tournament Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tournament Name *"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Slots *"
                type="number"
                value={formData.maxSlots}
                onChange={(e) => handleInputChange('maxSlots', parseInt(e.target.value) || 50)}
                inputProps={{ min: 1, max: 1000 }}
                helperText="Maximum number of teams that can register"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Tournament Logo (Any Image Format)
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2, borderRadius: 2 }}
                  fullWidth
                >
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleLogoUpload}
                  />
                </Button>
                {logoPreview && (
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={logoPreview}
                      alt="Tournament Logo"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'contain',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        setLogoPreview('');
                        setLogoFile(null);
                      }}
                      sx={{ display: 'block', mt: 1, mx: 'auto' }}
                    >
                      Remove Logo
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>

        {/* College Setup */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. College Setup
          </Typography>

          {/* Add New College */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Add College
            </Typography>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="College Name *"
                  value={newCollege.name}
                  onChange={(e) => setNewCollege(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImageIcon />}
                    sx={{ borderRadius: 2, mb: 1 }}
                    fullWidth
                  >
                    {collegeLogoPreview ? 'Change Logo' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleCollegeLogoUpload}
                    />
                  </Button>
                  {collegeLogoPreview && (
                    <Box sx={{ textAlign: 'center' }}>
                      <img
                        src={collegeLogoPreview}
                        alt="College Logo"
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: 'contain',
                          borderRadius: 4,
                          border: '1px solid #ddd',
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          setCollegeLogoPreview('');
                          setNewCollege(prev => ({ ...prev, logoFile: null }));
                        }}
                        sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddCollege}
                  disabled={!newCollege.name.trim() || addingCollege}
                  sx={{ borderRadius: 2 }}
                >
                  {addingCollege ? 'Adding...' : 'Add College'}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Colleges List */}
          {formData.colleges.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Added Colleges ({formData.colleges.length})
              </Typography>
              <Grid container spacing={2}>
                {formData.colleges.map((college) => (
                  <Grid item xs={12} sm={6} md={4} key={college.id}>
                    <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Box sx={{ position: 'relative' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveCollege(college.id)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: '#f44336',
                              color: 'white',
                              '&:hover': { bgcolor: '#d32f2f' },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                          <img
                            src={college.logoUrl}
                            alt={college.name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: 'contain',
                              borderRadius: 8,
                              marginBottom: 8,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {college.name}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>

        {/* Game Setup */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. Game Selection
          </Typography>

          {/* Add New Game */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Add Game
            </Typography>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Game Name *"
                  value={newGame.name}
                  onChange={(e) => setNewGame(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImageIcon />}
                    sx={{ borderRadius: 2, mb: 1 }}
                    fullWidth
                  >
                    {gameLogoPreview ? 'Change Logo' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleGameLogoUpload}
                    />
                  </Button>
                  {gameLogoPreview && (
                    <Box sx={{ textAlign: 'center' }}>
                      <img
                        src={gameLogoPreview}
                        alt="Game Logo"
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: 'contain',
                          borderRadius: 4,
                          border: '1px solid #ddd',
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          setGameLogoPreview('');
                          setNewGame(prev => ({ ...prev, logoFile: null }));
                        }}
                        sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddGame}
                  disabled={!newGame.name.trim() || addingGame}
                  sx={{ borderRadius: 2 }}
                >
                  {addingGame ? 'Adding...' : 'Add Game'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
          {/* Games List */}
          {formData.games.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Added Games ({formData.games.length})
              </Typography>
              <Grid container spacing={2}>
                {formData.games.map((game) => (
                  <Grid item xs={12} sm={6} md={4} key={game.id}>
                    <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Box sx={{ position: 'relative' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveGame(game.id)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: '#f44336',
                              color: 'white',
                              '&:hover': { bgcolor: '#d32f2f' },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                          <img
                            src={game.logoUrl}
                            alt={game.name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: 'contain',
                              borderRadius: 8,
                              marginBottom: 8,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {game.name}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {!tournament && (
          <Button
            variant="outlined"
            onClick={handleClearForm}
            disabled={loading}
            sx={{ borderRadius: 2, color: '#666' }}
          >
            Clear Form
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={() => handleSubmit('draft')}
          disabled={loading || addingCollege || addingGame}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          variant="contained"
          onClick={() => handleSubmit('active')}
          disabled={loading || addingCollege || addingGame}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Publishing...' : 'Publish Tournament'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}