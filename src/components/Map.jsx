import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SearchBox } from "@mapbox/search-js-react";
import { getMapLocations } from '../api/getMapLocations.js';


export default function Map({ setLongitude, setLatitude }) {

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null); // store marker

  const [searchValue, setSearchValue]= useState("");

  const INITIAL_CENTER = [-123.107135390715, 49.283815957855];
  const INITIAL_ZOOM = 10;

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_API_KEY;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    });

    mapRef.current.on("load", async () => {

      let locationData;

      try {
        locationData = await getMapLocations();
        
      } catch (error) {
        console.error('Map error:', error);
      }
      
      const geojson = locationData.geo;

      // ✅ 3. Add source
      mapRef.current.addSource("locations", {
        type: "geojson",
        data: geojson
      });


      mapRef.current.addLayer({
        id: "debug-layer",
        type: "circle",
        source: "locations",
        paint: {
          "circle-radius": 10,
          "circle-color": "red"
        }
      });

      mapRef.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        // send location to parent
        setLatitude(lat);
        setLongitude(lng);

        // remove old marker if it exists
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // create new marker
        markerRef.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

          
      });

    });

    return () => mapRef.current.remove();

  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "32vh" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1, width: "300px" }}>
        <SearchBox
          accessToken={import.meta.env.VITE_MAP_BOX_API_KEY}
          map={mapRef.current}
          mapboxgl={mapboxgl}
          value={searchValue}
          onChange={(d) => setSearchValue(d)}
        />
      </div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "32vh" }}
      />
    </div>
  );
}