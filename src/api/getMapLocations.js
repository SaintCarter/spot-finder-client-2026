

export const getMapLocations = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    let locationData = [];

    try {
        const response = await fetch(`${apiUrl}/api/spotData/get-map`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to create account');
        }

        locationData = await response.json();
    } catch (error) {
        console.error('Map error:', error);
    }


    
    const locations = locationData.spots.map(loc => ({
        id: loc.id,
        name: loc.name,
        lat: loc.latitude,
        lng: loc.longitude,
    }));
    //const locations = [ { id: 1, name: "Lower Manhattan", lat: 40.6941, lng: -74.0242 }, { id: 2, name: "Brooklyn Heights", lat: 40.6960, lng: -73.9967 } ];

    const geojson = {
        type: "FeatureCollection",
        features: locations.map(loc => ({
            type: "Feature",
            properties: {
                id: loc.id,
                name: loc.name
            },
            geometry: {
                type: "Point",
                coordinates: [loc.lng, loc.lat] 
            }
        }))
    };

    return {geo: geojson, spotData: locationData};
};