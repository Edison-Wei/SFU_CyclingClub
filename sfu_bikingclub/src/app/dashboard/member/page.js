"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import RouteSuggestionLayout from "../component/RouteSuggestionLayout";
import axios from "axios";
import { parseRoute } from "../../../components/parseRoute";
import RouteSuggestionDeletetionModal from "../component/RouteSuggestionDeletetionModal";

const initialSelectedRoute = {
  created_by: "",
  distance: 0,
  date_created: "",
  geojson: "",
  latitude: 49.2790223,
  longitude: -122.9201949,
  sid: 0,
  zoom: 11.5
}

async function fetchSuggestionRoutes() {
  try {
    const res = await axios.get(`/api/Routes/getSuggestionRoutes`);

    return res.data.results;
  } catch (error) {
    console.error("Error fetching Member Routes: " + error)
    return ["Member Routes not found"];
  }
}

export default function MemberSubmissions() {
  const [routeSuggestions, setRouteSuggestions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(initialSelectedRoute);
  const [showDeletionModal, setShowDeletionModal] = useState(false);

  const Map = dynamic(() => import('@/app/dashboard/component/Map'), { ssr: false, loading: () => <p>Route is Loading</p> });


  useEffect(() => {
    fetchSuggestionRoutes().then(res => {
      const result = res.map((suggestionRoute) => {
        // parseGPX only works on browser(client) not on server
        const parsedRoute = parseRoute(suggestionRoute);
        delete suggestionRoute.gpx;
        return {
          ...suggestionRoute,
          ...parsedRoute
        }
      })
      setRouteSuggestions(result);
    })
  }, []);

  async function handleDeleteRoute(sid) {
    try {
      const res = await axios.post(`/api/Routes/postDeleteSuggestion?sid=${sid}`);
      if (!res)
        throw {error: "Error: Route did not delete"};
      

      setRouteSuggestions(routeSuggestions.filter(route => route !== selectedRoute));
      console.log(sid);
  
      return res;
    } catch (error) {
      console.error("Failed to delete route ", error);
      alert(`${sid} was not found in the database`)
  
      return null;
    }
  }

  return (
    <div className="">
      {showDeletionModal && <RouteSuggestionDeletetionModal routeinfo={selectedRoute} setShowDeletionModal={setShowDeletionModal} handleDeleteRoute={handleDeleteRoute} />}
      <div className="flex h-screen p-4 sm:text-[12px] md:text-[16px] lg:text-[20px]">
        <div className="w-2/3 h-full flex flex-col items-center pr-3">
          <div className="p-3 font-medium">
            Remember to check the SFSS Cycling Club member list.
          </div>
          <div className="px-2 w-full flex font-semibold">
            <h1 className="basis-2/6">
              Created By
            </h1>
            <h1 className="basis-1/6 text-center">
              Distance
            </h1>
            <h1 className="basis-2/6 text-center">
              Date Created
            </h1>
            <h1 className="basis-1/6 text-end">
              Delete
            </h1>
          </div>
          <div className="w-full max-h-[70%] shadow-lg bg-gray-300 border-black border-4 rounded-md">
            {routeSuggestions.length > 0 ? routeSuggestions.map((routeinfo) => {
              return <RouteSuggestionLayout 
              routeinfo={routeinfo} 
              setSelectedRoute={setSelectedRoute} 
              setShowDeletionModal={setShowDeletionModal} 
              key={routeinfo.sid}/>
            })
            :
              <div className="p-4 text-center">No Route Suggestions from Members</div>}
          </div>

        </div>
        <Map geoData={selectedRoute.geojson} center={[selectedRoute.latitude, selectedRoute.longitude]} zoom={selectedRoute.zoom} id={selectedRoute.sid} />
      </div>
    </div>
  );

}