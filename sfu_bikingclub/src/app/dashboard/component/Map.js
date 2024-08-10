import { GeoJSON } from "react-leaflet";
import "leaflet-routing-machine";
import dynamic from 'next/dynamic';
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
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


export default function Map({ geoData, center, zoom, id }) {
  
  return (
    <div className="md:h-[40vh] w-[45vh] lg:h-[75vh] lg:w-[90vh]">
      {/* <LazyMapContainer center={[49.246292, -123.116226]} zoom={11.5} size={{width: "100", height: "100"}} className="h-full w-full z-0"> */}
      {/* center{lat, lng} */}
      {/* <LazyMapContainer center={[49.2340957, -122.88517365]} zoom={11.99} size={{width: "100", height: "100"}} className="h-full w-full z-0"> */}
      <LazyMapContainer center={center} zoom={zoom} size={{width: "100", height: "100"}} className="h-full w-full z-0">
        <LazyTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geoData} style={{color: "#890B29"}} key={id} /> 
        {/* Change to bottom when working on non IP connection */}
        {/* <GeoJSON data={geoData} style={{color: "black"}} key={id & id} /> */}
      </LazyMapContainer>
    </div>
  );
}