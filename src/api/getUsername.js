export const getUsername = async ({ userId }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/userData/get-username`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ userId }) 
        });

        if (!response.ok) {
            throw new Error('Failed to get spot post data');
        }

        const username = await response.json();
        return(username);
    } catch (error) {
        console.error('Map error:', error);
        return;
    }
};