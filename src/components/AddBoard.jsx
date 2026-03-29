import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';

export default function AddBoard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [boardUrl, setBoardUrl] = useState('');
  const [loading, setLoading] =  useState(false);
  const [confirming, setConfirming] = useState(false);


  useEffect(() => {
    if (selectedFile) {
      handleSave();
    }
  }, [selectedFile]);

  const handleCancel = () => {
    setSelectedFile(null);
    setBoardUrl('');
    setConfirming(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/userData/add-board`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ boardUrl: boardUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to add board');
      }
      setBoardUrl('');
      setSelectedFile(null);
      setConfirming(false);
      return;
    } catch (error) {
      console.error('Create account error:', error);
      return { success: false, error: error.response?.data?.error || "An unexpected error occurred" };
    }
  };

  const AddBoardCheck = async (formData) => {
    try {
      const response = await fetch(`${apiUrl}/api/userData/add-board-check`, {
        method: 'POST',
        headers: {
        },
        credentials: 'include',
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to remove bg for board');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Create account error:', error);
      return { success: false, error: error.response?.data?.error || "An unexpected error occurred" };
    }
  }


  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setError(' picture is required');
      return;
    }


    if (selectedFile) {
      setLoading(true);
      console.log("see");
      const formData = new FormData();
      formData.append('boardImage', selectedFile);

      const result = await AddBoardCheck(formData);
      if (result.success) {
        setError('');
        setBoardUrl(result.data.boardUrl);
        setLoading(false);
        setConfirming(true);
        return;
      } else {
        setError(result.error || 'Failed to update settings');
        setLoading(false);
        return;
      }
    }
}


  return (
  <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"flex-start", flexDirection:"column",}}>
    {boardUrl && (
      <>
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
          <Typography>Would you like to save this into My Boards?</Typography>
          <Box>
            <Button onClick={() => {handleConfirm()}}>Yes</Button>
            <Button onClick={() => {handleCancel()}}>No</Button>
          </Box>
          <Box component={'img'} src={boardUrl} alt={'skateboard'} sx={{width:"auto", height:60, objectFit:"contain"}}></Box>
        </Box>
      </>
    )}
    {!confirming && (
      <Box sx={{ mb: 2, textAlign: 'center' , display:'flex'}}>
        <Button disabled={loading} variant="contained" component="label" fullWidth sx={{ mb: 1 }}>
          Upload Board Image
          <input 
            type="file" 
            hidden 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </Button>

      </Box>
    )}
    {selectedFile && (
      <Box sx={{ display:"flex", justifyContent:"center", alignItems:"center",}}>
        <Typography variant="caption" display="block">
          Selected: {selectedFile.name}
        </Typography>
      </Box>
    )}
  </Box>
  );
}