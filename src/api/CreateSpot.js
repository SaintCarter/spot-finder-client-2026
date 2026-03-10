


export const CreateSpot = async (formData) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/spotData/create-spot`, {
        method: 'POST',
        headers: {
        },
        credentials: 'include',
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Create account error:', error);
      return { success: false, error: error.response?.data?.error || "An unexpected error occurred" };
    }
  };