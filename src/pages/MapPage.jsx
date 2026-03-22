import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';
import BigMap  from '../components/BigMap.jsx';
import { getSpotMedia } from '../api/getSpotMedia.js';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


export default function MapPage() {
    const [selectedSpotId, setSelectedSpotId] = useState('');
    const [spotData, setSpotData] = useState(null);
    const [selectedSpotData, setSelectedSpotData] = useState(null);
    //const [spotMedia, setSpotMedia] = useState([]);
    const [DataTypes, setDataTypes] = useState([]);
    const [typeNames, setTypeNames] = useState([]);
    const defaultMediaUrl = 'https://btxaypoxynjsrsxpbysz.supabase.co/storage/v1/object/public/boards/profile-1774162792571-8yyub8.png';
    const [spotMedia, setSpotMedia] = useState([
        { url: defaultMediaUrl, type: 'image' }
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!spotData || !selectedSpotId) return;

        //spots table
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
        console.log("Selected type names:", matchingTypes);

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
    <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", color:"white", backgroundColor:"#3d3d3d", p:2}}>
        <Button onClick={() => navigate('/dashboard/create')} variant="contained" component="label" fullWidth sx={{ mb: 1 }}>Create</Button>
        <Box sx={{minWidth:"100%", minHeight:"40vh", display:"flex", justifyContent:"center", alignItems:"center", gap:2, }}>
            {/* media left side */}
            <Box sx={{minWidth:"40%", minHeight:"100%", display:"flex", justifyContent:"center", alignItems:"center", border:"1px solid black", borderRadius:1.6, backgroundColor:"#aaaaaa", flexDirection:"column"}}>
                {/* <Box sx={{maxWidth:"200px", maxHeight:"300px", minWidth:"200px", minHeight:"300px", objectFit:"contain"}} component={'img'} src={spotMedia?.[0]?.url || 'https://btxaypoxynjsrsxpbysz.supabase.co/storage/v1/object/public/boards/profile-1773835173008-gx0iqx.png'} />
                <Button>See More</Button> */}
                <ImageList sx={{ width: 200, height: 300 }} variant="woven" cols={1} gap={1}>
                {spotMedia?.map((item) => (
                    <ImageListItem key={item.url}>
                    {item.type === "video" ? (
                        <video
                        src={item.url}
                        controls
                        style={{ width: 200, height: 300, objectFit: "contain" }}
                        />
                    ) : (
                        <img
                        srcSet={`${item.url}?w=161&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.url}?w=161&fit=crop&auto=format`}
                        alt="spot Image"
                        loading="lazy"
                        style={{ width: 200, height: 300, objectFit: "contain" }}
                        />
                    )}
                    </ImageListItem>
                ))}
                </ImageList>
            </Box>
            {/* details right side */}
            <Box sx={{minWidth:"60%",minHeight:"100%", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:2}}>
                <Typography variant="h3" sx={{overflowWrap:"break-word", width:"80%"}}>{selectedSpotData?.name || 'Select a point on the map'}</Typography>
                <Typography sx={{border:"1px solid black", width:"80%", borderRadius:1, p:1}}>{selectedSpotData?.description || 'to see that spots data'}</Typography>
                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', width: "80%"}}>
                    {DataTypes.map((typeName, index) => (
                        <Typography 
                            key={index} 
                            sx={{ px: 1, py: 0.5, border: '1px solid white', borderRadius: 1, fontSize: '0.875rem' }}
                        >
                            {typeName}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Box>
        <BigMap setSpotData={setSpotData} setSelectedSpotId={setSelectedSpotId}/>
    </Box>

    );
    
}



