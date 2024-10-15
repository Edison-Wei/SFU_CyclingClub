"use client";
import Hero from "@/components/Hero";
import Header from "../components/Header";
import TextWithButton from "../components/TextWithButton";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { month, weekDay } from "@/components/DateTimeFormat";
import SlideShow from "@/components/Slideshow";
import Image from "next/image";
import Link from "next/link";
import { parseRoute } from "../components/parseRoute";
import { initialRoute } from "@/components/types/routeTypes";

async function fetchUpcommingRoute() {
  try {
    const res = await axios.get(`/api/Routes/getUpcomingRoute`);

    return res.data.results;
  } catch (error) {
    const errorRes = error.response.data.results;

    return errorRes;
  }
}

function DisplayInformation({ routeInfo }) {
  const startdate = new Date(routeInfo.start_date);

  return (
    <div className="grid grid-rows-5 gap-4 p-2 md:p-4 lg:p-6 text-[16px] md:text-[18px] lg:text-[20px] font-semibold">
      <span className="place-self-center p-2 md:text-[22px] font-bold">
        {routeInfo.title.toUpperCase()}
      </span>
      <div>
        Difficulty: <span className="font-normal">{routeInfo.difficulty}</span>
      </div>
      <div>
        Distance: <span className="font-normal">{routeInfo.distance} km</span>
      </div>
      <div>
        Date: <span className="font-normal">{`${weekDay(startdate.getDay())}, ${month(startdate.getMonth())} ${startdate.getDate()}, ${startdate.getFullYear()}`}</span>
      </div>
      <div>
        {/* Can be 12 hour format for better readability */}
        Time: <span className="font-normal">{`${routeInfo.start_time.slice(0, 5)} - ${routeInfo.end_time.slice(0, 5)} PST`}</span>
      </div>
    </div>
  )
}


export default function Home() {
  const [routes, setRoutes] = useState(initialRoute);
  const [selection, setSelection] = useState(0);
  const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <p>Loading Map and Route</p> });


  useEffect(() => {
    fetchUpcommingRoute().then(res => {
      const routeinfo = res.map(route => {
        // parseGPX only works on browser(client) not on server
        const parsedRoute = parseRoute(route);
        delete route.gpx;
        delete route.date_created;
        return {
          ...route,
          ...parsedRoute
        }
        // Just a reminder of the output
        // return {
        //   rid: route.rid,
        //   title: route.title,
        //   geojson: parsedRoute.geojson,
        //   latitude: parsedRoute.latitude,
        //   longitude: parsedRoute.longitude,
        //   elevation: parsedRoute.elevation,
        //   zoom: parsedRoute.zoom,
        //   difficulty: route.difficulty,
        //   distance: route.distance,
        //   start_date: route.start_date,
        //   start_time: route.start_time,
        //   end_time: route.end_time,
        // }
      });
      setRoutes(routeinfo);
    }
  );
  }, []);


  return (
    <div className="">
      <Header />
      <Hero />
      <div className="flex flex-col justify-center items-center bg-white text-black py-12">
        <p className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold mb-4">Ready to Ride?</p>
        <p className="text-md md:text-lg lg:text-lg xl:text-lg mb-4 text-center max-w-2xl">
          Our doors are open to everyone at SFU! Whether you&apos;re a seasoned cyclist or a newcomer to the sport, we welcome you to join us.
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
            <ul className="grid grid-cols-2 w-full justify-items-center text-[14px] md:text-[18px]">
              <li>
                <button onClick={() => setSelection(0)} className={`underline hover:text-primary-red`}>Intermediate</button>
              </li>
              <li>
                <button onClick={() => setSelection(1)} className={`underline hover:text-primary-red`}>Beginner</button>
              </li>
            </ul>
            {routes && <DisplayInformation routeInfo={routes[selection]} />}
          </div>
          {/* Right Section */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/2 bg-gray-100 text-black px-4 sm:px-6 lg:px-8">
            <div className="hidden md:block mb-4 md:text-[20px]">
              Upcoming Ride
            </div>
            <div className="md:h-[40vh] w-[35vh] lg:h-[75vh] lg:w-[80vh]">
                {routes && <Map geoData={routes[selection].geojson} center={[routes[selection].latitude, routes[selection].longitude]} zoom={routes[selection].zoom} id={selection} />}
            </div>
            <Link href={"./Suggestion"} className="md:pt-4 md:px-4 h-full underline hover:text-primary-red">{"Make a Suggestion"}</Link>
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
          <h3 className="text-xl text-primary-red mb-4">This Month&apos;s Distance Biked</h3>
          <p className="text-7xl font-bold text-primary-red mb-4">849.7 km</p>
          <p className="text-xl text-primary-red">Keep pushing those pedals!</p>
        </div>

        <div className="text-center md:w-1/2 p-6">
          <p className="text-2xl font-bold text-primary-red mb-4">Contribute Your Rides</p>
          <p className="text-xl text-primary-red mb-6">Be a part of our community and track your progress with us!</p>
        </div>
      </div>


      <SlideShow />


      <section className="my-16 py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xlg p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-4xl font-bold text-primary-red mb-8">Our Sponsors</h2>
            <p className="text-lg text-gray-700 mb-8">
              We are grateful for the support of our sponsors, who make our club&apos;s activities possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 items-center">
              {/* Sponsor 1 */}
              <div className="flex justify-center">
                <Image src={"/sfss.png"} width={350} height={350} alt={"SFSS Sponsor Logo"} className="h-20 md:h-24 lg:h-32 object-contain"></Image>
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
