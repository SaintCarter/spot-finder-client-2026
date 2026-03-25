export const getSpotMedia = async ({ spotId }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
        const response = await fetch(`${apiUrl}/api/spotData/get-spot-media`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ spotId }) 
        });

        if (!response.ok) {
            throw new Error('Failed to get spot media');
        }

        const mediaData = await response.json();
        return(mediaData);
    } catch (error) {
        console.error('Map error:', error);
    }
};