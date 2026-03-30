import { useRef, useEffect, useState } from "react";
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar, IconButton 
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function MediaBox({spotMedia}) {
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
            <Box sx={{display:"flex", justifyContent:"center", alignItems:"center",}}>
                    {!isSingle && (
                        <IconButton onClick={handleBack}>
                            <ArrowBackIosIcon />
                        </IconButton>
                    )}
                    {spotMedia[index] ? (
                        spotMedia[index].type === "video" ? (
                            <video
                                key={spotMedia[index].url} 
                                src={spotMedia[index].url}
                                controls
                                style={{ width: 280, height: 400, objectFit: "contain" }}
                            />
                        ) : (
                            <img
                                src={`${spotMedia[index].url}?w=161&fit=crop&auto=format`}
                                alt="spot Image"
                                style={{ width: 280, height: 400, objectFit: "contain" }}
                            />
                        )
                    ) : (
                        
                        <Box sx={{ width: 280, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!isSingle && (
                        <IconButton onClick={handleForward}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    )}
            </Box>
        </>
    );
}