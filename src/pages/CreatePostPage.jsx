import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';


export default function CreatePostPage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { logout, user } = useAuth();
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    return (
        <Box sx={{width:"100%", height:"90vh", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column",}}>
            <Typography>POST</Typography>
        </Box>
    );
    
}
