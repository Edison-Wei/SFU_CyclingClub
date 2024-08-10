import { useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import useSize from "./Mapsize";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
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

// Lazy-loaded Marker for SSR
const LazyMarker = dynamic(() => import('react-leaflet').then((module) => module.Marker), {
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


function AddPopUp({ lat, long }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      L.marker([lat, long])
        .addTo(map)
        .bindPopup('Meet Here!')
        .openPopup();
    }
  }, [map, lat, long]);

  return null;
}

function AddRoute() {
  const map = useMap();

  useEffect(() => {
    if(map) {
      L.geoJSON(geojsonTester, {
    }).addTo(map);
    }
  }, [map]);

  return null;
}

export default function Map({ geoData, id }) {
  const containerRef = useRef(null);
  
  return (
    <div ref={containerRef} className="md:h-[40vh] w-[45vh] lg:h-[75vh] lg:w-[90vh]">
      <LazyMapContainer center={[49.246292, -123.116226]} zoom={11.5} size={{width: "100", height: "100"}} className="h-full w-full z-0">
        <Resize containerRef={containerRef} />
        <LazyTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddPopUp lat={49.2732} long={-123.1000} />
        {/* <AddRoute />  Both this and GeoJSON work*/}
        <GeoJSON data={geoData && JSON.parse(geoData)} style={{color: "black"}} key={id & id} /> 
        {/* Change to bottom when working on non IP connection */}
        {/* <GeoJSON data={geoData} style={{color: "black"}} key={id & id} /> */}
      </LazyMapContainer>
    </div>
  );
}