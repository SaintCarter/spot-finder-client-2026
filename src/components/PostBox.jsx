import { useRef, useEffect, useState } from "react";
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar, IconButton 
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export function MobilePostBox({spotMedia}) {
    const [index, setIndex] = useState(0);

    const isSingle = !spotMedia || spotMedia.length <= 1;

    const handleForward = () => {
        if((index + 1 ) >= spotMedia.length){
            setIndex(0);
        }else{
            setIndex(index + 1);
        }

    };

    const handleBack = () => {
        if(index <= 0){
            setIndex(spotMedia.length - 1);
        }else{
            setIndex(index - 1);
        }

    };

    useEffect(() => {
        setIndex(0);
        
    }, [spotMedia]);


    return (
        <>
            <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", }}>
                    {!isSingle && (
                        <IconButton sx={{color:"white"}} onClick={handleBack}>
                            <ArrowBackIosIcon />
                        </IconButton>
                    )}
                    <Box sx={{backgroundColor:"black"}}>
                        {spotMedia[index] ? (
                            spotMedia[index].type === "video" ? (
                                <video
                                    key={spotMedia[index].url} 
                                    src={spotMedia[index].url}
                                    controls
                                    style={{ width: 250, height: 360, objectFit: "contain" }}
                                />
                            ) : (
                                <img
                                    src={`${spotMedia[index].url}?w=161&fit=crop&auto=format`}
                                    alt="spot Image"
                                    style={{ width: 250, height: 360, objectFit: "contain" }}
                                />
                            )
                        ) : (
                            
                            <Box sx={{ width: 250, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Box>
                    {!isSingle && (
                        <IconButton sx={{color:"white"}} onClick={handleForward}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    )}
            </Box>
        </>
    );
}




export function DesktopPostBox({spotMedia}) {
    const [index, setIndex] = useState(0);

    const isSingle = !spotMedia || spotMedia.length <= 1;

    const handleForward = () => {
        if((index + 1 ) >= spotMedia.length){
            setIndex(0);
        }else{
            setIndex(index + 1);
        }

    };

    const handleBack = () => {
        if(index <= 0){
            setIndex(spotMedia.length - 1);
        }else{
            setIndex(index - 1);
        }

    };

    useEffect(() => {
        setIndex(0);
        
    }, [spotMedia]);


    return (
        <>
            <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", }}>
                    {!isSingle && (
                        <IconButton sx={{color:"white"}} onClick={handleBack}>
                            <ArrowBackIosIcon />
                        </IconButton>
                    )}
                    <Box sx={{backgroundColor:"black"}}>
                        {spotMedia[index] ? (
                            spotMedia[index].type === "video" ? (
                                <video
                                    key={spotMedia[index].url} 
                                    src={spotMedia[index].url}
                                    controls
                                    style={{ width: 700, height: 800, objectFit: "contain" }}
                                />
                            ) : (
                                <img
                                    src={`${spotMedia[index].url}?w=161&fit=crop&auto=format`}
                                    alt="spot Image"
                                    style={{ width: 700, height: 800, objectFit: "contain" }}
                                />
                            )
                        ) : (
                            
                            <Box sx={{ width: 700, height: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Box>
                    {!isSingle && (
                        <IconButton sx={{color:"white"}} onClick={handleForward}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    )}
            </Box>
        </>
    );
}