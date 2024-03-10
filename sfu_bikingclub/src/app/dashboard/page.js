"use client"

import Navigation from "@/components/Navigation";
import axios from "axios";
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


export default function Dashboard() {
    const [execRoutes, setExecRoute] = useState([]);
    const [memberRoutes, setMemberRoutes] = useState([]);


    // useEffect(() => {
    //     fetchActiveExecRoutes().then(res => {
    //         setExecRoute(res);
    //     })
    //     fetchMemberRoutes().then(res => {
    //         setMemberRoutes(res);
    //     })
    // }, []);


    return (
        <>
            <Navigation />
            <div className="flex justify-center w-full h-full">
                <div className="">

                </div>
                <div className="">
                    Map
                </div>
            </div>
        </>
    );
}