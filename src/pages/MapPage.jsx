import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar 
} from '@mui/material';
import BigMap  from '../components/BigMap.jsx';


export default function MapPage() {
    const [selectedSpotId, setSelectedSpotId] = useState('');
    const [spotData, setSpotData] = useState(null);
    const [selectedSpotData, setSelectedSpotData] = useState(null);


    useEffect(() => {
        console.log(selectedSpotId);
        const selectedData = spotData?.spots?.find(
            (spot) => spot.id === selectedSpotId
        );
        if(selectedData){
            setSelectedSpotData(selectedData);
            console.log("selected data:", selectedData);
        }else{
            setSelectedSpotData('no');
        }
    }, [selectedSpotId]);

    return (
    <Box sx={{width:"100%", height:"auto", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", color:"white"}}>
        <Box sx={{minWidth:"100%", minHeight:"40vh", display:"flex", justifyContent:"center", alignItems:"center", gap:2 }}>
            {/* media left side */}
            <Box sx={{minWidth:"40%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Box sx={{width:"200px", height:"300px", objectFit:"contain"}} component={'img'} src={selectedSpotData?.mainurl || 'https://btxaypoxynjsrsxpbysz.supabase.co/storage/v1/object/public/boards/profile-1773835173008-gx0iqx.png'} />
            </Box>
            {/* details right side */}
            <Box sx={{minWidth:"60%", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:2}}>
                <Typography variant="h3" sx={{}}>{selectedSpotData?.name || 'name'}</Typography>
                <Typography sx={{border:"1px solid black", width:"80%", borderRadius:1, p:1}}>{selectedSpotData?.description || 'description'}</Typography>
            </Box>
        </Box>
        <BigMap setSpotData={setSpotData} setSelectedSpotId={setSelectedSpotId}/>
    </Box>

    );
    
}



