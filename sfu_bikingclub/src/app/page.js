"use client";
import Hero from "@/components/Hero";
import Header from "../components/Header";
import TextWithButton from "../components/TextWithButton";
import { SmallText, CreateLink } from "../components/TextWithButton";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { month, weekDay } from "@/components/DateFormat";

async function fetchUpcommingRoute() {
  try {
    const currentDate = new Date().toISOString();
    const res = await axios.get(`/api/Routes/getUpcomingRoute?currentDate=${currentDate.slice(0, 10)}`);

    return res.data.routes;
  } catch (error) {
    console.error("Failed to fetch UpcomingRoute: ", error);
    const data = {
      title: "No active",
      gpx: "",
      difficulty: "null",
      distance: 0,
      start_date: "2024-01-01",
      start_time: "00:00",
      end_time: "00:00"
    }

    return [data, data];
  }
}

function DisplayInformation({ routeInfo }) {
  const startdate = new Date(routeInfo.start_date);

  return (
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
        Time: <span className="font-normal">{`${routeInfo.start_time.slice(0, 5)} - ${routeInfo.end_time.slice(0, 5)} PST`}</span>
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
    switch (info) {
      case "beginner":
        setSelection(1);
        break;
      default:
        setSelection(0);
        break;
    }
  }

  return (
    <div className="">
      <Header />
      <Hero />
      <div className="flex flex-col justify-center items-center bg-white text-black py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Ride?</h2>
        <p className="text-lg mb-4 text-center max-w-2xl">
          Our doors are open to everyone at SFU! Whether you're a seasoned cyclist or a newcomer to the sport, we welcome you to join us.
        </p>
        <a href="https://go.sfss.ca/clubs/916/info" className="text-white bg-primary-red hover:bg-gray-500 font-bold py-2 px-4 rounded">
          Join Us
        </a>
      </div>
      <div className="w-full h-full">
        <div className="flex justify-around items-center h-screen bg-gray-100 text-black">
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
          <div className="flex flex-col justify-evenly h-full bg-gray-100 text-black">
            <SmallText stext={"Upcoming Ride"} />
            <Map geoData={routes && routes[selection].gpx} id={selection} />
            <CreateLink link={"./Suggestion"} linkText={"Make a Suggestion"} />
          </div>
        </div>
        <div className="flex justify-around items-center md:h-[400px] lg:h-[600px] xl:h-[800px]">
          <div className="flex flex-col">
            <h3 className="text-[40px] font-semibold mb-2 mx-4">Before Joining Us</h3>
            <h3 className="text-[40px] font-semibold mb-2">On Any Of Our Rides</h3>
          </div>

          <div className="max-w-2xlg p-8 bg-white shadow-lg rounded-lg">
            <p className="text-gray-700 mb-4">What to bring/wear:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Bicycle and helmet</li>
              <li>Comfortable shoes and appropriate clothing for the weather (check the weather forecast)</li>
              <li>Enough water and snacks for the ride</li>
              <li>Front and tail lights</li>
              <li>A set of tools and a spare tube (make sure everything is tuned and working)</li>
            </ul>
            <a href="/SFSS-Liability-and-Assumption-of-Risk-Waivers.pdf" download className="text-blue-500 underline">Download Waiver Form</a>
          </div>
        </div>
        <div className="flex justify-around md:h-[400px] lg:h-[600px] xl:h-[850px] items-center bg-gray-100 text-black">
          <div className="w-1/2 h-1/2">
            <img src={`https://hips.hearstapps.com/hmg-prod/images/coastal-cyclists-credit-bob-markisello-1575992964.jpg?crop=0.642xw:1.00xh;0.187xw,0&resize=980:*`}
              alt={"Group photo of the Cycling Club (Once it happens)"}
              className="h-auto w-auto" />
          </div>
          <p id="joinInformation" />
          <TextWithButton title={"Ready To Join the SFU Cycling Club?"} text={"Discord Link Here"} stext={"Join Our Riding Community"} link={"https://www.sfu.ca/"} linkName={"Discord"} />
        </div>
      </div>
    </div>
  )
}
