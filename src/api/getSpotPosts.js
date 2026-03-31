export const getSpotPosts = async ({ spotId }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/postData/get-spot-posts`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ spotId }) 
        });

        if (!response.ok) {
            throw new Error('Failed to get spot post data');
        }

        const spotPostData = await response.json();
        return(spotPostData);
    } catch (error) {
        console.error('Map error:', error);
    }
};