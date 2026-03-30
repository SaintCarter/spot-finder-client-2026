import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // You'll need to install @mui/icons-material
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);
  const [email, setEmail] = useState('');
  const [imageError, setImageError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');


  const { login, createAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');
    setUsernameError('');
    setEmailError('');
    setIsSubmitting(true);
    
    if (!hasAccount) {
      // Create account logic
      if (username.length < 3 || username.length > 30) {
        setUsernameError(`Username must be between 3 and 30 characters. your username is ${username.length} characters long`);
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 10 || password.length > 20) {
        setPasswordError(`Password must be between 10 and 20 characters. your password is ${password.length} characters long`);
        setIsSubmitting(false);
        return;
      }
      if (!email) {
        setEmailError('Email is required');
        setIsSubmitting(false);
        return;
      }
      if(!username){
        setUsernameError('Username is required');
        setIsSubmitting(false);
        return;
      }
      if (!password || !confirmPassword) {
        setPasswordError('All password fields are required');
        setIsSubmitting(false);
        return;
      }
      
      const result = await createAccount(username, password, email);
      if (result.success) {
        setError('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setUsernameError('');
        setEmailError('');
        setHasAccount(true);
        setIsSubmitting(false);
        return;
      } else {
        setError(result.error || 'Failed to create account');
        setIsSubmitting(false);
        return;
      }
    }
    
    // Sign in logic
    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setIsSubmitting(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      bgcolor: '#3d3d3d' // Light grey background makes the white card pop
    }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            {hasAccount ? 'Welcome Back' : 'Create Account'}
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!usernameError}
              helperText={usernameError}
              sx={{ mb: 1 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              sx={{ mb: hasAccount ? 3 : 1 }}
            />

            {!hasAccount && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError || 'We Accept Fake Email! :)'}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ py: 1.5, textTransform: 'none', fontSize: '1.1rem', borderRadius: 2, mb: 2 }}
            >
              {isSubmitting ? <CircularProgress size={26} color="inherit" /> : (hasAccount ? 'Sign In' : 'Create Account')}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              {hasAccount ? (
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Button
                    onClick={() => {
                      setHasAccount(false);
                      setError('');
                    }}
                    sx={{ textTransform: 'none', p: 0, fontSize: '0.875rem' }}
                  >
                    Create Account
                  </Button>
                </Typography>
              ) : (
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Button
                    onClick={() => {
                      setHasAccount(true);
                      setError('');
                    }}
                    sx={{ textTransform: 'none', p: 0, fontSize: '0.875rem' }}
                  >
                    Sign In
                  </Button>
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}