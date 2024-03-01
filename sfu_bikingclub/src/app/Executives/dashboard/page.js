"use client"

import axios from "axios";
import { useEffect, useState } from "react";

async function fetchRoutes() {
    try  {
        const response = await axios.get(`/api/Routes/getExecRoutes`);
        return response.data;
    } catch(error) {
        console.error("Error fetching Executive Routes: " + error)
        return [];
    }
}


export default function Dashboard() {
    const [routeView, setRouteView] = useState([]);

    useEffect(() => {
        fetchRoutes().then(res => {
            if(res)
                setRouteView(res);
        })
    }, []);
    

    return(
        <div className="flex flex-col justify-center w-full h-full">
            <div className="">

            </div>
            <div className="flex w-full">
                <div className="overflow-auto">

                </div>
                <div className="">

                </div>
            </div>
        </div>
    );
}