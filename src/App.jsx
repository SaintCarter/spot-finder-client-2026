import { Outlet, useNavigate, Link as RouterLink } from 'react-router';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  CircularProgress,
  Link
} from '@mui/material';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, logout, loading, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Send them home after logging out
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Modern Navigation Bar */}
      <AppBar position="static" elevation={2} sx={{borderRadius:1.5, backgroundColor:'#3d3d3d'}}>
        <Toolbar>
          <Typography 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 700,
              "@media (max-width:600px)": {display:"none"}
            }}
          >
            SPOTFINDER
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:"center", gap: 2 ,}}>

            {isAuthenticated && (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard" sx={{minWidth:"auto", fontSize:"0.75rem", px:1}}>
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/settings" sx={{minWidth:"auto", fontSize:"0.75rem", px:1}}>
                  Settings
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ borderColor: 'rgba(255,255,255,0.5)', minWidth:"auto", fontSize:"0.75rem", px:1}}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container component="main" sx={{ flexGrow: 1, py: 2 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: '#3d3d3d', mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Spot Finder Inc.
        </Typography>
      </Box>
    </Box>
  );
}