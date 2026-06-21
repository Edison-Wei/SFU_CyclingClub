"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Route, DEFAULT_ROUTE, RawRoute, ProcessRawRoutes } from "@/types/RouteType";
import HeroBanner from "@/components/Hero";
import SlideShow from "@/components/SlideShow";
import Image from "next/image";
import Link from "next/link";
import { month, weekDay } from "@/components/DateTimeFormat";
import { BEGINNER_ROUTE_DETAILS_1, INTERMEDIATE_ROUTE_DETAILS_1 } from "@/_static_data/RouteDetails";

function DisplayInformation({ routeInfo }: { routeInfo: Route }) {
  const startdate = new Date(routeInfo.start_date);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-4">
        <h3 className="underline underline-offset-4 p-4 font-bold text-lg">
          {routeInfo.title.toUpperCase()}
        </h3>
      </div>

      <div className="stats stats-vertical w-full bg-base-300 shadow-sm border border-base-300">
        <div className="stat px-6">
          <div className="stat-title text-xs uppercase font-bold opacity-60">Difficulty</div>
          <div className="stat-value text-sm md:text-2xl text-secondary">{routeInfo.difficulty.toUpperCase()}</div>
        </div>

        <div className="stat px-6">
          <div className="stat-title text-xs uppercase font-bold opacity-60">Description</div>
          <div className="stat-value text-sm md:text-lg text-secondary">{routeInfo.description}</div>
        </div>

        <div className="stat px-6">
          <div className="stat-title text-xs uppercase font-bold opacity-60">Distance</div>
          <div className="stat-value text-sm md:text-2xl text-primary">{routeInfo.distance} km</div>
        </div>

        <div className="stat px-6">
          <div className="stat-title text-xs uppercase font-bold opacity-60">Scheduled Date</div>
          <div className="stat-desc text-base-content font-semibold text-lg">
            {`${weekDay(startdate.getDay())}, ${month(startdate.getMonth())} ${startdate.getDate()}`}
          </div>
        </div>

        <div className="stat px-6">
          <div className="stat-title text-xs uppercase font-bold opacity-60">Start / End Time</div>
          <div className="stat-desc text-base-content font-semibold text-lg">
            {`${routeInfo.start_time.slice(0, 5)} - ${routeInfo.end_time.slice(0, 5)} PST`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [routes, setRoutes] = useState<Route[]>([DEFAULT_ROUTE]);
  const [selection, setSelection] = useState(0);
  const Map = dynamic(() => import("@/components/Map"), { ssr: false, loading: () => <div className="skeleton w-full h-full rounded-box"></div> });

  const WHAT_TO_BRING = [
    "Bicycle and helmet (mandatory)",
    "Weather-appropriate clothing & shoes",
    "Sufficient water and snacks",
    "Front and tail lights",
    "Basic tool kit and spare tube"
  ]
  console.log(routes)

  useEffect(() => {
    const fetchUpcomingRoutes = async () => {
      // const response = await fetch('/api/upcomingroutes', {
      // })
      // const data = await response.json()

      const data = [INTERMEDIATE_ROUTE_DETAILS_1, BEGINNER_ROUTE_DETAILS_1]
      setRoutes(ProcessRawRoutes(data))
    }
    fetchUpcomingRoutes()
  }, [])
  const startdate = new Date(routes[0].start_date);

  return (
    <main className="">
      <HeroBanner />

      <section className="hero bg-base-100 py-16 transition-colors duration-300">
        <div className="hero-content text-center">
          <div className="max-w-2xl px-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-base-content font-black tracking-tight mb-6 uppercase">
              Ready to <span className="text-primary">Ride?</span>
            </h2>

            <p className="text-lg md:text-xl text-base-content mb-10 leading-relaxed">
              Our doors are open to everyone at SFU! Whether you&apos;re a seasoned cyclist or a newcomer to the sport, we welcome you to join us.
            </p>
            <div className="flex justify-center">
              <a
                href="https://linktr.ee/sfucycling"
                className="btn btn-primary btn-wide md:btn-lg text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Join Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-base-100 py-6 md:py-12 transition-colors duration-300">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex flex-col items-stretch gap-6 md:flex-row">

            <div className="card w-full bg-base-200 shadow-sm md:w-1/2 border border-base-300">
              <div className="card-body p-6 lg:p-10">

                <div className="text-center mb-6">
                  <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-primary">
                    Upcoming Ride Details
                  </h2>
                  <p className="mt-2 text-base-content/70">
                    Select your experience level to view the route and schedule.
                  </p>
                  <Link
                    href="https://linktr.ee/sfucycling"
                    className="btn btn-link btn-primary btn-sm no-underline hover:underline mt-2"
                  >
                    View on Strava →
                  </Link>
                </div>

                <div className="tabs tabs-boxed bg-base-200 border border-2 border-base-neutral grid grid-cols-2 mb-8">
                  <button
                    onClick={() => setSelection(0)}
                    className={`tab tab-lg transition-all duration-200 font-bold ${selection === 0 ? "tab-active !bg-primary !text-white" : "hover:text-primary"}`}
                  >
                    Intermediate
                  </button>
                  <button
                    onClick={() => setSelection(1)}
                    className={`tab tab-lg transition-all duration-200 font-bold ${selection === 1 ? "tab-active !bg-primary !text-white" : "hover:text-primary"}`}
                  >
                    Beginner
                  </button>
                </div>

                <DisplayInformation routeInfo={routes[selection]} />
              </div>
            </div>

            <div className="flex w-full flex-col md:w-1/2">
              <div className="card h-full bg-base-200 shadow-sm border border-base-300 overflow-hidden">
                <div className="hidden md:flex items-center justify-between px-8 py-4 bg-base-300/30 border-b border-base-300">
                  <span className="font-black uppercase tracking-widest text-base-content text-sm opacity-70">Upcoming Ride Map</span>
                  {/* <div className="badge badge-primary badge-outline">
                    Change when swift app is live streaming
                    {null &&<span className="badge badge-xs badge-primary rounded-full animate-pulse"></span>}
                    Live Route
                  </div> */}
                </div>

                <div className="hidden md:block flex-grow min-h-[40vh] lg:min-h-[600px] w-full bg-base-300">
                  {routes && (
                    <Map
                      key={selection}
                      geoData={routes[selection].geojson}
                      center={[routes[selection].latitude, routes[selection].longitude]}
                      zoom={routes[selection].zoom}
                    />
                  )}
                </div>

                <div className="p-4 bg-base-100 border-t border-base-300">
                  <Link
                    href="/suggestion"
                    className="btn btn-ghost btn-block md:btn-sm text-primary gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Suggest a Route
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      <section className="flex flex-col items-center justify-around gap-12 py-16 px-4 md:flex-row md:h-[500px] lg:h-[600px] bg-base-100 transition-colors">

        <div className="text-center text-accent md:text-left md:w-1/3">
          <h3 className="text-2xl font-black uppercase tracking-tight md:text-3xl lg:text-5xl">
            Before <span className="text-primary">Joining Us</span>
          </h3>
          <p className="mt-4 text-lg font-medium opacity-70 md:text-xl lg:text-2xl">
            On Any Of Our Rides
          </p>
        </div>

        <div className="card w-full max-w-2xl bg-base-200 shadow-md border border-base-300 sm:p-4">
          <div className="card-body">
            <h4 className="card-title text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              What to bring/wear:
            </h4>

            <ul className="space-y-3 md:text-lg lg:text-xl text-base-content/80">
              {WHAT_TO_BRING.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="card-actions mt-8 justify-end">
              <a
                href="/SFSS-Liability-and-Assumption-of-Risk-Waivers.pdf"
                download
                className="btn btn-ghost btn-sm text-primary hover:bg-primary/10 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Waiver Form
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="p-12 bg-gradient-to-r from-base-100 to-base-300 shadow-lg flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:w-1/2 p-6 md:border-r-2 border-info">
          <h3 className="text-xl text-secondary mb-4">This Month&apos;s Distance Biked</h3>
          <p className="text-7xl font-bold text-primary mb-4">849.7 km</p>
          <p className="text-xl text-secondary">Keep pushing those pedals!</p>
        </div>
        <div className="text-center md:w-1/2 p-6">
          <p className="text-2xl font-bold text-secondary mb-4">Contribute Your Rides</p>
          <p className="text-xl text-secondary mb-6">Be a part of our community and track your progress with us!</p>
        </div>
      </div>

      <SlideShow />

      <section className="bg-base-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card bg-base-100 text-base shadow-xl">
            <div className="card-body items-center text-center p-8 md:p-12">

              <h2 className="card-title text-4xl font-black text-primary mb-4 md:text-5xl">
                OUR SPONSORS
              </h2>

              <p className="max-w-2xl text-lg text-secondary opacity-90 mb-10">
                We are grateful for the support of our sponsors, who make our club&apos;s activities possible.
              </p>

              <div className="grid grid-cols-1 items-center justify-center gap-12 md:grid-cols-2 lg:grid-cols-3">

                <div className="group flex justify-center">
                  <Image
                    src="/sfss.png"
                    width={350}
                    height={150}
                    alt="SFSS Sponsor Logo"
                    className="h-24 w-auto object-contain"
                  />
                </div>

                {/* Add more sponsors below with the same div wrapper */}
                {/* <div className="group flex justify-center transition-transform duration-300 hover:scale-105">
                <img src="/sponsor-2.png" alt="Sponsor" className="h-20 object-contain" />
              </div> 
              */}

              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <p>Thing</p>
//       </main>
//     </div>
//   );
// }
