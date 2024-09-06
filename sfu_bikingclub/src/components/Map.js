import { useMap, GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useRef } from "react";
import useSize from "./Mapsize";
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"

// Not need but good to have
function SetViewOnClick({ coords, zoom }) {
  const map = useMap();
  map.setView(coords, zoom);

  return null;
}

// Have the map rerender with the new geoData
// geoJsonRef is the identifier
function RouteData({ geoJsonRef, geoData }) {
  useEffect(() => {
    if(geoJsonRef.current) {
      geoJsonRef.current.clearLayers().addData(geoData);
      // geoJsonRef.current.addData(geoData);
    }
  }, [geoData]);

  return <GeoJSON ref={geoJsonRef} data={geoData.features} style={{color: "black"}}/>;
}

// // To resize the container based on the users Screen Size
// const Resize = ({ containerRef }) => {
//   const map = useMap();
//   const { width, height } = useSize(containerRef);

//   useEffect(() => {
//     if (map) {
//       setTimeout(() => {
//         map.invalidateSize();
//       }, 100);
//     }
//   }, [height, width]);

//   return null;
// };

/**
 * 
 * @param geoData a geoJSON file given (Not a stringify JSON)
 * @param center a [lat, lng] coordinates specifying the center of the start and end points
 * @param zoom a scale from (0 space - 10 city)
 * @param id a id of the route to reload the map
 * @returns a Leaflet map using the 'center' and 'zoom' to focus on the geoJSON route
 */
export default function Map({ geoData, center, zoom }) {
  const geoJsonRef = useRef();


  return (
    <div className="md:h-[40vh] w-[45vh] lg:h-[75vh] lg:w-[80vh] md:w-0-[40vh]">
      <MapContainer center={center} zoom={zoom} size={{width: "100", height: "100"}} minZoom={10}  className="h-full w-full z-0">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {/* Will be forced to rerender the geoJson route when a new one is selected. Can put a key tag to force a rerender of the map */}
          <RouteData geoJsonRef={geoJsonRef} geoData={geoData} />
      </MapContainer>
    </div>
  );
}