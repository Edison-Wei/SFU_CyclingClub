useIsClient
import "../app/globals.css"
import "leaflet/dist/leaflet.css";

import { MapContainer , TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useIsClient } from "@uidotdev/usehooks";


export default function Map() {
    // Define waypoints for the bike route
    const waypoints = [
        L.latLng(49.2732, -123.1000), 
        L.latLng(49.2711, -123.1260), // Science World and False Creek Seawall
    ];
    
    // Define a custom hook to add routing control to the map
    function AddRoutingControl() {
        const map = useMap();

        L.marker([49.2732, -123.1000]).addTo(map)
        .bindPopup('Meet Here!')
        .openPopup();
    
        // Add routing control to the map
        L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true
        }).addTo(map);
    
        return null;
    }
    
    return (
        <MapContainer center={[49.246292, -123.116226]} zoom={11.5}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AddRoutingControl />
        </MapContainer>

    );

}