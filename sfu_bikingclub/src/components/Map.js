import "../app/globals.css"
import "leaflet/dist/leaflet.css";

import { MapContainer , TileLayer} from "react-leaflet";


export default function Map() {

    const markers = [


    ]
    
    return (
        <MapContainer center={[49.246292, -123.116226]} zoom={11.5}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        
        </MapContainer>

    );

}