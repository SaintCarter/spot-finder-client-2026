

export const getPosts = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    let postData = [];

    try {
        const response = await fetch(`${apiUrl}/api/postData/posts`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to get posts');
        }

        postData = await response.json();
    } catch (error) {
        console.error('Map error:', error);
    }

    return { postData: postData};
};

export const getPostDetails = async ({postId}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/postData/post-details`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ postId }), 
        });

        if (!response.ok) {
            throw new Error('Failed to get posts');
        }

        const postDetails = await response.json();
        return { postDetails };
    } catch (error) {
        console.error('Map error:', error);
    }
};