import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getMapLocations } from '../api/getMapLocations.js';
import { SearchBox } from "@mapbox/search-js-react";


export default function BigMap({setSelectedSpotId, setSpotData}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [searchValue, setSearchValue]= useState("");
  const [selectedId, setSelectedId] = useState(null);

  
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
      } finally {
        setLoading(false);
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
          "circle-color": [
            "case",
            ["==", ["get", "id"], selectedId],
            "#000000",
            "#CF9FFF"  // default
          ]
        }
      });

      // ✅ 5. Click popup
      map.on("click", "debug-layer", (e) => {
        const feature = e.features[0];

        const coordinates = feature.geometry.coordinates.slice();
        const name = feature.properties.name;
        const id = feature.properties.id;
        setSelectedSpotId(id);

        setSelectedId(id);
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
  
  useEffect(() => {
  if (!mapRef.current || selectedId === null) return;

  mapRef.current.setPaintProperty("debug-layer", "circle-color", [
      "case",
      ["==", ["get", "id"], selectedId],
      "#000000",
      "#CF9FFF"
    ]);
  }, [selectedId]);

  return (
    <div style={{ position: "relative", width: "100%", height: "32vh" }}>
      {loading && (
        <div style={{
          position: "absolute",
          zIndex: 2,
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          loading...
        </div>
      )}
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