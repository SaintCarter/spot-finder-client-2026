export const CreatePost = async (formData) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/postData/create-post`, {
        method: 'POST',
        headers: {
        },
        credentials: 'include',
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      return { success: true };
    } catch (error) {
      console.error('Create account error:', error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    }
  };