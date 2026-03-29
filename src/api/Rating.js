export const insertRating = async (spotId, rating) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/spotData/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ spotId, rating }), 
      });

      if (!response.ok) {
        throw new Error('Failed to insert rating');
      }

      const data = await response.json();
      return { success: true };
    } catch (error) {
      console.error('rating error:', error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    }
};


export const updateRating = async (spotId, rating) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/spotData/update-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ spotId, rating }), 
      });

      if (!response.ok) {
        throw new Error('Failed to insert rating');
      }

      const data = await response.json();
      return { success: true };
    } catch (error) {
      console.error('rating error:', error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    }
};



export const checkRated = async (spotId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/spotData/check-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ spotId }), 
      });

      if (!response.ok) {
        throw new Error('Failed to check if rated');
      }

      const data = await response.json();
      return { success: true, rated: data.rated, rating: data.rating};
    } catch (error) {
      console.error('rating check error:', error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    }
};

export const getRatings = async (spotId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/spotData/get-ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ spotId }), 
      });

      if (!response.ok) {
        throw new Error('Failed to get ratings');
      }

      const data = await response.json();
      return { success: true, ratingsArray: data || []};
    } catch (error) {
      console.error('rating error:', error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    }
};
