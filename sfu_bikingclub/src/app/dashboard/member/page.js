"use client"

import { useState } from "react";

async function fetchMemberRoutes() {
    try {
      const res = await axios.get(`/api/Routes/getMemberRoutes`);
      return res.data.result;
    } catch (error) {
      console.error("Error fetching Member Routes: " + error)
      return ["Member Routes not found"];
    }
}

export default function MemberSubmissions() {
  const [routeSuggestions, setRouteSuggestions] = useState({});

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
      setInterRoute(resultIR);
      setBeginRoute(resultBR);
    })
    if (interRoute > 0)
      setSelectedRoute(interRoute[0]);
  }, []);

}