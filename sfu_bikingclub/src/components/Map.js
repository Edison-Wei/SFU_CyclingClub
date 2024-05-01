import "../app/globals.css";
import { useMap, GeoJSON } from "react-leaflet";
import L, { map } from "leaflet";
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

export default function Map({ geojsonData }) {
  const containerRef = useRef(null);
// Assuming the geojasonData will be formatted as such 
// geojsonData.features[0].geometry.coordinates[0][0][0]
// geojsonData.features[0].geometry.coordinates[0][0][1]
  

  return (
    <div ref={containerRef} className="md:h-[40vh] w-[45vh] lg:h-[75vh] lg:w-[100vh]">
      <LazyMapContainer center={[49.246292, -123.116226]} zoom={11.5} size={{width: "100", height: "100"}} className="h-full w-full z-0">
        <Resize containerRef={containerRef} />
        <LazyTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddPopUp lat={49.2732} long={-123.1000} />
        {/* <AddRoute /> */}
        <GeoJSON data={geojsonTester} style={{color: "black"}} />
      </LazyMapContainer>
    </div>
  );
}

const geojsonTester = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -123.12688327665572,
              49.25984097469649
            ],
            [
              -123.1275994689028,
              49.25981801017625
            ],
            [
              -123.12830876184361,
              49.25974933784015
            ],
            [
              -123.1290043226922,
              49.259635619229144
            ],
            [
              -123.1296794510598,
              49.25947794982225
            ],
            [
              -123.13032764355069,
              49.259277848474674
            ],
            [
              -123.13094265645272,
              49.259037242774546
            ],
            [
              -123.13151856591622,
              49.25875845045987
            ],
            [
              -123.13204982504011,
              49.25844415707544
            ],
            [
              -123.13253131731369,
              49.25809739008554
            ],
            [
              -123.13295840589892,
              49.25772148969303
            ],
            [
              -123.13332697827818,
              49.257320076646465
            ],
            [
              -123.13363348583782,
              49.25689701734635
            ],
            [
              -123.13387497800697,
              49.25645638658761
            ],
            [
              -123.13404913062483,
              49.25600242829773
            ],
            [
              -123.13415426826394,
              49.25553951464959
            ],
            [
              -123.13418938029831,
              49.255072103943306
            ],
            [
              -123.13415413056272,
              49.254604697663055
            ],
            [
              -123.13404886051416,
              49.254141797122934
            ],
            [
              -123.13387458586712,
              49.253687860119314
            ],
            [
              -123.1336329867384,
              49.25324725800706
            ],
            [
              -123.1333263913994,
              49.252824233612785
            ],
            [
              -123.13295775379414,
              49.25242286039001
            ],
            [
              -123.13253062504293,
              49.252047003208844
            ],
            [
              -123.13204911920698,
              49.25170028115723
            ],
            [
              -123.13151787364546,
              49.25138603271108
            ],
            [
              -123.1309420043479,
              49.25110728360774
            ],
            [
              -123.13032705667186,
              49.25086671773142
            ],
            [
              -123.12967895196039,
              49.25066665128968
            ],
            [
              -123.12900393055232,
              49.25050901052927
            ],
            [
              -123.12830849173294,
              49.25039531320454
            ],
            [
              -123.1275993312016,
              49.25032665397645
            ],
            [
              -123.12688327665572,
              49.250303693882245
            ],
            [
              -123.12616722210988,
              49.25032665397645
            ],
            [
              -123.12545806157853,
              49.25039531320454
            ],
            [
              -123.12476262275914,
              49.25050901052927
            ],
            [
              -123.12408760135106,
              49.25066665128968
            ],
            [
              -123.1234394966396,
              49.25086671773142
            ],
            [
              -123.12282454896356,
              49.25110728360774
            ],
            [
              -123.12224867966599,
              49.25138603271108
            ],
            [
              -123.12171743410447,
              49.25170028115723
            ],
            [
              -123.12123592826852,
              49.252047003208844
            ],
            [
              -123.12080879951732,
              49.25242286039001
            ],
            [
              -123.12044016191207,
              49.252824233612785
            ],
            [
              -123.12013356657307,
              49.25324725800706
            ],
            [
              -123.11989196744436,
              49.253687860119314
            ],
            [
              -123.11971769279731,
              49.254141797122934
            ],
            [
              -123.11961242274873,
              49.254604697663055
            ],
            [
              -123.11957717301316,
              49.255072103943306
            ],
            [
              -123.11961228504751,
              49.25553951464959
            ],
            [
              -123.11971742268663,
              49.25600242829773
            ],
            [
              -123.11989157530448,
              49.25645638658761
            ],
            [
              -123.12013306747366,
              49.25689701734635
            ],
            [
              -123.12043957503327,
              49.257320076646465
            ],
            [
              -123.12080814741253,
              49.25772148969303
            ],
            [
              -123.12123523599777,
              49.25809739008554
            ],
            [
              -123.12171672827134,
              49.25844415707544
            ],
            [
              -123.12224798739523,
              49.25875845045987
            ],
            [
              -123.12282389685876,
              49.259037242774546
            ],
            [
              -123.1234389097608,
              49.259277848474674
            ],
            [
              -123.12408710225165,
              49.25947794982225
            ],
            [
              -123.12476223061928,
              49.259635619229144
            ],
            [
              -123.12545779146785,
              49.25974933784015
            ],
            [
              -123.12616708440868,
              49.25981801017625
            ],
            [
              -123.12688327665572,
              49.25984097469649
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            -123.11477724562616,
            49.26332547376981
          ],
          [
            -123.1009574621236,
            49.26297087106843
          ],
          [
            -123.11479267807756,
            49.25672049299155
          ],
          [
            -123.1013950348162,
            49.24857202116357
          ],
          [
            -123.10153544511945,
            49.240256391890625
          ]
        ],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          -123.12608628998265,
          49.2560266302217
        ],
        "type": "Point"
      }
    }
  ]
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