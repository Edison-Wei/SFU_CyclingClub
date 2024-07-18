"use client"
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import RouteLayout from "./component/RouteLayout";
import DeletionModal from "./component/DeletionModal";
import Link from "next/link";


async function fetchActiveRoutes() {
  try {
    const res = await axios.get(`/api/Routes/getExecRoutes`);
    return res.data;
    // Change to this when working outside of included IP
    // return { resultsIR:dataIR.resultsIR, resultsBR:dataBR.resultsBR };
  } catch (error) {
    console.error("Error fetching Active routes: " + error)
    return ["All routes not found"];
  }
}

async function fetchMemberRoutes() {
  try {
    const res = await axios.get(`/api/Routes/getMemberRoutes`);
    return res.data;
  } catch (error) {
    console.error("Error fetching Member Routes: " + error)
    return ["Member Routes not found"];
  }
}

async function handleDeleteRoute(id) {
  console.log(id)
  try {
    const res = await axios.post(`/api/Routes/postDeletedRoute?rid=${id}`);

    return (res.status == 200 ? res : alert(`${id} was not found in the database`));
  } catch (error) {
    console.error("Failed to delete route ", error);

    return null;
  }
}

// Creates the list of active routes for the selected difficulty
// The 0 index or next closes ride from todays date will be shown
function SwitchRouteList({ interRoute, beginRoute, selection, setSelectedRoute, setShowModal }) {
  if (!interRoute || !beginRoute)
    return null

  switch (selection) {
    case 0:
      return interRoute.map(routeinfo => (
        <RouteLayout routeinfo={routeinfo}
          setSelectedRoute={setSelectedRoute}
          setShowModal={setShowModal}
          key={routeinfo.id} />
      ));
    case 1:
      return beginRoute.map(routeinfo => (
        <RouteLayout routeinfo={routeinfo} setSelectedRoute={setSelectedRoute} setShowModal={setShowModal} key={routeinfo.id} />
      ));
    case 2:
      // Move to another page under dashboard
      // Member routes
      return null;
  }
}

export default function Dashboard() {
  const [interRoute, setInterRoute] = useState(null);
  const [beginRoute, setBeginRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState({});
  const [selection, setSelection] = useState(0);                // Changes routelist to reflect difficultly selection
  const [showModal, setShowModal] = useState(false);
  const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <p>Route is Loading</p> });

  useEffect(() => {
    fetchActiveRoutes().then(res => {
      setInterRoute(res.resultsIR);
      setBeginRoute(res.resultsBR);
    })
    if (interRoute > 0)
      setSelectedRoute(interRoute[0]);
  }, []);

  // console.log(interRoute);
  // console.log(beginRoute);
  console.log(selectedRoute);

  return (
    <div className="">
      <div className="flex justify-end gap-8 text-primary-red text-[18px]">
        <Link href={"/"} className="underline hover:opacity-70">Home</Link>
        <Link href={"dashboard/insert"} className="underline hover:opacity-70">Insert new route</Link>
        <Link href={"dashboard/member"} className="underline hover:opacity-70">Member Submissions</Link>
      </div>
      {showModal && <DeletionModal routeinfo={selectedRoute} setShowModal={setShowModal} handleDeleteRoute={handleDeleteRoute} />}
      <div className="flex h-screen p-4 sm:text-[12px] md:text-[16px] lg:text-[20px]">
        <div className="w-1/2 h-full flex flex-col items-center px-3">
          <div className="flex justify-around gap-2 pb-2">
            Filters:
            <button onClick={() => { setSelection(0); setSelectedRoute(interRoute[0]); }} className={`p-0.5 ${selection == 0 ? "bg-gray-400" : "bg-gray-300"} hover:bg-gray-400 rounded-lg sm:text-[12px] md:text-[14px] lg:text-[18px]`}>Intermediate</button>
            <button onClick={() => { setSelection(1); setSelectedRoute(beginRoute[0]); }} className={`p-0.5 ${selection == 1 ? "bg-gray-400" : "bg-gray-300"} hover:bg-gray-400 rounded-lg sm:text-[12px] md:text-[14px] lg:text-[18px]`}>Beginner</button>
          </div>
          <div className="grid grid-cols-5 w-full font-semibold">
            <h1 className="">
              Delete
            </h1>
            <h1 className="col-span-2">
              Ride Title
            </h1>
            <h1 className="">
              Distance
            </h1>
            <h1 className="">
              Start Date
            </h1>
          </div>
          <div className="w-full max-h-[70%] shadow-lg bg-gray-300 border-black border-2">
            <SwitchRouteList
              interRoute={interRoute}
              beginRoute={beginRoute}
              selection={selection}
              setSelectedRoute={setSelectedRoute}
              setShowModal={setShowModal} />
          </div>

        </div>
        <Map geoData={selectedRoute.gpx} id={selectedRoute.id} />
      </div>
    </div>
  );
}

const data = {
  title: "No active",
  gpx: "",
  difficulty: "null",
  distance: 0,
  start_date: "2024-01-01",
  start_time: "00:00",
  end_time: "00:00"
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

const dataIR = {
  resultsIR: [{
    title: "No active Intermediate Route",
    gpx: geojsonTester,
    difficulty: "null",
    distance: 0,
    start_date: "2024-01-01",
    start_time: "00:00",
    end_time: "00:00",
    id: 0
  },
  {
    title: "No active second Intermediate Route",
    gpx: geojsonTester,
    difficulty: "null",
    distance: 0,
    start_date: "2024-01-01",
    start_time: "00:00",
    end_time: "00:00",
    id: 2
  }]
}

const dataBR = {
  resultsBR: [{
    title: "No active Beginner Route",
    gpx: geojsonTester,
    difficulty: "null",
    distance: 0,
    start_date: "2024-01-01",
    start_time: "00:00",
    end_time: "00:00",
    id: 1
  },
  {
    title: "No active Second Beginner Route",
    gpx: geojsonTester,
    difficulty: "null",
    distance: 0,
    start_date: "2024-01-01",
    start_time: "00:00",
    end_time: "00:00",
    id: 3
  }]
}