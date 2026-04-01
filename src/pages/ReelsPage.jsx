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
import { DesktopPostBox, MobilePostBox } from '../components/PostBox';
import { useLocation } from 'react-router';
import { getSpotPosts } from '../api/getSpotPosts';
import { getUsername } from '../api/getUsername';



export default function ReelsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [postData, setPostData] = useState([]);
    const [thumbnailData, setThumbnailData] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState('');
    const [selectedPostArray, setSelectedPostArray] = useState('');
    const [postInfo, setPostInfo] = useState(null);
    const [spotPostArray, setSpotPostArray] = useState([]);
    const [spotId, setSpotId] = useState('');
    const [spotName, setSpotName] = useState('');
    const [mapOpen, setMapOpen] = useState(false);
    const [initialSpotId, setInitialSpotId] = useState(location.state?.selectedSpotId || '');
    const [initialSpotName, setInitialSpotName] = useState(location.state?.spotName || '');
    const [creatorName, setCreatorName] = useState('');



    useEffect(() => {
        if (location.state?.selectedSpotId) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, []);
    const isMobile = window.innerWidth < 600;


    const clearFilters = () => {
        setSpotId('');
        setSpotName('');
        setInitialSpotId('');
        setInitialSpotName('');
        setMapOpen(false);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getPosts();//get top 100
            const postsArray = response.postData.posts;
            let filteredPosts = postsArray;

            const activeSpotId = spotId || initialSpotId;
            const activeSpotName = spotName || initialSpotName;

            if (activeSpotName && !spotName) {
                setSpotName(activeSpotName);
            }
            if (activeSpotId) {
                const spotPosts = await getSpotPosts({ spotId: activeSpotId });
                const spotPostArray = spotPosts.postDetails;

                setSpotPostArray(spotPostArray);

                const spotPostIds = new Set(
                    spotPostArray.map(post => post.id)
                );
                //we should get spotPosts from the db because posts array is only top 100 random
                filteredPosts = postsArray.filter(post =>
                    spotPostIds.has(post.postid)
                );
            }

            setPostData(postsArray);

            const thumbnailArray = Array.from(
                new Map(filteredPosts.map(item => [item.postid, item])).values()
            );

            setThumbnailData(thumbnailArray);
        };

        fetchPosts();
    }, [spotId, initialSpotId]);

    const handleSelectPost = async (event, postId) => {
        setSelectedPostId(postId);
        const filteredArray = postData.filter(item => item.postid === postId);
        setSelectedPostArray(filteredArray);
        //console.log(postId);
        const response = await getPostDetails({postId: postId});
        //console.log(response.postDetails.postDetails);
        setPostInfo(response.postDetails.postDetails);
        const creatorId = response?.postDetails?.postDetails?.creatorid;
        if(creatorId){
            const creator = await getUsername({userId: creatorId});
            setCreatorName(creator.username.username);
        }
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
                        <IconButton size="large" onClick={() => setSelectedPostId('')} sx={{alignSelf:"flex-end", color:"white"}}>
                            <CloseIcon size="large" />
                        </IconButton>
                        <Typography sx={{color:"white", fontSize:24}}>{postInfo?.caption || ''}</Typography>
                    <Typography sx={{color:"white", fontSize:14}}>Created By <Box component="span" sx={{color:"#CF9FFF", fontSize:18, textDecoration:"underline", cursor:"pointer"}}>{creatorName}</Box></Typography>
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
            <Box sx={{ 
                height: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent:"center",
                flexDirection:"column",
                width:"100%"
            }}>
                {!mapOpen && (
                    <Box sx={{gap:2, mb:2, width:"100%", display:'flex', justifyContent:"flex-start", alignItems:"center"}}>
                        <Typography sx={{color:"white", fontSize:20}}>Filter By Spot:</Typography>
                        <Button variant="contained" onClick={() => setMapOpen(true)}>Open Map</Button>
                        {(spotId || initialSpotId) && <Button onClick={clearFilters}>Clear Filters</Button>}
                    </Box>
                )}
                {mapOpen && (
                    <Button fullWidth onClick={() => setMapOpen(false)}>Close Map</Button>
                )}
                {mapOpen && (
                    <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent:"center",
                    width:"70%",
                    "@media (max-width:600px)": {width:"100%"}
                    }}>
                        <SpotPreview setSpotName={setSpotName} setSpotId={setSpotId} />
                    </Box>
                )}
                {mapOpen && (
                    <Button fullWidth onClick={() => setMapOpen(false)}>Close Map</Button>
                )}
            </Box>
            {(spotId || initialSpotId) && (
                <Box sx={{width:"100%", display:'flex', justifyContent:"flex-start", alignItems:"center"}}>
                    <Typography sx={{color:"white", fontSize:20}}>Selected Spot: <Box component="span" sx={{color:"#CF9FFF", fontSize:32}}>{spotName}</Box></Typography>
                </Box>
            )}
            {!thumbnailData.length && (
                <Typography sx={{color:"white", fontSize:24}}>No Posts Available</Typography>
            )}
            <ImageList sx={{width:"100%", height:"auto", minHeight:400}} cols={3} rowHeight="auto">
            {thumbnailData.map((item) => (
                <ImageListItem key={item.id}>
                    {item.type === 'video' ? (
                        <video 
                            src={item.url}
                            style={{ width: "100%", height: "100%", objectFit: "contain", cursor:"pointer",background: "linear-gradient(135deg, #1a1a1a, #333)"}}
                            onClick={(e) => handleSelectPost(e, item.postid)}
                        />
                    ) : (
                        <img
                        srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                        alt={'post'}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "contain", cursor:"pointer", background: "linear-gradient(135deg, #1a1a1a, #333)"}}
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