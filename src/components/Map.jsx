import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map({ setLongitude, setLatitude }) {

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null); // store marker

  const INITIAL_CENTER = [-74.0242, 40.6941];
  const INITIAL_ZOOM = 10.12;

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_API_KEY;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    });

    mapRef.current.on("load", () => {

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
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "32vh" }}
    />
  );
}