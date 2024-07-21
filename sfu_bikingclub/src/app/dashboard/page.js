"use client"
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import RouteLayout from "./component/RouteLayout";
import DeletionModal from "./component/DeletionModal";


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

async function handleDeleteRoute(id) {
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

  return (
    <div className="">
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