"use client"

import Navigation from "@/components/Navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

async function fetchActiveExecRoutes() {
    try {
        const response = await axios.get(`/api/Routes/getExecRoutes`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Executive Routes: " + error)
        return ["Executive Routes not found"];
    }
}

async function fetchMemberRoutes() {
    try {
        const resposne = await axios.get(`/api/Routes/getMemberRoutes`);
        return resposne.data;
    } catch(error) {
        console.error("Error fetching Member Routes: " + error)
        return ["Member Routes not found"];
    }
}

async function fetchGeojson(ids) {
    try {
      const res = await axios.get(`/api/Routes/getGeojson?interID=${ids[0]}&beginId=${ids[1]}`);
  
      return res.data;
    } catch (error) {
      console.error("Failed to fetch UpcomingRoute: ", error);
  
      return [];
    }
  }


export default function Dashboard() {
    const [execRoutes, setExecRoute] = useState({});
    const [memberRoutes, setMemberRoutes] = useState({});
    const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <p>Map is Loading</p> });


    useEffect(() => {
        fetchActiveExecRoutes().then(res => {
            setExecRoute(res);
        })
        fetchMemberRoutes().then(res => {
            setMemberRoutes(res);
        })
    }, []);

    // console.log(execRoutes);
    // console.log(memberRoutes);


    return (
        <>
            <Navigation />
            <div className="flex justify-center w-full h-full">
                <div className="">

                </div>
                <div className="">
                    Map
                    {/* <Map /> */}
                </div>
            </div>
        </>
    );
}