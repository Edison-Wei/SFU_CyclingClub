"use client"
import dynamic from "next/dynamic";
import { useState } from "react";
import { parseRoute } from "../../components/parseRoute";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import axios from "axios";

let id = 0;
const initialRouteData = {
    geojson: null,
    latitude: 0,
    longitude: 0,
    zoom: 0,
    distance: 0
}

export default function Suggestion() {
    const [discardForm, setDiscardForm] = useState(false); // True, if ';' semicolon is detected in the cases below and honeypot inputs. False otherwise
    const [routeInformation, setRouteInformation] = useState(""); // Will be a string containing the route information (Format of .gpx, .geojson, or .json)
    const [routeData, setRouteData] = useState(initialRouteData);
    const [errorMessage, setErrorMessage] = useState({
        email: "",
        routeText: ""
    });
    // const [routeText, setRouteText] = useState(""); // Used for the Textarea can be changed
    const [showSubmitted, setShowSubmitted] = useState(false);

    const [routeRadio, setRouteRadio] = useState(false);
    const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <p>Loading Map and Route</p> });


    const router = useRouter();

    async function handleSubmit(formdata) {
        const inputViolations = {};
        const email = formdata.get("email");
        const routeText = formdata.get("routeText");
        let routeInfo;

        if (email.match("[^A-Za-z0-9@.]") || !email.includes("@sfu.ca")) {
            inputViolations.email = "No special characters (expect @.) and have sfu.ca ending";
            router.push("#email")
        }
        
        if (routeRadio) {
            routeInfo = handleRouteText(routeText);
            if (routeInfo.geojson === "") {
                inputViolations.routeText = "Cannot process route. Check the route format";
                router.push("#route");
            }
        }
        else {
            if (routeData.geojson === "") {
                inputViolations.routeText = "Cannot process route. Check the route format";
                router.push("#route");
            }
        }

        setErrorMessage(inputViolations);
        
        if (Object.keys(inputViolations).length != 0)
            return;

        if(discardForm) {
            setShowSubmitted(true);
            return;
        }

        try {
            await axios.post("/api/Routes/postSuggestRoute", {
                created_by: email,
                gpx: (routeRadio? routeText.split(";")[0]: routeInformation),
                distance: routeData.distance
            });

            setShowSubmitted(true);
        } catch (error) {
            alert("501: Can not add route suggestion. Please contact an executive about this issue.");
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

    function handleRouteText(routeText) {
        const [loadedRoute, injection] = routeText.split(";");
        if(injection)
            setDiscardForm(true);

        setRouteInformation(loadedRoute);

        const routeInfo = parseRoute({gpx: loadedRoute});

        setRouteData(routeInfo);
        return routeInfo;
    };

    return (
        <>
        <Header />
        <FormSubmitted showSubmitted={showSubmitted} router={router} />
        <div className="md:py-4 md:px-24 px-14 h-full">
            <form action={handleSubmit} className="w-full pt-8 px-12 pb-12 flex flex-col gap-12 bg-gray-300 rounded-xl shadow-xl lg:text-[20px] text-[14px]">
                <div className="" id="email">
                    <h1 className="font-semibold md:text-[30px] text-[20px]">Suggest a Route<span className="p-2 text-[10px] md:text-[15px] text-primary-red">All required</span></h1>
                    <p className="ml-3 md:text-[20px] text-[12px]">
                        Only members of the SFU Cycling Club may suggest cycling routes. <a href="https://go.sfss.ca/clubs/916/info" className="text-primary-red hover:text-gray-500 font-medium underline">Click here to become a member.</a> <br/>
                        Suggest a cycling route using a <span className="font-bold">GPX</span> or <span className="font-bold">GeoJSON</span> file format..
                    </p>
                </div>

                <section className="flex flex-col">
                    <div className="flex flex-col gap-1">
                        <label className="font-medium">SFU Email <span className="text-primary-red font-semibold">{errorMessage.email}</span></label>
                        <input className={`bg-white w-[80%] md:w-[50%] rounded-lg ${errorMessage.email? "border-2 border-primary-red shadow-xl" : "shadow-md"}`} name="email" placeholder="abc01@sfu.ca" required></input>
                    </div>
                    {/* To handle unwanted forms */}
                    <div className="hidden">
                        <label className="font-normal">Name</label>
                        <input type="text" className="bg-white w-[80%] rounded-lg shadow-md" name="name" placeholder="holder..." onChange={() => setDiscardForm(true)}></input>
                    </div>
                </section>

                <section className="w-full flex flex-col gap-2" id="route">
                    <div className="">
                        <h1 className="font-medium">Route: Either In File format (.gpx, .geojson) or Paste a route using Text</h1>
                    </div>
                    <div className="flex gap-10 pl-5">
                        <div className="">
                            <input type="radio" name="routeInput" checked={!routeRadio} onChange={() => setRouteRadio(!routeRadio)} className="w-[20px]"></input>
                            <label className="">GPX/GeoJSON</label>
                        </div>
                        <div>
                            <input type="radio" name="routeInput" checked={routeRadio} onChange={() => setRouteRadio(!routeRadio)} className="w-[20px]"></input>
                            <label className="">Route Text</label>
                        </div>
                    </div>
                    {!routeRadio && (<div className="flex flex-col">
                        <label className="">Select a GPX or GeoJSON file (have a Waypoint/Point indicating the start and end positions)</label>
                        {routeData.geojson === ""? (<label className="font-semibold text-primary-red">File processing failed. Please try another file or check the file format.</label>) : <label className="font-semibold">Then, check the map below to verify that the route has been correctly processed.</label>}
                        <input type="file" accept=".gpx,.geojson" onChange={handleFileInput} className="md:w-1/2 w-full bg-gray-300 border-4 border-gray-300" required></input> {/* To add .json support later */}
                        {routeInformation &&
                        <div className="relative md:h-[40vh] w-[45vh] lg:h-[75vh] lg:w-[90vh] bg-gray-300">
                            <div className="absolute">
                                <Map geoData={routeData.geojson} center={[routeData.latitude, routeData.longitude]} zoom={routeData.zoom} id={id++}/> {/* Put label here when file cannot be read and parsed */}
                            </div>
                        </div>}
                    </div>)}

                    {routeRadio && (<div className="flex flex-col">
                        <h2 className="underline">Paste in your route in one of the following ways:</h2>
                        <ul className="list-disc ml-6">
                            <li>GPX/GeoJSON format (have a Waypoint/Point indicating the start and end positions)</li>
                            <li>Google Maps shareable link (ex. <a href="https://maps.app.goo.gl/2JeceEBMmBnkMejw8" className="font-medium underline">https://maps.app.goo.gl/2JeceEBMmBnkMejw8</a>)</li>
                        </ul>
                        <span className="text-primary-red font-semibold">{errorMessage.routeText}</span>
                        <textarea className="my-3 p-2 w-[70%] max-h-screen h-[40vh] bg-white sm:text-[10px] md:text-[15px] shadow-lg rounded-md" name="routeText"></textarea>
                        {/* TODO: Fix route text map view, correctly it keeps refreshing after any changes to email and routeText */}
                        {/* {routeText != ""? 
                        <button type="button" onClick={() => handleRouteText()} className={`py-1 px-3 w-fit text-white rounded-xl bg-primary-red underline`}>Click here and check below to verify the route is correctly processed.</button>
                        : 
                        <p className="py-1 px-3 w-fit text-white rounded-xl bg-gray-500 underline">Click here and check below to verify the route is correctly processed.</p>}
                        {routeInformation && <Map geoData={routeData.geojson} center={[routeData.latitude, routeData.longitude]} zoom={routeData.zoom} id={id++}/>} */}
                    </div>)}

                </section>

                <section className="mt-12">
                    <div className="hidden">
                        <label className="font-normal">Name</label>
                        <input type="text" className="bg-white w-[80%] rounded-lg shadow-md" name="phoneNumber" placeholder="holder..." onChange={() => setDiscardForm(true)}></input>
                    </div>
                    <button type="submit" className="py-1 px-3 bg-primary-red rounded-2xl text-white hover:opacity-70 underline">Submit Route</button>
                </section>

            </form>
        </div>
        </>
    );
}

const FormSubmitted = ({ showSubmitted, router }) => {
    if(!showSubmitted)
        return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-80">
            <div className="w-1/3 rounded-md border-2 border-primary-red transition duration-500 ease-in">
                <div className="p-6 md:px-12 md:py-16 flex flex-col gap-12 items-center bg-white rounded-lg text-center">
                    <h1 className="font-semibold md:text-[28px] text-[20px]">Route Received</h1>
                    <div className="text-[14px] md:text-[18px]">
                        <p className="pb-4">Thank you for suggesting a Route. One of our executives will look over the route and plan accordingly.</p>
                        <p>Check out the Home page to view the upcoming planned Cycling Rides and Follow our social media to stay up to date on planned rides, events, and more.</p>
                    </div>
                    <button className="text-[12px] md:text-[18px] underline font-medium hover:opacity-60" onClick={() => router.replace("/")}>Return Home</button>
                </div>
            </div>
        </div>
    )
}