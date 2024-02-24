"use client"
import axios from "axios";
import { useEffect, useState } from "react";

async function fetchcClubActivity() {
    try  {
        const response = await axios.get("/api/ClubActivity/getStravaRides");
        return response.data;
    } catch(error) {
        console.error("Error fetching Club Activity: " + error)
        return [];
    }
}

export default function Executives() {
    const [activity, setActivity] = useState();

    useEffect(() => {
        fetchcClubActivity().then(res => {
            if(res)
                setActivity(res);
        })
    }, []);

    console.log(activity);

    return (
        <div className="">

        </div>
    );
}