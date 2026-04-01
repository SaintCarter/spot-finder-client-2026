import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, Chip, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar, Link, IconButton 
} from '@mui/material';
import BigMap  from '../components/BigMap.jsx';
import { getSpotMedia } from '../api/getSpotMedia.js';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import MediaBox from '../components/MediaBox.jsx';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getSpotPosts } from '../api/getSpotPosts';
import { getUsername } from '../api/getUsername.js';



export default function SpotPreview({setSpotId, setSpotName}) {
    const [creatorName, setCreatorName] = useState('');
    const [location, setLocation] = useState(null);
    const [selectedSpotId, setSelectedSpotId] = useState('');
    const [spotData, setSpotData] = useState(null);
    const [selectedSpotData, setSelectedSpotData] = useState(null);
    //const [spotMedia, setSpotMedia] = useState([]);
    const [DataTypes, setDataTypes] = useState([]);
    const defaultMediaUrl = '/images/skatemap.png';
    const [spotMedia, setSpotMedia] = useState([
        { url: defaultMediaUrl, type: 'image' }
    ]);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();


    const handleCopyLocation = () => {
        const locationString = `${location.lat} , ${location.lng}`;
        navigator.clipboard.writeText(locationString);
    };

    const handleViewPosts = async () => {
        if  (!isAuthenticated){
            setError('please log in');
            return;
        }
        if (!selectedSpotId) {
            setError('please select a spot');
            return;
        }
        const posts = await getSpotPosts({spotId: selectedSpotId});
        console.log(posts);
        if(posts.postDetails.length < 1 || !posts.postDetails){
            setError('No Posts for this Spot yet');
            return;
        }
        const spotName = selectedSpotData.name;
        navigate('/dashboard/reels', {
            state: { selectedSpotId, spotName }
        });
    };


    useEffect(() => {
        if (!spotData || !selectedSpotId) return;
        setError('');
        //spots table
        setSpotId(selectedSpotId);
        const selectedData = spotData.spots.find(
            (spot) => spot.id === selectedSpotId
        );
        setSelectedSpotData(selectedData || null);
        //console.log(selectedData); returns all of spot table row

        setLocation({
            lat: selectedData.latitude, 
            lng: selectedData.longitude
        });

        setSpotName(selectedData.name);

        //spot_has_types table
        const matchingTypes = spotData.types
            .filter(type => type.spotid === selectedSpotId)
            .map(type => {
                // 3️⃣ Map spottypeid → name
                const match = spotData.typeNames.find(t => t.id === type.spottypeid);
                return match ? match.name : null;
            })
            .filter(Boolean); // remove nulls if any

        setDataTypes(matchingTypes); // store array of strings

        // spot_media table
        const fetchMedia = async () => {
            if (selectedData) {
                const creatorId = selectedData.creatorid;
                if(creatorId){
                    const creator = await getUsername({userId: creatorId});
                    setCreatorName(creator.username.username);
                }
                const selectedMedia = await getSpotMedia({ spotId: selectedSpotId });
                setSpotMedia(selectedMedia?.spotMedia || [{ url: defaultMediaUrl, type: 'image' }]);
            } else {
                setSpotMedia([{ url: defaultMediaUrl, type: 'image' }]);
            }
        };

        fetchMedia();
    }, [selectedSpotId, spotData]);

    return (
    <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", p:2, "@media (max-width:600px)": { p:1, } }}>
        <Box sx={{mb:2, minWidth:"100%", minHeight:"40vh", display:"flex", justifyContent:"center", alignItems:"center", gap:2, "@media (max-width:600px)": {flexDirection:"column-reverse"} }}>
            {/* media left side */}
            <Box sx={{minWidth:"40%", minHeight:"100%", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", "@media (max-width:600px)": {minWidth:"100%"}}}>
                <MediaBox spotMedia={spotMedia}/>
            </Box>
            {/* details right side */}
            <Box sx={{minWidth:"60%",minHeight:"100%", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:2, "@media (max-width:600px)": {minWidth:"100%"}}}>
                <Typography variant="h3" sx={{overflowWrap:"break-word", width:"80%", color:"white", }}>{selectedSpotData?.name || 'Select a point on the map'}</Typography>
                <Typography sx={{borderTop:"1px solid black", width:"80%", p:1, color:"white", overflowWrap:"break-word", }}>{selectedSpotData?.description || 'to see that spots data'}</Typography>
                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', width: "80%"}}>
                    {DataTypes.map((typeName, index) => (
                        <Chip 
                            key={index}
                            label={typeName}
                            variant={"filled"}
                            sx={{color:"#CF9FFF"}}
                        />
                    ))}
                </Box>
                <Box sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", width:"80%", gap:2, "@media (max-width:600px)": {width:"90%"}}}>
                    <IconButton onClick={handleCopyLocation}>
                        <ContentCopyIcon />
                    </IconButton>
                    <Link
                    href={
                        location
                        ? `https://www.google.com/maps/search/?api=1&query=${location.lat}%2C${location.lng}`
                        : "#"
                    }
                    rel="noopener noreferrer"
                    underline="hover"
                    >
                    Open in Google Maps
                    </Link>
                    <Link
                        href={
                            location
                            ? `https://maps.apple.com/?q=${`${location.lat},${location.lng}`}`
                            : "#"
                        }
                        rel="noopener noreferrer"
                        underline="hover"
                    >
                        Open in Apple Maps
                    </Link>
                </Box>
                <Box sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", width:"80%", gap:2, "@media (max-width:600px)": {width:"85%"}}}>
                    <Button variant="contained" onClick={handleViewPosts}>View Posts</Button>
                </Box>
                <Box sx={{display:"flex", justifyContent:"flex-start", alignItems:"center", width:"80%", gap:2, "@media (max-width:600px)": {width:"100%"}}}>
                    {creatorName && (<Typography sx={{color:"white", fontSize:14, "@media (max-width:600px)": {textAlign:"center", width:"100%"}}}>Created By <Box component="span" sx={{color:"#CF9FFF", fontSize:18, textDecoration:"underline", cursor:"pointer"}}>{creatorName}</Box></Typography>)}
                </Box>
            </Box>
        </Box>
        {error && <Alert severity="error" sx={{ width: '97%', mb: 2 }}>{error}</Alert>}
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", width:"100%",}}>
            <BigMap setSpotData={setSpotData} setSelectedSpotId={setSelectedSpotId}/>
        </Box>
    </Box>

    );
    
}



