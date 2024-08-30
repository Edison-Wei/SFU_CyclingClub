"use client"

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { parseRoute } from "../../../components/parseRoute";

let id = 0;
const initialRouteData = {
    geojson: null,
    latitude: 0,
    longitude: 0,
    zoom: 0,
    distance: 0
}
const initialCurrentRoute = {
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

async function fetchRouteInfo(rid) {
    try {
        const res = await axios.get(`/api/Routes/getRouteInfo?rid=${rid}`);
        return res.data.resultRouteInfo;
      } catch (error) {
        console.error("Error fetching All routes: " + error)
        return ["Route cannot be fetched"];
      }
}

function EditRoute() {
    const [discardForm, setDiscardForm] = useState(false); // True, if ';' semicolon is detected in the cases below and honeypot inputs. False otherwise
    const [cuurrentRoute, setCurrentRoute] = useState(initialCurrentRoute);
    const [routeInformation, setRouteInformation] = useState(""); // Will be a string containing the route information (Format of .gpx, .geojson, or .json)
    const [routeData, setRouteData] = useState(initialRouteData);
    const [errorMessage, setErrorMessage] = useState({
        time: ""
    });
    const params = useSearchParams().get("rid");

    const Map = dynamic(() => import('@/app/dashboard/component/Map'), { ssr: false, loading: () => <p>Loading Map and Route</p> });
    const router = useRouter();

    useEffect(() => {
        fetchRouteInfo(params).then((res) => {
            let routeInfo = res[0];
            const parsedRoute = parseRoute(routeInfo);
            delete routeInfo.gpx;
            delete routeInfo.date_created;
            setCurrentRoute({...routeInfo, ...parsedRoute});
        })
    }, [])

    async function handleSubmit(formData) {
        const inputViolations = {};

        const title = formData.get("title").split(";")[0]; // Can be anything (expect ;)
        const difficulty = formData.get("difficulty"); // Either Beginner or Intermediate
        const date = formData.get("date"); // Date has to be today's date or after (Format of yyyy-mm-dd)
        const startTime = formData.get("startTime"); // In 24 hour format
        const endTime = formData.get("endTime"); // In 24 hour format (Has to be greater than startTime)

        if (startTime > endTime) {
            inputViolations.time = "Has to be past Start time";
            router.push("#time");
        }

        setErrorMessage(inputViolations);
        
        if (Object.keys(inputViolations).length != 0)
            return;

        if(discardForm) {
            router.push("/");
        }

        try {
            const res = await axios.post("/api/Routes/postUpdateRoute", {
                rid: params.rid,
                title: title,
                difficulty: difficulty,
                gpx: routeInformation,
                distance: routeData.distance,
                start_Date: date,
                start_Time: startTime,
                end_Time: endTime,
            });

            alert((await res).data.result + "\nSending you back to the dashboard");
            router.push("/dashboard");
        } catch (error) {
            alert(error.response.data.error);
        }
    }

    function handleFileInput(e) {
        const fileData = new FileReader();
        fileData.readAsText(e.target.files[0], "UTF-8");
        fileData.onload = e => {
            const [loadedRoute, injection] = e.target.result.split(";");

            if (injection)
                setDiscardForm(true);

            setRouteInformation(loadedRoute);

            const routeInfo = parseRoute({gpx: loadedRoute});

            setRouteData(routeInfo);
        };
    };


    return (
        <div className="md:py-4 md:px-24 px-14 h-full">
            <form action={handleSubmit} className="w-full pt-8 px-12 pb-12 flex flex-col gap-14 bg-gray-300 rounded-xl shadow-xl lg:text-[20px] text-[14px]">
                <div className="" id="email">
                    <h1 className="font-semibold md:text-[30px] text-[20px]">Edit Route</h1>
                    <p className="ml-3 md:text-[20px] text-[12px]">
                    Only make changes to the fields you want to be edited.<br />
                    All current Information about the route below.
                    </p>
                </div>

                <section className="md:grid md:grid-cols-2 flex flex-col gap-4"> 
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Ride Title:</label>
                        <input className="bg-white w-[80%] rounded-lg shadow-md" name="title" placeholder="Ride title..."></input>
                        <p className="md:w-[90%] md:ml-6 font-medium">{cuurrentRoute.title}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="pr-3 font-normal">Ride difficulty:</label>
                        <select className="p-2 w-[50%] rounded-md shadow-md" name="difficulty">
                            <option value={""}>none</option>
                            <option value={"Beginner"}>Beginner</option>
                            <option value={"Intermediate"}>Intermediate</option>
                        </select>
                        <p className="md:ml-3 font-medium">{cuurrentRoute.difficulty}</p>
                    </div>
                </section>
                <section className="md:grid md:grid-cols-3 flex flex-col gap-3 w-full" id="time">
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Ride date:</label>
                        <input type="date" className="w-[80%] bg-white rounded-lg shadow-md" name="date" ></input>
                        <p className="md:ml-6 font-medium">{cuurrentRoute.start_date.slice(0, 10)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Start time:</label>
                        <input type="time" className="w-[80%] bg-white rounded-lg shadow-md" name="startTime" label="startTime" ></input>
                        <p className="md:ml-6 font-medium">{cuurrentRoute.start_time.slice(0,5)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">End time: <span className="font-semibold text-primary-red lg:text-[16px] text-[10px]">{errorMessage.time}</span></label>
                        <input type="time" className="w-[80%] bg-white rounded-lg shadow-md" name="endTime" ></input>
                        <p className="md:ml-6 font-medium">{cuurrentRoute.end_time.slice(0, 5)}</p>
                    </div>
                </section>
                <section className="w-full flex flex-col gap-3">
                    <h1 className="font-medium">Route: In File format (.gpx, .json, .geojson)</h1>
                    <div className="flex flex-col">
                        <label className="">Select a GPX or GeoJSON file (Please have a Waypoint/Point indicating the start and end positions)</label>
                        {routeData.geojson === ""? (<label className="font-semibold text-primary-red">Please select a formatted (.gpx, .geojson) file </label>) : null}
                        <input type="file" accept=".gpx,.geojson" onChange={handleFileInput} className="md:w-1/2 w-full bg-gray-300 border-4 border-gray-300" required></input> {/* To add .json support later */}
                        {routeInformation && <Map geoData={routeData.geojson} center={[routeData.latitude, routeData.longitude]} zoom={routeData.zoom} id={id++}/>} {/* Put label here when file cannot be read and parsed */}
                    </div>

                </section>

                <section className="">
                    <div className="hidden">
                        <label className="font-normal">Name</label>
                        <input type="text" className="bg-white w-[80%] rounded-lg shadow-md" name="phoneNumber" placeholder="holder..." onChange={() => setDiscardForm(true)}></input>
                    </div>
                    <button type="submit" className="py-1 px-3 bg-primary-red rounded-2xl text-white hover:opacity-70 underline">Update Route</button>
                </section>

            </form>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense>
            <EditRoute />
        </Suspense>
    )
}