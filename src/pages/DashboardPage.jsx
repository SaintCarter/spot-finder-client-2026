import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';

export default function DashboardPage() {
const apiUrl = import.meta.env.VITE_API_URL;
  const { logout, user } = useAuth();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/api/userData/dashboard-data`, {
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        // If the server says NO, we clear the local state and redirect
        logout(); 
        navigate('/');
      }
    };

    fetchData();
  }, [logout, navigate]);

  if (!data) return <p>Loading secure data...</p>;

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column",}}>
        <Box sx={{width:"100%",display:"flex", justifyContent:"space-between", alignItems:"center", bgcolor:"#b88888", p:1, borderRadius:1}}>
          <Typography sx={{ fontWeight: 'bold' }}>cash: x </Typography>
          <Typography sx={{ fontWeight: 'bold' }}>Spin the Wheel</Typography>
          <Box component={'img'} src={data.image} alt={'skateboard'} sx={{width:"auto", height:60, objectFit:"contain"}}></Box>
        </Box>
        <Box sx={{width:"100%",display:"flex", justifyContent:"space-around", alignItems:"center", mt:2, bgcolor:"#C44444", p:2, borderRadius:1, gap:2}}>
          <Box sx={{"&:hover": { filter: "brightness(1.2)", transform: "scale(1.02)"}, cursor:"pointer", color:"white", minHeight:"80vh", width:"33%", justifyContent:"center", alignItems:"center", display:"flex", backgroundImage:"url('/images/reels.webp')", backgroundRepeat:"none", backgroundSize:"cover", backgroundPosition:"center", }}>
            <Typography sx={{width:"100%", textAlign:"center"}}>REELS</Typography>
          </Box>
          <Box onClick={() => navigate('/dashboard/map')} sx={{"&:hover": { filter: "brightness(1.2)", transform: "scale(1.02)"}, cursor:"pointer", color:"white", minHeight:"80vh", width:"33%", justifyContent:"center", alignItems:"center", display:"flex", backgroundImage:"url('/images/map.webp')", backgroundRepeat:"none", backgroundSize:"cover", backgroundPosition:"center", }}>
            <Typography sx={{width:"100%", textAlign:"center"}}>MAP</Typography>
          </Box>
          <Box onClick={() => navigate('/dashboard/create')} sx={{"&:hover": { filter: "brightness(1.2)", transform: "scale(1.02)"}, cursor:"pointer", color:"white", minHeight:"80vh", width:"33%", justifyContent:"center", alignItems:"center", display:"flex", backgroundImage:"url('/images/create.webp')", backgroundRepeat:"none", backgroundSize:"cover", backgroundPosition:"center", }}>
            <Typography sx={{width:"100%", textAlign:"center"}}>CREATE</Typography>
          </Box>
          
        </Box>
      </Box>
    </Box>
  );
}