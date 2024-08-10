"use client";
import Hero from "@/components/Hero";
import Header from "../components/Header";
import TextWithButton from "../components/TextWithButton";
import { SmallText, CreateLink } from "../components/TextWithButton";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { month, weekDay } from "@/components/DateFormat";
import Slideshow from "@/components/SlideShow";

async function fetchUpcommingRoute() {
  try {
    const currentDate = new Date().toISOString();
    const res = await axios.get(`/api/Routes/getUpcomingRoute?currentDate=${currentDate.slice(0, 10)}`);

    return res.data.routes;
  } catch (error) {
    console.error("Failed to fetch UpcomingRoute: ", error);
    const data = {
      title: "No active routes",
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
        Date: <span className="font-normal">{`${weekDay(startdate.getDay())}, ${month(startdate.getMonth())} ${startdate.getDate()}, ${startdate.getFullYear()}`}</span>
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
  const Map = useMemo(() => dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <p>Loading Map</p> }))


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
        <p className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold mb-4">Ready to Ride?</p>
        <p className="text-md md:text-lg lg:text-lg xl:text-lg mb-4 text-center max-w-2xl">
          Our doors are open to everyone at SFU! Whether you're a seasoned cyclist or a newcomer to the sport, we welcome you to join us.
        </p>
        <a href="https://linktr.ee/sfucycling" className="text-white bg-primary-red hover:bg-gray-500 font-bold py-2 px-4 rounded">
          Join Us
        </a>
      </div>

      <div className="w-full h-full">
        <div className="flex flex-col md:flex-row justify-between items-start bg-gray-100 text-black px-4 py-6">
          {/* Left Section */}
          <div className="flex flex-col w-full md:w-1/2 mb-4 md:mb-0 lg:py-12">
            <TextWithButton
              title={"Details on our upcoming ride"}
              text={"Click your level to see the different routes"}
              stext={""}
              link={"https://www.strava.com/clubs/1079967"}
              linkName={"Strava"}
            />
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
          {/* Right Section */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/2 bg-gray-100 text-black px-4 sm:px-6 lg:px-8">
            <SmallText stext={"Upcoming Ride"} className="text-center mb-4" />
            <div className="w-full max-w-full overflow-hidden">
              <Map geoData={routes && routes[selection].gpx} id={selection} />
            </div>
            <CreateLink link={"./Suggestion"} linkText={"Make a Suggestion"} className="mt-4" />
          </div>
        </div>
      </div>



      <div className="flex justify-around items-center md:h-[400px] lg:h-[600px] xl:h-[800px]">
        <div className="text-center p-6">
          <h3 className="sm:text-lg md:text-2xl lg:text-3xl font-semibold mb-2 mx-4">Before Joining Us</h3>
          <h3 className="sm:text-lg md:text-2xl lg:text-3xl font-semibold mb-2 mx-2">On Any Of Our Rides</h3>
        </div>

        <div className="max-w-2xlg p-8 bg-white shadow-lg rounded-lg">
          <p className="sm:text-md md:text-lg lg:text-xl text-gray-700 mb-4">What to bring/wear:</p>
          <ul className="sm:text-md md:text-lg lg:text-xl list-disc list-inside text-gray-700 mb-4">
            <li>Bicycle and helmet</li>
            <li>Comfortable shoes and appropriate clothing for the weather (check the weather forecast)</li>
            <li>Enough water and snacks for the ride</li>
            <li>Front and tail lights</li>
            <li>A set of tools and a spare tube (make sure everything is tuned and working)</li>
          </ul>
          <a href="/SFSS-Liability-and-Assumption-of-Risk-Waivers.pdf" download className="text-md text-blue-500 underline">Download Waiver Form</a>
        </div>
      </div>



      <div className="w-full p-12 bg-gradient-to-r from-gray-100 to-gray-300 shadow-lg rounded-lg flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:w-1/2 p-6 md:border-r-2 border-gray-400">
          <h3 className="text-xl text-primary-red mb-4">This Month's Distance Biked</h3>
          <p className="text-7xl font-bold text-primary-red mb-4">849.7 km</p>
          <p className="text-xl text-primary-red">Keep pushing those pedals!</p>
        </div>

        <div className="text-center md:w-1/2 p-6">
          <p className="text-2xl font-bold text-primary-red mb-4">Contribute Your Rides</p>
          <p className="text-xl text-primary-red mb-6">Be a part of our community and track your progress with us!</p>
        </div>
      </div>




      <Slideshow />


      <section className="my-16 py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xlg p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-4xl font-bold text-primary-red mb-8">Our Sponsors</h2>
            <p className="text-lg text-gray-700 mb-8">
              We are grateful for the support of our sponsors, who make our club's activities possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 items-center">
              {/* Sponsor 1 */}
              <div className="flex justify-center">
                <img
                  src="/sfss.png"
                  alt="Sponsor 1 Logo"
                  className="h-20 md:h-24 lg:h-32 object-contain"
                />
              </div>
              {/* Sponsor 2
              <div className="flex justify-center">
                <img
                  src="/sponsor2-logo.jpg"
                  alt="Sponsor 2 Logo"
                  className="h-20 md:h-24 lg:h-32 object-contain"
                />
              </div>
              {/* Sponsor 3 
              <div className="flex justify-center">
                <img
                  src="/sponsor3-logo.jpg"
                  alt="Sponsor 3 Logo"
                  className="h-20 md:h-24 lg:h-32 object-contain"
                />
              </div>
              {/* Sponsor 4 
              <div className="flex justify-center">
                <img
                  src="/sponsor4-logo.jpg"
                  alt="Sponsor 4 Logo"
                  className="h-20 md:h-24 lg:h-32 object-contain"
                />
              </div> */}
              {/* Add more sponsors as needed */}
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
