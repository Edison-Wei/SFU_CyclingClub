'use client'

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { parseRoute } from "../component/parseRoute";
import axios from "axios";
import { useRouter } from "next/navigation";

let id = 0;

const initialTimeValues = {
    startTime: "",
    message: ""
};

export default function InsertRoute() {
    const [routeInformation, setRouteInformation] = useState(""); // Will be a string containing the route information (Format of .gpx, .geojson, or .json)
    const [geojsonData, setGeojsonData] = useState(null);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [zoom, setZoom] = useState(0);
    const [distance, setDistance] = useState("");

    const [time, setTime] = useState(initialTimeValues);
    const [routeRadio, setRouteRadio] = useState(false);
    const Map = useMemo(() => dynamic(() => import('@/app/dashboard/component/Map'), { ssr: false, loading: () => <p>Loading Map and Route</p> }));

    const router = useRouter();

    async function handleSubmit(formData) {
        if(geojsonData === "") {
            alert("Route could not be processed.\nPlease select a different .gpx or .geojson file");
            return;
        }

        const title = formData.get("title").split(";")[0]; // Can be anything (expect ;)
        const difficulty = formData.get("difficulty"); // Either Beginner or Intermediate
        const date = formData.get("date"); // Date has to be today's date or after (Format of yyyy-mm-dd)
        const startTime = formData.get("startTime"); // In 24 hour format
        const endTime = formData.get("endTime"); // In 24 hour format (Has to be greater than startTime)


        try {
            const res = axios.post("/api/Routes/postExecRoute", {
                title: title,
                difficulty: difficulty,
                gpx: routeInformation,
                distance: distance,
                startDate: date,
                startTime: startTime,
                endTime: endTime,
            });

            alert((await res).data.result);
            router.push("/dashboard");
        } catch (error) {
            alert(error.response.data.error);
        }
    }

    function handleFileInput(e) {
        const fileData = new FileReader();
        fileData.readAsText(e.target.files[0], "UTF-8");
        fileData.onload = e => {
            const loadedRoute = e.target.result.split(";")[0];
            setRouteInformation(loadedRoute);
            setGeojsonData("");

            const routeInfo = parseRoute({gpx: loadedRoute});

            setLatitude(routeInfo.latitude);
            setLongitude(routeInfo.longitude);
            setZoom(routeInfo.zoom);
            setDistance((routeInfo.distance > 1000? routeInfo.distance/1000 : routeInfo.distance));
            setGeojsonData(routeInfo.geojson);
        };
    };

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
            <form action={handleSubmit} className="w-full p-12 flex flex-col gap-14 bg-gray-300 rounded-xl shadow-xl lg:text-[20px] text-[14px]">
                <h1 className="-my-5 font-semibold lg:text-[30px] text-[20px]">Add a Route<span className="p-2 text-[10px] md:text-[15px] text-primary-red">All required</span></h1>

                <section className="md:grid md:grid-cols-2 flex flex-col gap-4"> 
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Ride Title</label>
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
                    <h1 className="font-medium">Route: Either In File format (.gpx, .json, .geojson) or Text</h1>
                    <div className="flex gap-10 pl-5">
                        <div className="">
                            <input type="radio" name="routeInput" checked={!routeRadio} onChange={() => setRouteRadio(!routeRadio)} className="w-[20px]"></input>
                            <label className="">GPX/geojson</label>
                        </div>
                        <div>
                            <input type="radio" name="routeInput" checked={routeRadio} onChange={() => setRouteRadio(!routeRadio)} className="w-[20px]"></input>
                            <label className="">Text</label>
                        </div>
                    </div>
                    {!routeRadio && (<div className="flex flex-col">
                        <label className="">Select a GPX or GeoJSON file (Please have a Waypoint/Point indicating the start and end positions)</label>
                        {geojsonData === ""? (<label className="font-semibold text-primary-red">Please select a formatted (.gpx, .geojson) file </label>) : null}
                        <input type="file" accept=".gpx,.geojson" onChange={handleFileInput} className="w-full bg-gray-300 border-4 border-gray-300" required></input> {/* To add .json support later */}
                        {routeInformation && <Map geoData={geojsonData} center={[latitude, longitude]} zoom={zoom} id={id++}/>} {/* Put label here when file cannot be read and parsed */}
                    </div>)}

                    {routeRadio && (<div className={`z-10 transition duration-500 ${routeRadio? "translate-x-0": "translate-x-full"}`}>
                        <h2>Text</h2>
                        <input className="w-1/2 max-h-screen h-32 bg-white sm:text-[10px] md:text-[15px] rounded-md"></input>
                        <button onClick={handleRouteText}></button>
                        {routeInformation && <Map />}
                    </div>)}

                </section>

                <section className="">
                    <button type="submit" className="py-1 px-3 bg-primary-red rounded-2xl text-white hover:opacity-70">Insert Route</button>
                </section>

            </form>
        </div>
    );
}