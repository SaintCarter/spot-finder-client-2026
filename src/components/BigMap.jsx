import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getMapLocations } from '../api/getMapLocations.js';

export default function BigMap({setSelectedSpotId, setSpotData}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  
  const INITIAL_CENTER = [-123.107135390715, 49.283815957855];
  const INITIAL_ZOOM = 10;

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_API_KEY;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    });

    mapRef.current = map;
    map.on("load", async () => {

      let locationData;

      try {
        locationData = await getMapLocations();
        
      } catch (error) {
        console.error('Map error:', error);
      }
      
      const geojson = locationData.geo;
      setSpotData(locationData.spotData);

      // ✅ 3. Add source
      map.addSource("locations", {
        type: "geojson",
        data: geojson
      });


      map.addLayer({
        id: "debug-layer",
        type: "circle",
        source: "locations",
        paint: {
          "circle-radius": 10,
          "circle-color": "red"
        }
      });

      // ✅ 5. Click popup
      map.on("click", "debug-layer", (e) => {
        const feature = e.features[0];

        const coordinates = feature.geometry.coordinates.slice();
        const name = feature.properties.name;
        const id = feature.properties.id;
        setSelectedSpotId(id);

      });

      // ✅ Optional: change cursor on hover
      map.on("mouseenter", "debug-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "debug-layer", () => {
        map.getCanvas().style.cursor = "";
      });
    });

  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "32vh" }}
    />
  );
}