"use client"

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useMemo } from "react";
import { parseRoute, RouteInfo } from "@/components/services/RouteParser";

const initialRouteData: RouteInfo = {
    geojson: null,
    totalDistance: 0,
    latitude: 0,
    longitude: 0,
    elevation: 0,
    zoom: 0,
};

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
};

interface FormFeedback {
    type: 'success' | 'error' | null;
    message: string;
}

async function fetchRouteInfo(rid: string | null) {
    if (!rid) return null;
    try {
        const res = await fetch(`/api/Routes/getRouteInfo?rid=${rid}`, {
            method: "GET",
        });
        if (!res.ok) {
            throw new Error(`HTTP fetch error! Status: ${res.status}`);
        }
        const data = await res.json();
        return data.resultRouteInfo;
    } catch (error) {
        console.error("Error fetching route info: ", error);
        return null;
    }
}

function EditRoute() {
    const [discardForm, setDiscardForm] = useState(false);
    const [currentRoute, setCurrentRoute] = useState(initialCurrentRoute);
    const [routeInformation, setRouteInformation] = useState("");
    const [routeData, setRouteData] = useState(initialRouteData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [feedback, setFeedback] = useState<FormFeedback>({ type: null, message: "" });
    const [errorMessage, setErrorMessage] = useState({ time: "" });

    const params = useSearchParams().get("rid");
    const router = useRouter();

    const Map = useMemo(() => dynamic(
        () => import('@/components/Map'),
        { ssr: false, loading: () => <p className="text-secondary text-sm animate-pulse p-4">Loading Map Workspace...</p> }
    ), []);

    useEffect(() => {
        const loadData = async () => {
            if (!params) return;
            const response = await fetchRouteInfo(params);
            if (response && response[0]) {
                const routeInfo = response[0];
                const parsedRoute = parseRoute(routeInfo);
                delete routeInfo.gpx;
                delete routeInfo.date_created;
                setCurrentRoute({ ...routeInfo, ...parsedRoute });
            } else {
                setFeedback({ type: 'error', message: "Target route information could not be retrieved from database." });
            }
        }
    }, [params]);

    async function handleSubmit(formData: FormData) {
        setFeedback({ type: null, message: "" });
        setErrorMessage({ time: "" });
        const inputViolations = { time: "" };

        const title = (formData.get("title") as string)?.split(";")[0] || currentRoute.title;
        const difficulty = formData.get("difficulty") || currentRoute.difficulty;
        const date = formData.get("date") || currentRoute.start_date;
        const startTime = formData.get("startTime") || currentRoute.start_time;
        const endTime = formData.get("endTime") || currentRoute.end_time;

        if (startTime && endTime && startTime > endTime) {
            inputViolations.time = "End window must close after opening start time.";
            setErrorMessage(inputViolations);
            router.push("#time");
            return;
        }

        if (discardForm) {
            setFeedback({ type: 'error', message: "Security honeypot flag triggered. Relocating..." });
            setTimeout(() => router.push("/"), 1500);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/Routes/postUpdateRoute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rid: params,
                    title,
                    difficulty,
                    gpx: routeInformation || undefined,
                    distance: routeInformation ? routeData.totalDistance : currentRoute.distance,
                    start_Date: date,
                    start_Time: startTime,
                    end_Time: endTime,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to apply server path update. Status: ${res.status}`);
            }

            setFeedback({
                type: 'success',
                message: `${data.result || "Changes saved successfully!"} Returning to dashboard...`
            });

            setTimeout(() => {
                router.push("/dashboard");
            }, 2500);

        } catch (error: any) {
            setFeedback({
                type: 'error',
                message: error.message || "An infrastructure error dropped the request payload."
            });
            setIsSubmitting(false);
        }
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        const fileData = new FileReader();
        fileData.readAsText(e.target.files[0], "UTF-8");
        fileData.onload = event => {
            const resultText = event.target?.result as string;
            const [loadedRoute, injection] = resultText.split(";");

            if (injection) setDiscardForm(true);

            setRouteInformation(loadedRoute);
            const routeInfo = parseRoute(loadedRoute);
            setRouteData(routeInfo);
        };
    }

    return (
        <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-8 lg:px-16 flex flex-col items-center justify-start gap-6 transition-colors duration-200">

            {feedback.type && (
                <div
                    role="alert"
                    className={`alert fixed top-4 z-10 max-w-4xl bg-base-100 shadow-md border ${feedback.type === 'success'
                            ? 'alert-success border-success/20 text-success-content'
                            : 'alert-secondary border-error/20 text-primary/80'
                        }`}
                >
                    <span>{feedback.message}</span>
                </div>
            )}

            <form action={handleSubmit} className="w-full max-w-4xl p-6 sm:p-10 flex flex-col gap-8 bg-base-200 rounded-box border border-base-300 shadow-xl">

                <header className="border-b border-base-300 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">Edit Route Profile</h1>
                    <p className="text-xs font-semibold text-secondary mt-1 max-w-xl leading-relaxed">
                        Only provide input details for variables you want updated. Active live settings are documented directly below empty form inputs.
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="form-control md:col-span-2">
                        <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Ride Title</label>
                        <input type="text" className="input input-bordered w-full bg-base-300 text-base-content font-medium" name="title" placeholder="Keep current or enter new title..." />
                        {currentRoute.title && (
                            <span className="text-xs font-semibold text-base-content px-1 mt-1.5 block opacity-80">
                                Current: <span className="font-normal text-secondary">{currentRoute.title}</span>
                            </span>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Ride Difficulty</label>
                        <select className="select select-bordered w-full bg-base-300 text-base-content font-medium" name="difficulty" defaultValue="">
                            <option value="">No change (Retain settings)</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                        </select>
                        {currentRoute.difficulty && (
                            <span className="text-xs font-semibold text-base-content px-1 mt-1.5 block opacity-80">
                                Current: <span className="font-normal text-secondary">{currentRoute.difficulty}</span>
                            </span>
                        )}
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="time">
                    <div className="form-control">
                        <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Ride Date</label>
                        <input type="date" className="input input-bordered w-full bg-base-300 text-base-content" name="date" />
                        {currentRoute.start_date && (
                            <span className="text-xs font-semibold text-base-content px-1 mt-1.5 block opacity-80">
                                Current: <span className="font-normal text-secondary">{currentRoute.start_date.slice(0, 10)}</span>
                            </span>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Start Window</label>
                        <input type="time" className="input input-bordered w-full bg-base-300 text-base-content" name="startTime" />
                        {currentRoute.start_time && (
                            <span className="text-xs font-semibold text-base-content px-1 mt-1.5 block opacity-80">
                                Current: <span className="font-normal text-secondary">{currentRoute.start_time.slice(0, 5)}</span>
                            </span>
                        )}
                    </div>
                    <div className="form-control">
                        <div className="flex justify-between items-center label">
                            <label className="font-bold text-xs uppercase tracking-wider text-secondary">End Window</label>
                            {errorMessage.time && <span className="text-[11px] text-error font-semibold animate-pulse">{errorMessage.time}</span>}
                        </div>
                        <input type="time" className={`input input-bordered w-full bg-base-300 text-base-content ${errorMessage.time ? 'input-error' : ''}`} name="endTime" />
                        {currentRoute.end_time && (
                            <span className="text-xs font-semibold text-base-content px-1 mt-1.5 block opacity-80">
                                Current: <span className="font-normal text-secondary">{currentRoute.end_time.slice(0, 5)}</span>
                            </span>
                        )}
                    </div>
                </section>

                <section className="p-4 sm:p-6 rounded-box bg-base-100 border border-neutral/5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-sm font-300 text-base-content uppercase">Update Route Blueprint</h2>
                        <p className="text-xs text-secondary mt-0.5">Leave blank to retain current vector coordinates, or drop an updated file profile.</p>
                    </div>

                    <div className="form-control w-full mt-1">
                        <input type="file" accept=".gpx,.geojson" onChange={handleFileInput} className="file-input file-input-bordered file-input-sm w-full max-w-md bg-base-300 text-base-content" />
                    </div>

                    {routeInformation && routeData.geojson && (
                        <div className="w-full mt-4 rounded-box overflow-hidden border border-base-100 shadow-inner relative">
                            <Map geoData={routeData.geojson} center={[routeData.latitude, routeData.longitude]} zoom={routeData.zoom} />
                            <div className="absolute bottom-5 right-3 bg-base-100/90 backdrop-blur-xs px-2 py-1 rounded text-xs font-300 text-base-content shadow-xs">
                                Updated Distance: {routeData.totalDistance ? `${routeData.totalDistance.toFixed(2)} km` : '0.00 km'}
                            </div>
                        </div>
                    )}
                </section>

                <footer className="flex items-center justify-end gap-4 border-t border-base-300 pt-6">
                    <div className="hidden">
                        <label>Security Phone Verification</label>
                        <input type="text" name="phoneNumber" tabIndex={-1} autoComplete="off" onChange={() => setDiscardForm(true)} />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary px-8 text-primary-content font-bold tracking-wide uppercase shadow-md transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving Updates..." : "Save Route Changes"}
                    </button>
                </footer>

            </form>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-12 text-center font-bold text-secondary text-sm animate-pulse">Initializing Layout Core Hooks...</div>}>
            <EditRoute />
        </Suspense>
    );
}