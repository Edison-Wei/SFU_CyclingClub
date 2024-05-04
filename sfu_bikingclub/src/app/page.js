"use client"
import Hero from "@/components/Hero"
import Header from "../components/Header"
import TextWithButton from "../components/TextWithButton";
import { SmallText, CreateLink } from "../components/TextWithButton";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { month, weekDay } from "@/components/DateFormat";

async function fetchUpcommingRoute() {
  try {
    const currentDate = new Date().toISOString();
    const res = await axios.get(`/api/Routes/getUpcomingRoute?currentDate=${currentDate.slice(0,10)}`);

    return res.data.routes;
  } catch (error) {
    console.error("Failed to fetch UpcomingRoute: ", error);
    // Send error data 
    return [];
  }
}

function DisplayInformation({ routeInfo }) {
  const startdate = new Date(routeInfo.start_date);

  return(
    <div className="grid grid-rows-5 gap-4 p-6 text-[16px] font-semibold">
      <span className="place-self-center text-[20px] font-bold">
        {routeInfo.title.toUpperCase()}
      </span>
      <div>
        Difficulty: <span className="font-normal">{routeInfo.difficulty}</span>
      </div>
      <div>
        Distance <span className="font-normal">{routeInfo.distance}</span>km
      </div>
      <div>
        Date: <span className="font-normal">{`${weekDay(startdate.getDay())}, ${month(startdate.getMonth())} ${startdate.getDate()} ${startdate.getFullYear()}`}</span>
      </div>
      <div>
        Time: <span className="font-normal">{`${routeInfo.start_time.slice(0,5)} - ${routeInfo.end_time.slice(0,5)} PST`}</span>
      </div>
    </div>
  )
}

export default function Home() {
  const [routes, setRoutes] = useState();
  const [selection, setSelection] = useState(0);
  const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <p>Map is Loading</p> });

  useEffect(() => {
    fetchUpcommingRoute().then(res => (
      setRoutes(res)
    ));
  }, []);

  function onclick(info) {
    switch(info) {
      case "beginner":
        setSelection(1);
        break;
      default:
        setSelection(0);
        break;
    }
  }

  // dark:invert-[.95] dark:hue-rotate-180
  return (
    <div className="">
      <Header />
      <Hero />
      <div className="w-full h-full">
        <div className="flex justify-around items-center h-screen bg-black text-white">
          <div className="">
            <TextWithButton title={"Upcoming Rides!"} text={"Come join us on any of our upcoming rides!"} stext={""} link={"https://www.strava.com/clubs/1079967"} linkName={"Strava"} />
            <ul className="grid grid-cols-2 w-full justify-items-center">
              <li>
                <button onClick={() => onclick("intermediate")} className={`underline hover:text-primary-red`}>Intermediate</button>
              </li>
              <li>
                <button onClick={() => onclick("beginner")} className={`underline hover:text-primary-red`}>Beginner</button>
              </li>
            </ul>
            {routes && <DisplayInformation routeInfo={routes && routes[selection]} />}
          </div>
          <div className="flex flex-col justify-evenly h-full bg-black text-white">
            <SmallText stext={"Upcoming Ride"} />
            <Map geoData={routes && routes[selection].gpx} id={selection} /> {/* switch between beginnerRoute and intermediateRoute*/}
            <CreateLink link={"./Suggestion"} linkText={"Make a Suggestion"} />
          </div>
        </div>
        <div className="flex justify-around items-center md:h-[400px] lg:h-[600px] xl:h-[800px]">
          <div>
            Safety Information
          </div>
          <div>
            Gear to bring on rides
          </div>
        </div>
        <div className="flex justify-around md:h-[400px] lg:h-[600px] xl:h-[850px] items-center bg-black text-white">
          <div className="w-1/2 h-1/2">
            <img src={`https://hips.hearstapps.com/hmg-prod/images/coastal-cyclists-credit-bob-markisello-1575992964.jpg?crop=0.642xw:1.00xh;0.187xw,0&resize=980:*`}
              alt={"Group photo of the Cycling Club (Once it happens)"}
              className="h-auto w-auto" />
          </div>
          <p id="joinInformation" />
          <TextWithButton title={"Ready To Join the SFU Cycling Club?"} text={"Hello World!"} stext={"Join Our Riding Community"} link={"https://www.sfu.ca/"} linkName={"Discord"} />
        </div>
      </div>
    </div>
  )
}
