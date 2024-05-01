"use client"
import Hero from "@/components/Hero"
import Header from "../components/Header"
import TextWithButton from "../components/TextWithButton";
import { SmallText, CreateLink } from "../components/TextWithButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

async function fetchUpcommingRoute() {
  try {
    const currentDate = new Date().toISOString()
    const res = await axios.get(`/api/Routes/getUpcomingRoute?currentDate=${currentDate.slice(0,10)}`);

    return res.data;
  } catch (error) {
    console.error("Failed fetch on UpcomingRoute: ", error);

    return {};
  }
}


export default function Home() {
  const [route, setRoute] = useState({});
  const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <p>Map is Loading</p> });

  useEffect(() => {
    fetchUpcommingRoute().then(res => setRoute(res));
  }, []);

  // console.log(route);

  // dark:invert-[.95] dark:hue-rotate-180
  return (
    <div className="">
      <Header />
      <Hero />
      <div className="">
        <div className="flex justify-around items-center md:h-[400px lg:h-[600px] xl:h-[800px] bg-black text-white">
          <div className="">
            <TextWithButton title={"Upcoming Rides!"} text={"Come join us on any of our upcoming rides!"} stext={""} link={"https://www.strava.com/clubs/1079967"} linkName={"Strava"}></TextWithButton>
          </div>

          <div className="flex justify-around items-center md:h-[400px] lg:h-[600px] xl:h-[800px] bg-black text-white">
            <div className="">
              <SmallText stext={"Upcoming Ride"} />
              <Map />
              <CreateLink link={"./Suggestion"} linkText={"Make a Suggestion"} />
            </div>
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