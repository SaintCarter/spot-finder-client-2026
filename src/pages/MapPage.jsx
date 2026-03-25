import SpotPreview from '../components/SpotPreview';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';



export default function MapPage() {
    const [SpotId, setSpotId] = useState(null);
    const navigate = useNavigate();

    return (
        <Box sx={{ 
        height: 'auto', 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: '#3d3d3d',
        flexDirection:"column",
        p:2
        }}>
            <Button onClick={() => navigate('/dashboard/create')} variant="contained" component="label" fullWidth sx={{ mb: 1 }}>Create</Button>
            <SpotPreview setSpotId={setSpotId} />
        </Box>
    );
}