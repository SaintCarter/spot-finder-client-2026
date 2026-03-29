import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';
import AddBoard  from '../components/AddBoard.jsx';

export default function SettingsPage() {

  return (
    <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column",}}>
      <AddBoard />
    </Box>
  );
}