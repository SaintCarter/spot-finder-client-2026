import SpotPreview from '../components/SpotPreview';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert, CircularProgress, Avatar , Rating, Popper, ClickAwayListener, IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getPosts, getPostDetails } from '../api/getPosts';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CloseIcon from '@mui/icons-material/Close';
import MediaBox from '../components/MediaBox';
import { DesktopPostBox, MobilePostBox } from '../components/PostBox';



export default function ReelsPage() {
    const [postData, setPostData] = useState([]);
    const [thumbnailData, setThumbnailData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState('');
    const [selectedPostArray, setSelectedPostArray] = useState('');
    const [postInfo, setPostInfo] = useState(null);


    const isMobile = window.innerWidth < 600;

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getPosts();
            const postsArray = response.postData.posts;
            setPostData(postsArray);


            const thumbnailArray = Array.from(
                new Map(postsArray.map(item => [item.postid, item])).values()
            );
            setThumbnailData(thumbnailArray);
        };

        fetchPosts();
    },[]);

    const handleSelectPost = async (event, postId) => {
        setSelectedPostId(postId);
        const filteredArray = postData.filter(item => item.postid === postId);
        setSelectedPostArray(filteredArray);
        console.log(postId);
        const response = await getPostDetails({postId: postId});
        console.log(response.postDetails.postDetails);
        setPostInfo(response.postDetails.postDetails);
    }

    return (
        <Box sx={{ 
        height: 'auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent:'center',
        bgcolor: '#3d3d3d',
        flexDirection:"column",
        p:2
        }}>
        {selectedPostId && (
            <Box
            sx={{
                position: 'fixed',
                inset: 0, // top:0, right:0, bottom:0, left:0
                bgcolor: 'rgba(0,0,0,0.4)',
                zIndex: 1300,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
            }}
            >
                <ClickAwayListener onClickAway={() => setSelectedPostId('')}>
                    <Box sx={{width:"auto", backgroundColor:"#3d3d3d", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:2, p:2}}>
                        <IconButton onClick={() => setSelectedPostId('')} sx={{alignSelf:"flex-end"}}>
                            <CloseIcon />
                        </IconButton>
                        <Typography>{postInfo?.caption || ''}</Typography>
                        <Box sx={{minWidth:"40%", minHeight:"100%", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", "@media (max-width:600px)": {minWidth:"100%"}}}>
                            {isMobile ? (
                                <MobilePostBox spotMedia={selectedPostArray}/>
                            ) : (
                                <DesktopPostBox spotMedia={selectedPostArray}/>
                            )}
                        
                        </Box>
                    </Box>
                </ClickAwayListener>
            </Box>
        )}
            <Box>
                Filters:
            </Box>
            <ImageList sx={{width:"100%", height:"auto"}} cols={3} rowHeight="auto">
            {thumbnailData.map((item) => (
                <ImageListItem key={item.id}>
                    {item.type === 'video' ? (
                        <video 
                            src={item.url}
                            style={{ width: "100%", height: "100%", objectFit: "contain", cursor:"pointer" }}
                            onClick={(e) => handleSelectPost(e, item.postid)}
                        />
                    ) : (
                        <img
                        srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                        alt={'post'}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "contain", cursor:"pointer" }}
                        onClick={(e) => handleSelectPost(e, item.postid)}
                    />
                    )}
                </ImageListItem>
            ))}
            </ImageList>
            <Button>Load More</Button>
        </Box>
    );
}