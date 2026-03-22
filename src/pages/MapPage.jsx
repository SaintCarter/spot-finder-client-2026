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
    const [spotMedia, setSpotMedia] = useState([]);
    const defaultMediaUrl = 'https://btxaypoxynjsrsxpbysz.supabase.co/storage/v1/object/public/boards/profile-1773835173008-gx0iqx.png';

    useEffect( () => {
        const fetchData = async () => {
            console.log(selectedSpotId);
            const selectedData = spotData?.spots?.find(
                (spot) => spot.id === selectedSpotId
            );

            if (selectedData) {
                setSelectedSpotData(selectedData);
            } else {
                setSelectedSpotData('');
            }
            if(selectedData){
                const selectedMedia = await getSpotMedia({ spotId: selectedSpotId });
                if (selectedMedia) {
                    setSpotMedia(selectedMedia.spotMedia);
                    console.log(selectedMedia.spotMedia);
                }
            } else {
                setSpotMedia([{ url: defaultMediaUrl, type: 'image' }]);
            }
        };
        fetchData();
    }, [selectedSpotId]);

    return (
    <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", color:"white"}}>
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
                <Typography variant="h3" sx={{overflowWrap:"break-word", width:"80%"}}>{selectedSpotData?.name || 'name'}</Typography>
                <Typography sx={{border:"1px solid black", width:"80%", borderRadius:1, p:1}}>{selectedSpotData?.description || 'description'}</Typography>
            </Box>
        </Box>
        <BigMap setSpotData={setSpotData} setSelectedSpotId={setSelectedSpotId}/>
    </Box>

    );
    
}



