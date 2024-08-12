'use client'

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { parseGPX } from "@we-gold/gpxjs"
import { CalculateGeojson } from "../component/CalculateGeojson";

let id = 0;

export default function InsertRoute() {
    // Information to be inserted into MySQL Database
    const [title, setTitle] = useState(""); // Can be anything (expect ;)
    const [difficulty, setDifficulty] = useState(""); // Either beginner or intermediate
    const [date, setDate] = useState(""); // Date has to be today's date or after (Format of yyyy-mm-dd)
    const [startTime, setStartTime] = useState(""); // In 24 hour format
    const [endTime, setEndTime] = useState(""); // In 24 hour format (Has to be greater than startTime)
    const [routeInformation, setRouteInformation] = useState(""); // Will be a string containing the route information (Format of .gpx, .geojson, or .json)
    const [geojsonData, setGeojsonData] = useState("");
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [zoom, setZoom] = useState();
    const [distance, setDistance] = useState("");


    const [routeRadio, setRouteRadio] = useState(false);
    const Map = useMemo(() => dynamic(() => import('@/app/dashboard/component/Map'), { ssr: false, loading: () => <p>Loading Map and Route</p> }))

    // console.log(file);
    // console.log(typeof(file));

    function handleSubmit(formData) {
        // event.preventDefault();
        const title = formData.get("title").split(";")[0]; // Can be anything (expect ;)
        const difficulty = formData.get("difficulty"); // Either beginner or intermediate
        const date = formData.get("date"); // Date has to be today's date or after (Format of yyyy-mm-dd)
        const startTime = formData.get("startTime"); // In 24 hour format
        const endTime = formData.get("endTime"); // In 24 hour format (Has to be greater than startTime)
        const distance = formData.get("distance"); // Will be a string containing the route information (Format of .gpx, .geojson, or .json)

        console.log(title);
        console.log(difficulty);
        console.log(date);
        console.log(startTime);
        console.log(endTime);
        console.log(distance);
    }

    function handleFileInput(e) {
        const fileData = new FileReader();
        fileData.readAsText(e.target.files[0], "UTF-8");
        fileData.onload = e => {
            setRouteInformation(e.target.result.split(";")[0]);
            setGeojsonData("");
            console.log(e.target.result);
            console.log(e.target.result.split(";")[0]);

            try {
                const [parsedFile, error] = parseGPX(e.target.result);
                if(error)
                    throw new Error("502: Could not read GPX file"); // Change to object with status to check

                const totalDistance = parsedFile.tracks[0].distance.total;
                const pointOne = parsedFile.tracks[0].points[0];
                const pointTwo = parsedFile.tracks[0].points[parsedFile.tracks[0].points.length-1];

                // Calculate zoom distance (0 space - 10 cities)
                const tan = Math.tan(45);
                let lat = pointOne.latitude - pointTwo.latitude;
                lat = (lat < 0? lat*-1: lat);
                let lng = pointOne.longitude - pointTwo.longitude;
                lng = (lng < 0? lng*-1: lng);
                const zoom = 12 - (lat > lng? lat * tan : lng * tan);

                // Calculate the center of pointOne and pointTwo
                lat = (pointOne.latitude + pointTwo.latitude)/2;
                lng = (pointOne.longitude + pointTwo.longitude)/2;


                setLatitude(lat);
                setLongitude(lng);
                setZoom(zoom);
                setDistance(totalDistance);
                setGeojsonData(parsedFile.toGeoJSON());
            } catch (error) {
                // console.log(error); // Check this status

                const GeoJSON = JSON.parse(e.target.result);
                if(GeoJSON.type != "Feature" && GeoJSON.type != "FeatureCollection")
                    return;

                const jsonData  = CalculateGeojson(GeoJSON);
                if (!jsonData)
                    return;
                console.log("hello");

                setLatitude(jsonData.latitude);
                setLongitude(jsonData.longitude);
                setZoom(jsonData.zoom);
                setDistance(jsonData.totalDistance);
                setGeojsonData(GeoJSON);
            }
        };
        // setGeojsonData(parsedFile.toGeoJSON())
    };

    return (
        <div className="py-4 md:px-24 px-14 h-full">
            <form action={handleSubmit} className="w-full p-12 flex flex-col gap-14 bg-gray-300 rounded-xl shadow-xl lg:text-[20px] text-[14px]">
                <h1 className="-my-5 font-semibold lg:text-[30px] text-[20px]">Add a Route<span className="p-2 text-[10px] md:text-[15px] text-primary-red">All required</span></h1>

                <section className="grid grid-cols-2"> 
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Ride Title</label>
                        <input className="bg-white w-[80%] rounded-lg shadow-md" name="title" placeholder="Ride title..."></input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="pr-3 font-normal">Ride difficulty:</label>
                        <select className="p-2 w-[40%] rounded-md shadow-md" name="difficulty">
                            <option value={"beginner"}>Beginner</option>
                            <option value={"intermediate"}>Intermediate</option>
                        </select>
                    </div>
                </section>
                <section className="grid grid-cols-3 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Ride date:</label>
                        <input type="date" className="w-[70%] bg-white rounded-lg shadow-md" name="date"></input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">Start time:</label>
                        <input type="time" className="w-[70%] bg-white rounded-lg shadow-md" name="startTime"></input>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-normal">End time:</label>
                        <input type="time" className="w-[70%] bg-white rounded-lg shadow-md" name="endTime"></input>
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
                        <input type="file" accept=".gpx,.geojson" onChange={handleFileInput} className="bg-gray-300 border-4 border-gray-300"></input> {/* To add .json support later */}
                        {routeInformation && <Map geoData={geojsonData} center={[latitude, longitude]} zoom={zoom} id={id = id++}/>} {/* Put label here file cannot be parsed or read*/}
                    </div>)}

                    {routeRadio && (<div className={`z-10 transition duration-500 ${routeRadio? "translate-x-0": "translate-x-full"}`}>
                        <h2>Text</h2>
                        <input className="w-1/2 max-h-screen h-32 bg-white sm:text-[10px] md:text-[15px] rounded-md"></input>
                        <button onClick={handleRouteText}></button>
                        {routeInformation && <Map />}
                    </div>)}

                </section>

                <section className="">
                    <button type="submit" className="">Insert Route</button>
                </section>

            </form>
        </div>
    );
}

const data = {
    title: "No active",
    gpx: "",
    difficulty: "null",
    distance: 0,
    start_date: "2024-01-01",
    start_time: "00:00",
    end_time: "00:00"
  }