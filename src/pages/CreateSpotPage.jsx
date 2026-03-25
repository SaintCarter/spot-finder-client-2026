import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel , InputLabel, Select, MenuItem
} from '@mui/material';
import Map from '../components/Map.jsx';
import { CreateSpot } from '../api/CreateSpot.js';

export default function CreateSpotPage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { logout, user, loading } = useAuth();
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState(''); 
    const [hasSecurity, setHasSecurity] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [spotTypes, setSpotTypes] = useState(null);
    const [selectedType, setSelectedType] = useState([]);
    const navigate = useNavigate();
    
    
    
    useEffect(() => {
        if (!loading && !user) {
            window.location.reload();
        }
        const fetchSpotTypes = async () => {
            const response = await fetch(`${apiUrl}/api/spotData/spot-type`, {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                setSpotTypes(result);
            } else {
                setError('cant get spot types');
            }
        };

        fetchSpotTypes();
    }, [loading, user]);


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 8) {
            setError("Max 8 files allowed");
            return;
        }
        setSelectedFiles(prev => [...prev, ...files]);
        console.log(files);
        console.log(selectedFiles);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        console.log(selectedType);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        if(!selectedType.length){
            setError('no types selected. please do that.');
            setIsSubmitting(false);
            return;
        }

        if(!user){
            setError('user?');
            setIsSubmitting(false);
            return;
        }

        const creatorId = user.userId; 

        if(!name){
            setError('missing spot name');
            setIsSubmitting(false);
            return;
        }
        if(name.length > 50){
            setError(`spot name too long. max 50 chars. currently: ${name.length} chars`);
            setIsSubmitting(false);
            return;
        }
        if(description.length > 500){
            setError(`spot description too long. max 500 chars. currently: ${description.length} chars`);
            setIsSubmitting(false);
            return;
        }
        if (!selectedFiles.length) {
            setError('Profile picture is required');
            setIsSubmitting(false);
            return;
        }
        if(!longitude || !latitude){
            setError('Location Required');
            setIsSubmitting(false);
            return;
        }
        const formData = new FormData();
        formData.append('spotname', name);
        formData.append('description', description);
        formData.append('hasSecurity', hasSecurity);
        formData.append('creatorId', creatorId);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        selectedType.forEach((type) => {
            formData.append('spottype', type);
        });

        selectedFiles.forEach((file) => {
            formData.append('spotMedia', file);
        });

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        };
        
        const result = await CreateSpot(formData);
        if(!result){
            console.log('no one there');
        }
        if(result.success){
            console.log('success');
            setName('');
            setDescription('');
            setHasSecurity(true);
            setLatitude('');
            setLongitude('');
            window.location.reload();
        }else{
            setError(result.error);
        }

        setIsSubmitting(false);
        return;
    };


    return (
        <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", color:"#ffffff", }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}                
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%'  }}>
                    <Button onClick={() => navigate('/dashboard/map')} variant="contained" component="label" fullWidth sx={{ mb: 1 }}>Go To Spot Map</Button>
                    <Box>
                        <Map setLatitude={setLatitude} setLongitude={setLongitude} />
                        <Typography sx={{fontSize:12}}><Box component={'span'} sx={{fontSize:16}}>Please find the exact spot location and click on it. </Box>Selected Location: {latitude}, {longitude}</Typography>
                    </Box>
                    <TextField
                    margin="normal"
                    fullWidth
                    label="Spot Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 1,}}
                    />
                    <TextField
                    margin="normal"
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 1,}}
                    multiline
                    minRows={4}
                    maxRows={10}
                    />
                    <FormControl sx={{px:2}}>
                        <FormLabel sx={{}}>Does this spot have Security? </FormLabel>
                        <RadioGroup
                            row
                            value={hasSecurity}
                            onChange={(e) => setHasSecurity(e.target.value === "true")}
                        >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 200, width: '50%' }}> 
                    <InputLabel sx={{}} id="spot-type-label">Spot Features</InputLabel>
                    {spotTypes && (
                        <Select
                        sx={{}}
                        labelId="spot-type-label"
                        id="spot-type-select"
                        value={selectedType}
                        label="Spot Type"
                        onChange={handleTypeChange}
                        multiple
                        >
                        {spotTypes.spotTypes.map((type) => (
                            <MenuItem sx={{}} key={type.id} value={type.id}>
                            {type.name}
                            </MenuItem>
                        ))}
                        </Select>
                    )}
                    </FormControl>
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Button variant="outlined" component="label" fullWidth sx={{ mb: 1 }}>
                            Upload Media (Must be less than 50mb)
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
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Create Spot'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
    
}
