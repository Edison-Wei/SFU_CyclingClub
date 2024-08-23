"use client"
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import RouteLayout from "./component/RouteLayout";
import DeletionModal from "./component/DeletionModal";
import { parseRoute } from "../../components/parseRoute";

const initialSelectedRoute = {
  difficulty: "",
  distance: 0,
  end_time: "",
  geojson: "",
  latitude: 49.2790223,
  longitude: -122.9201949,
  rid: 0,
  start_date: "",
  start_time: "",
  title: "",
  zoom: 11.5
}

async function fetchAllRoutes() {
  try {
    const res = await axios.get(`/api/Routes/getExecRoutes`);
    return res.data;
  } catch (error) {
    console.error("Error fetching All routes: " + error)
    return ["Routes cannot be fetched"];
  }
}

// Creates the list of active routes for the selected difficulty
// The 0 index or next closes ride from todays date will be shown
function SwitchRouteList({ interRoute, beginRoute, selection, setSelectedRoute, setShowDeletionModal }) {
  if (!interRoute || !beginRoute)
    return null

  switch (selection) {
    case 0:
      if (interRoute.length === 0) {
        return <div className="p-3 md:p-6 text-center">
          No Routes Found
        </div>
      }
      else {
        return interRoute.map(routeinfo => (
          <RouteLayout routeinfo={routeinfo}
            setSelectedRoute={setSelectedRoute}
            setShowDeletionModal={setShowDeletionModal}
            key={routeinfo.rid} />
        ));
      }
    case 1:
      if (beginRoute.length === 0) {
        return <div className="p-3 md:p-6 text-center">
          No Routes Found
        </div>
      }
      else {
        return beginRoute.map(routeinfo => (
          <RouteLayout routeinfo={routeinfo} 
          setSelectedRoute={setSelectedRoute} 
          setShowDeletionModal={setShowDeletionModal} 
          key={routeinfo.rid} />
        ));
      }
    case 2:
      // Move to another page under dashboard
      // Member routes
      return null;
  }
}

export default function Dashboard() {
  const [interRoute, setInterRoute] = useState(null);
  const [beginRoute, setBeginRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(initialSelectedRoute);
  const [selection, setSelection] = useState(0);                // Changes routelist to reflect difficultly selection
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const Map = dynamic(() => import('@/app/dashboard/component/Map'), { ssr: false, loading: () => <p>Route is Loading</p> });

  useEffect(() => {
    fetchAllRoutes().then(res => {
      const resultIR = res.resultsIR.map((routeIR) => {
        // parseGPX only works on browser(client) not on server
        const parsedRoute = parseRoute(routeIR);
        delete routeIR.gpx;
        delete routeIR.date_created;
        return {
          ...routeIR,
          ...parsedRoute
        }
      })
      const resultBR = res.resultsBR.map((routeBR) => {
        // parseGPX only works on browser(client) not on server
        const parsedRoute = parseRoute(routeBR);
        delete routeBR.gpx;
        delete routeBR.date_created;
        return {
          ...routeBR,
          ...parsedRoute
        }
      })
      setInterRoute(resultIR);
      setBeginRoute(resultBR);
    })
  }, []);

  async function handleDeleteRoute(rid) {
    try {
      const res = await axios.post(`/api/Routes/postDeleteRoute?rid=${rid}`);
      if (!res)
        throw {error: "Error: Route did not delete"};

      if (selection === 0) {
        setInterRoute(interRoute.filter(route => route !== selectedRoute));
      }
      else {
        setBeginRoute(beginRoute.filter(route => route !== selectedRoute));
      }
  
      return res;
    } catch (error) {
      console.error("Failed to delete route ", error);
      alert(`${rid} was not found in the database`)
  
      return null;
    }
  }

  return (
    <div className="">
      {showDeletionModal && <DeletionModal routeinfo={selectedRoute} setShowDeletionModal={setShowDeletionModal} handleDeleteRoute={handleDeleteRoute} />}
      <div className="flex h-screen p-4 sm:text-[12px] md:text-[16px] lg:text-[20px]">
        <div className="w-2/3 h-full flex flex-col items-center pr-3">
          <div className="flex justify-around gap-2 pb-2">
            Filters:
            <button onClick={() => { setSelection(0); setSelectedRoute(interRoute.length === 0? initialSelectedRoute : interRoute[0]); }} className={`py-0.5 px-1 ${selection == 0 ? "bg-gray-400" : "bg-gray-300"} hover:bg-gray-400 rounded-lg sm:text-[12px] md:text-[14px] lg:text-[18px]`}>Intermediate</button>
            <button onClick={() => { setSelection(1); setSelectedRoute(beginRoute.length === 0? initialSelectedRoute : beginRoute[0]); }} className={`py-0.5 px-1 ${selection == 1 ? "bg-gray-400" : "bg-gray-300"} hover:bg-gray-400 rounded-lg sm:text-[12px] md:text-[14px] lg:text-[18px]`}>Beginner</button>
          </div>
          <div className="w-full grid grid-cols-6 font-semibold">
            <h1 className="col-span-2">
              Ride Title
            </h1>
            <h1 className="">
              Distance
            </h1>
            <h1 className="">
              Start Date
            </h1>
            <h1 className="justify-self-center">
              Time
            </h1>
            <h1 className="justify-self-end">
              Delete/Edit
            </h1>
          </div>
          <div className="w-full max-h-[70%] shadow-lg bg-gray-300 border-black border-4 rounded-md">
            <SwitchRouteList
              interRoute={interRoute}
              beginRoute={beginRoute}
              selection={selection}
              setSelectedRoute={setSelectedRoute}
              setShowDeletionModal={setShowDeletionModal} />
          </div>

        </div>
        <Map geoData={selectedRoute.geojson} center={[selectedRoute.latitude, selectedRoute.longitude]} zoom={selectedRoute.zoom} id={selectedRoute.rid} />
      </div>
    </div>
  );
}