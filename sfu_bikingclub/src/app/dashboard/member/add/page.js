'use client'

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { parseRoute } from "@/components/parseRoute";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

let id = 0;

const initialTimeValues = {
    startTime: "",
    message: ""
};

const initialRouteSuggestion = {
    sid: 0,
    created_by: "",
    geojson: null,
    latitude: 0,
    longitude: 0,
    zoom: 0,
    distance: 0
}

async function fetchRouteSuggestion(sid) {
    try {
        const res = await axios.get(`/api/Routes/getRouteSuggestionInfo?sid=${sid}`);

        return res.data.resultsSuggestionInfo;
    } catch (error) {
        console.error("Error fetching All routes: " + error)
        return ["Suggestion for a Route cannot be fetched"];
    }
}

function AddSuggestionRoute() {
    const params = useSearchParams().get("sid");
    const [discardForm, setDiscardForm] = useState(false); // True, if ';' semicolon is detected in the cases below and honeypot inputs. False otherwise
    const [routeSuggestion, setRouteSuggestion] = useState(initialRouteSuggestion);
    const [routeInformation, setRouteInformation] = useState(""); // Will be a string containing the route information (Format of .gpx, .geojson, or .json)

    const [time, setTime] = useState(initialTimeValues);
    const Map = dynamic(() => import('@/app/dashboard/component/Map'), { ssr: false, loading: () => <p>Loading Map and Routes</p> });

    const router = useRouter();

    useEffect(() => {
        fetchRouteSuggestion(params).then((res) => {
            let routeInfo = res[0];
            const parsedRoute = parseRoute(routeInfo);
            setRouteInformation(routeInfo.gpx);
            delete routeInfo.gpx;
            delete routeInfo.date_created;
            setRouteSuggestion({...routeInfo, ...parsedRoute});
        })
    }, []);


    async function handleSubmit(formData) {
        if(routeSuggestion.geojson === "") {
            alert("Route could not be processed.\nPlease select a different .gpx or .geojson file");
            return;
        }

        const title = formData.get("title").split(";")[0]; // Can be anything (expect ;)
        const difficulty = formData.get("difficulty"); // Either Beginner or Intermediate
        const date = formData.get("date"); // Date has to be today's date or after (Format of yyyy-mm-dd)
        const startTime = formData.get("startTime"); // In 24 hour format
        const endTime = formData.get("endTime"); // In 24 hour format (Has to be greater than startTime)

        if(discardForm) {
            alert("Sending you back home");
            router.push("/");
        }


        try {
            const res = await axios.post("/api/Routes/postSuggestToExec", {
                sid: routeSuggestion.sid,
                title: title,
                difficulty: difficulty,
                gpx: routeInformation,
                distance: routeSuggestion.distance,
                start_Date: date,
                start_Time: startTime,
                end_Time: endTime,
            });

            alert((await res).data.result + "\nSending you back to Member Suggested Routes");
            router.push("/dashboard/member");
        } catch (error) {
            alert(error.response.data.error);
        }
    }

    function handleTimeInput(e) {
        const { name, value } = e.target;
        if (name === "startTime") {
            setTime({...time, [name]: value});
        }

        if(time.startTime > value)
            setTime({...time, ["message"]: "Has to be past Start time"});
    }

    return (
        <div className="md:py-4 md:px-24 px-14 h-full">
            <form action={handleSubmit} className="w-full pt-8 px-12 pb-12 flex flex-col gap-14 bg-gray-300 rounded-xl shadow-xl lg:text-[20px] text-[14px]">
                <div className="" id="email">
                    <h1 className="font-semibold md:text-[30px] text-[20px]">Add Suggested Route<span className="p-2 text-[10px] md:text-[15px] text-primary-red">All required</span></h1>
                    <p className="ml-3 md:text-[20px] text-[12px] font-semibold">
                        Route Suggested by: <span className="font-normal">{routeSuggestion.created_by}</span>
                    </p>
                </div>

                <section className="md:grid md:grid-cols-2 flex flex-col gap-4"> 
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Ride Title:</label>
                        <input className="bg-white w-[80%] rounded-lg shadow-md" name="title" placeholder="Ride title..." required></input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="pr-3 font-normal">Ride difficulty:</label>
                        <select className="p-2 w-[50%] rounded-md shadow-md" name="difficulty">
                            <option value={"Beginner"}>Beginner</option>
                            <option value={"Intermediate"}>Intermediate</option>
                        </select>
                    </div>
                </section>
                <section className="md:grid md:grid-cols-3 flex flex-col gap-3 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Ride date:</label>
                        <input type="date" className="w-[80%] bg-white rounded-lg shadow-md" name="date" required></input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Start time:</label>
                        <input type="time" className="w-[80%] bg-white rounded-lg shadow-md" name="startTime" label="startTime" onChange={(e) => handleTimeInput(e)} required></input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">End time: <span className="font-semibold text-primary-red lg:text-[16px] text-[10px]">{time.message}</span></label>
                        <input type="time" className="w-[80%] bg-white rounded-lg shadow-md" name="endTime" onChange={(e) => handleTimeInput(e)} required></input>
                    </div>
                </section>
                <section className="w-full flex flex-col gap-3">
                    <h1 className="font-medium">Route:</h1>
                    {routeInformation && <Map geoData={routeSuggestion.geojson} center={[routeSuggestion.latitude, routeSuggestion.longitude]} zoom={routeSuggestion.zoom} id={0}/>} {/* Put label here when file cannot be read and parsed */}
                </section>

                <section className="">
                    <div className="hidden">
                        <label className="font-normal">Name</label>
                        <input type="text" className="bg-white w-[80%] rounded-lg shadow-md" name="phoneNumber" placeholder="holder..." onChange={() => setDiscardForm(true)}></input>
                    </div>
                    <button type="submit" className="py-1 px-3 bg-primary-red rounded-2xl text-white hover:opacity-70 underline">Add Route</button>
                </section>

            </form>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense>
            <AddSuggestionRoute />
        </Suspense>
    )
}