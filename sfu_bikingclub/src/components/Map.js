import { useMap, GeoJSON } from "react-leaflet";
import { useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import useSize from "./Mapsize";
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"


// Lazy-loaded MapContainer for SSR
const LazyMapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), {
  ssr: false
});

// Lazy-loaded TileLayer for SSR
const LazyTileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), {
  ssr: false
});

const Resize = ({ containerRef }) => {
  const map = useMap();
  const { width, height } = useSize(containerRef);

  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [height, width]);

  return null;
};

/**
 * 
 * @param geoData a geoJSON file given (Not a stringify JSON)
 * @param center a [lat, lng] coordinates specifying the center of the start and end points
 * @param zoom a scale from (0 space - 10 city)
 * @param id a id of the route to reload the map
 * @returns a map Leaflet map using the 'center' and 'zoom' to focus on the geoJSON route
 */
export default function Map({ geoData, center, zoom, id }) {
  const containerRef = useRef(null);
  
  return (
    <div ref={containerRef} className="md:h-[40vh] w-[45vh] lg:h-[75vh] lg:w-[90vh]">
      <LazyMapContainer center={center} zoom={zoom} size={{width: "100", height: "100"}} className="h-full w-full z-0">
        <Resize containerRef={containerRef} />
        <LazyTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geoData} style={{color: "black"}} key={id} /> 
        {/* Change to bottom when working on non IP connection */}
        {/* <GeoJSON data={geoData} style={{color: "black"}} key={id & id} /> */}
      </LazyMapContainer>
    </div>
  );
}