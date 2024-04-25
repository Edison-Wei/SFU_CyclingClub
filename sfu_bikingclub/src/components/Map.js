import "../app/globals.css";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";
import dynamic from 'next/dynamic';
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

function AddRoutingControl() {
  const map = useMap();

  useEffect(() => {
    if (map) {
      L.Routing.control({
        waypoints: [
          L.latLng(49.2732, -123.1000),
          L.latLng(49.2711, -123.1260), // Science World and False Creek Seawall
        ],
        routeWhileDragging: true,
      }).addTo(map);
    }
  }, [map]);

  return null;
}

export default function Map() {
  return (
    <LazyMapContainer center={[49.246292, -123.116226]} zoom={11.5}>
      <LazyTileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AddPopUp lat={49.2732} long={-123.1000} />
    </LazyMapContainer>
  );
}

// export default function Map() {
//   // const {position, zoom} = props;

//   return <MapContainer center={[49.246292, -123.116226]} zoom={11.5} scrollWheelZoom={false} >
// <TileLayer
//       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//     />
//     <Marker position={[49.246292, -123.116226]}>
//       <Popup>
//         A pretty CSS3 popup. <br /> Easily customizable.
//       </Popup>
//     </Marker>
//   </MapContainer>
// }