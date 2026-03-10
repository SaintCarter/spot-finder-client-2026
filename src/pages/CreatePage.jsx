import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';


export default function CreatePage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { logout, user } = useAuth();
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    return (
      <Box sx={{width:"100%", height:"90vh", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column",}}>
            <Box sx={{width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",}}>
                <Box onClick={() => navigate('/dashboard/create/spot')} sx={{"&:hover": { filter: "brightness(1.2)", transform: "scale(1.02)"}, cursor:"pointer", filter:"brightness(0.8)",  width:"100%", minHeight:"40vh", bgcolor:"blue", display:"flex", justifyContent:"center", alignItems:"center",  backgroundImage:"url('/images/spot.jpg')", backgroundRepeat:"none", backgroundSize:"cover", backgroundPosition:"center", }}>
                    <Typography sx={{fontWeight:'bold', fontSize:24, color:'white'}}>CREATE SPOT</Typography>
                </Box>
                <Box onClick={() => navigate('/dashboard/create/post')} sx={{"&:hover": { filter: "brightness(1.2)", transform: "scale(1.02)"}, cursor:"pointer", filter:"brightness(0.8)",  width:"100%", minHeight:"40vh", bgcolor:"blue", display:"flex", justifyContent:"center", alignItems:"center",  backgroundImage:"url('/images/post.jpg')", backgroundRepeat:"none", backgroundSize:"cover", backgroundPosition:"center", }}>
                    <Typography sx={{fontWeight:'bold', fontSize:24, color:'white'}}>CREATE POST</Typography>
                </Box>
            </Box>
        </Box>

    );
    
}
