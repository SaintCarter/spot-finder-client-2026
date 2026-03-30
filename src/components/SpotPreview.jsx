import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, Chip, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';
import BigMap  from '../components/BigMap.jsx';
import { getSpotMedia } from '../api/getSpotMedia.js';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import MediaBox from '../components/MediaBox.jsx';


export default function SpotPreview({setSpotId}) {
    const [selectedSpotId, setSelectedSpotId] = useState('');
    const [spotData, setSpotData] = useState(null);
    const [selectedSpotData, setSelectedSpotData] = useState(null);
    //const [spotMedia, setSpotMedia] = useState([]);
    const [DataTypes, setDataTypes] = useState([]);
    const defaultMediaUrl = 'https://btxaypoxynjsrsxpbysz.supabase.co/storage/v1/object/public/boards/profile-1774162792571-8yyub8.png';
    const [spotMedia, setSpotMedia] = useState([
        { url: defaultMediaUrl, type: 'image' }
    ]);
    const navigate = useNavigate();


    

    useEffect(() => {
        if (!spotData || !selectedSpotId) return;

        //spots table
        setSpotId(selectedSpotId);
        const selectedData = spotData.spots.find(
            (spot) => spot.id === selectedSpotId
        );
        setSelectedSpotData(selectedData || null);

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
                const selectedMedia = await getSpotMedia({ spotId: selectedSpotId });
                setSpotMedia(selectedMedia?.spotMedia || [{ url: defaultMediaUrl, type: 'image' }]);
            } else {
                setSpotMedia([{ url: defaultMediaUrl, type: 'image' }]);
            }
        };

        fetchMedia();
    }, [selectedSpotId, spotData]);

    return (
    <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", p:2 }}>
        <Box sx={{mb:2, minWidth:"100%", minHeight:"40vh", display:"flex", justifyContent:"center", alignItems:"center", gap:2, "@media (max-width:600px)": {flexDirection:"column-reverse"} }}>
            {/* media left side */}
            <Box sx={{minWidth:"40%", minHeight:"100%", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", "@media (max-width:600px)": {minWidth:"100%"}}}>
                <MediaBox spotMedia={spotMedia}/>
            </Box>
            {/* details right side */}
            <Box sx={{minWidth:"60%",minHeight:"100%", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:2, "@media (max-width:600px)": {minWidth:"100%"}}}>
                <Typography variant="h3" sx={{overflowWrap:"break-word", width:"80%"}}>{selectedSpotData?.name || 'Select a point on the map'}</Typography>
                <Typography sx={{border:"1px solid black", width:"80%", borderRadius:1, p:1}}>{selectedSpotData?.description || 'to see that spots data'}</Typography>
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
            </Box>
        </Box>
        <BigMap setSpotData={setSpotData} setSelectedSpotId={setSelectedSpotId}/>
    </Box>

    );
    
}



