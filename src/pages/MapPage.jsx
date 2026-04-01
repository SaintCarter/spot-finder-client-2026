import SpotPreview from '../components/SpotPreview';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar , Rating, Popper, ClickAwayListener
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { insertRating, checkRated, updateRating, getRatings } from '../api/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/AuthContext';


export default function MapPage() {
    const [spotId, setSpotId] = useState(null);
    const [rating, setRating] = useState(0);
    const [spotRating, setSpotRating] = useState(5);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [hasntRated, setHasntRated] = useState(true);
    const [ratingCount, setRatingCount] = useState(0);
    const [createMessage, setCreateMessage] = useState('');
    const [spotName, setSpotName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const { isAuthenticated } = useAuth();
    const open = Boolean(anchorEl);
    const navigate = useNavigate();




    const handleOpen = async (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        setHasntRated(true);
        setRating(0);
        if(spotId == null){
            setErrorMessage('select a spot');
            return;
        }
        if(!isAuthenticated){
            setErrorMessage('please log in');
            return;
        }
        setErrorMessage('');
        const hasRated = await checkRated(spotId);
        if(!hasRated.success){
            return;
        }
        if(!hasRated.rated){
            setHasntRated(true);
            setRating(0);
            return;
        }
        setHasntRated(false);
        setRating(hasRated.rating);
    };



    const navigateCreate = () =>{
        if(!isAuthenticated){
            setCreateMessage('please log in');
            return;
        }
        navigate('/dashboard/create');
    }
    
    const submitRating = async () =>{
        setErrorMessage('');
        setSuccessMessage('');
        if(!spotId){
            setErrorMessage('select a spot');
            return;
        }
        if(!isAuthenticated){
            setErrorMessage('please log in');
            return;
        }

        if(hasntRated){
            const rate = await insertRating(spotId, rating);
            if (!rate.success){
                setErrorMessage('something went wrong inserting...');
            }
            setSuccessMessage('Rated Successfully');
        }
        if(!hasntRated){
            const rate = await updateRating(spotId, rating);
            if (!rate.success){
                setErrorMessage('something went wrong updating...');
            }
            setSuccessMessage('Updated Rating Successfully');
        }

        setAnchorEl(null);
        setRating(0);
        const ratingData = await getRatings(spotId);
        if(!ratingData.success){
            setErrorMessage('failed to get rating data')
            return;
        }
        const ratingArray = ratingData.ratingsArray.ratings;
        const averageRating = mathRatings(ratingArray);
        setSpotRating(averageRating);
        setRatingCount(ratingArray.length);
        return;
    };

    const mathRatings = (ratings) => {
        if(ratings.length == 0){
            return 0;
        }
        const count = ratings.length;
        let total = 0;
        for (const rate of ratings) {
            total += rate.rating;
        };
        const average = total / count;
        return average;
    }

    useEffect(() => {
        if (spotId == null) return;

        const fetchRatings = async () => {
                const ratingData = await getRatings(spotId);
                if(!ratingData.success){
                    setErrorMessage('failed to get rating data')
                    return;
                }
                const ratingArray = ratingData.ratingsArray.ratings;
                //console.log(ratingArray[0].rating);//displays the int
                setRatingCount(ratingArray.length);
                const averageRating = mathRatings(ratingArray);
                setSpotRating(averageRating);
                setSuccessMessage('');
                setErrorMessage('');
                setCreateMessage('');
                return;      
        };

        fetchRatings();
    }, [spotId]);


    return (
        <Box sx={{ 
        height: 'auto', 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: '#3d3d3d',
        flexDirection:"column",
        p:2,
        "@media (max-width:600px)": {  }
        }}>
            
            {isAuthenticated && <Button onClick={navigateCreate} variant="contained" component="label" fullWidth sx={{ mb: 1 }}>Create</Button>}
            {!isAuthenticated && <Typography variant="h5" sx={{overflowWrap:"break-word", width:"100%", textAlign:"center", color:"white", mb:4}}><Box component={'a'} href={'/login'} sx={{color:"white"}} >Create A Free Account</Box> To Access All The Features!</Typography>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}} >
                <Typography>({ratingCount})</Typography>
                <Rating sx={{color:"#CF9FFF"}} icon={<FavoriteIcon fontSize="inherit" />} emptyIcon={<FavoriteBorderIcon fontSize="inherit" />} size="large" name="read-only" value={spotRating} readOnly precision={0.1}/>
                <Button onClick={handleOpen}>Rate</Button>
                <Popper 
                    open={open}
                    anchorEl={anchorEl}
                >
                    {errorMessage && <Alert severity="error" >{errorMessage}</Alert>}
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 2,
                                mt: 1,
                                borderRadius: 2,
                                
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                                minWidth: 300
                            }}
                        >
                            <Typography variant="body2">{hasntRated ? 'Rate This Spot!' : 'Update your Rating'}</Typography>

                            <Rating
                                sx={{color:"#CF9FFF"}}
                                icon={<FavoriteIcon fontSize="inherit" />} 
                                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                size="large"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                    console.log(newValue);
                                }}
                            />

                            <Button 
                                variant="contained" 
                                size="small"
                                onClick={submitRating}
                            >
                                {hasntRated ? 'Rate' : 'Update'}
                            </Button>
                        </Paper>
                    </ClickAwayListener>
                </Popper>
            </Box>
            <SpotPreview setSpotName={setSpotName} setSpotId={setSpotId} />
        </Box>
    );
}