import SpotPreview from '../components/SpotPreview';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreatePost } from '../api/CreatePost.js';



export default function CreatePostPage() {
    const [spotId, setSpotId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [caption, setCaption] = useState('');
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const {  loading, user } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            window.location.reload();
        }
    }, [loading, user]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 8) {
            setError("Max 8 files allowed");
            return;
        }
        setSelectedFiles(prev => [...prev, ...files]);
        
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsSubmitting(true);
        setError('');


        if(caption.length > 200){
            setError(`caption too long. max 200 chars. currently: ${description.length} chars`);
            setIsSubmitting(false);
            return;
        }
        if (!selectedFiles.length) {
            setError('Media Required');
            setIsSubmitting(false);
            return;
        }
        if (!spotId) {
            setError('Select a spot');
            setIsSubmitting(false);
            return;
        }
        if (!user) {
            setError('log in');
            setIsSubmitting(false);
            return;
        }
        const creatorId = user.userId; 

        const formData = new FormData();
        formData.append('spotId', spotId);
        formData.append('creatorId', creatorId);
        formData.append('caption', caption);
        selectedFiles.forEach((file) => {
            formData.append('spotMedia', file);
        });

        //for (let [key, value] of formData.entries()) {
        //    console.log(key, value);
        //};
        const result = await CreatePost(formData);
        if(!result){
            console.log('failed');
        }
        if(result.success){
            console.log('success');
            setSpotId(null);
            setCaption('');
            setSelectedFiles([]);
            window.location.reload();
        }else{
            setError(result.error);
        }

        setIsSubmitting(false);
    }
    return (
        <Box sx={{ 
        height: 'auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent:"center",
        flexDirection:"column",
        p:2,
        width:"100%"
        }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width:"100%" }}>
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%'  }}>
                    <Button variant="outlined" component="label" fullWidth sx={{ mb: 1 }}>
                        Upload Media (Must be less than 50mb/file)
                        <input 
                        type="file" 
                        hidden 
                        accept="image/*, video/*"
                        multiple 
                        onChange={handleFileChange} 
                        />
                    </Button>
                    {selectedFiles.length > 0 && (
                        <Typography variant="caption" display="block">
                            {selectedFiles.length} files selected:
                            <br />
                            {selectedFiles.map((file, i) => (
                            <span key={i}>{file.name}<br /></span>
                            ))}
                        </Typography>
                    )}
                    <TextField
                    margin="normal"
                    fullWidth
                    label="Caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    sx={{ mb: 2,}}
                    multiline
                    minRows={4}
                    maxRows={10}
                    />
                    <Typography sx={{fontWeight:'bold', fontSize:24, textAlign:"center"}}>FIND THE SPOT FOR YOUR POST USING THE MAP BELOW</Typography>
                    <SpotPreview setSpotId={setSpotId} />
                    <Typography>Select Spot Id: {spotId}</Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Post Reel'}
                    </Button>
                </Box>
                
            </Paper>

        </Box>
    );
}