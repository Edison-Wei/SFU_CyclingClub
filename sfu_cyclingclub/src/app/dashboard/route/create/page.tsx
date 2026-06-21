'use client'

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { parseRoute, RouteInfo } from "@/components/services/RouteParser";
import { useRouter } from "next/navigation";

const initialTimeValues = {
    startTime: "",
    endTime: "",
    message: "",
};

interface FormFeedback {
    type: 'success' | 'error' | null;
    message: string;
}

export default function CreateRoute() {
    const [discardForm, setDiscardForm] = useState(false);
    const [routeInformation, setRouteInformation] = useState("");
    const [routeData, setRouteData] = useState<RouteInfo | null>(null);
    const [routeText, setRouteText] = useState("");
    const [time, setTime] = useState(initialTimeValues);
    const [routeRadio, setRouteRadio] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [feedback, setFeedback] = useState<FormFeedback>({ type: null, message: "" });
    const [fileError, setFileError] = useState<string | null>(null);

    const Map = useMemo(() => dynamic(
        () => import('@/components/Map'),
        { ssr: false, loading: () => <p className="text-secondary text-sm animate-pulse p-4">Loading Map Workspace...</p> }
    ), []);

    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setFeedback({ type: null, message: "" });
        setFileError(null);

        if (!routeData) {
            setFileError("Please provide a valid GPX or GeoJSON. Route data parsing failed.");
            setFeedback({ type: 'error', message: "Form submission failed. Upload a GPX or GeoJSON file." });
            return
        }

        if (!routeRadio && !routeData.geojson) {
            setFileError("Please provide a valid path configuration. Route data parsing failed.");
            setFeedback({ type: 'error', message: "Form submission blocked. Fix spatial data errors." });
            return;
        }

        const title = (formData.get("title") as string).split(";")[0];
        const difficulty = formData.get("difficulty");
        const date = formData.get("start_date");
        const startTime = formData.get("start_Time");
        const endTime = formData.get("end_Time");
        const description = formData.get("description");

        if (discardForm) {
            setFeedback({ type: 'error', message: "Security flag triggered. Redirecting to home index..." });
            setTimeout(() => router.push("/"), 2000);
            return;
        }

        if (time.message) {
            setFeedback({ type: 'error', message: "Please correct time sequencing conflicts before submitting." });
            return;
        }

        formData.append("gpx", routeRadio ? routeText : routeInformation)
        formData.append("distance", String(routeData.totalDistance))

        console.log(title)
        console.log(difficulty)
        console.log(date)
        console.log(startTime)
        console.log(endTime)
        console.log(description)
        console.log(routeData.totalDistance)

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/Routes/postExecRoute", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                body: formData
            })

            const data = await response.json();

            // Fetch doesn't throw errors on 4xx/5xx codes, so we verify res.ok manually
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! Status: ${response.status}`);
            }

            setFeedback({
                type: 'success',
                message: `${data.result || "Route built successfully!"} Relocating to management directory...`
            });

            setTimeout(() => {
                router.push("/dashboard");
            }, 2500);

        } catch (error: any) {
            const serverErrorMessage = error.response?.data?.error || "A Network issue has occurred";
            setFeedback({
                type: 'error',
                message: serverErrorMessage
            });
            setIsSubmitting(false);
        }
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        setFileError(null);
        if (!e.target.files || e.target.files.length === 0) return;

        const fileData = new FileReader();
        fileData.readAsText(e.target.files[0], "UTF-8");
        fileData.onload = event => {
            try {
                const loadedRoute = (event.target?.result as string).split(";")[0];
                setRouteInformation(loadedRoute);

                const routeInfo = parseRoute(loadedRoute);

                if (!routeInfo || !routeInfo.geojson) {
                    throw new Error("Unable to identify standard tracking loops or coordinate maps.");
                }

                setRouteData(routeInfo);
            } catch (err: any) {
                setFileError(err.message || "Invalid formatting schema inside selected file.");
                setRouteData(null);
                setRouteInformation("");
            }
        };
    }

    function handleTimeInput(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setTime(prev => {
            const updated = { ...prev, [name]: value };
            const currentStart = name === "start_Time" ? value : updated.startTime;
            const currentEnd = name === "end_Time" ? value : updated.endTime;

            if (currentStart && currentEnd && currentStart > currentEnd) {
                updated.message = "End time window must close after opening start time.";
            } else {
                updated.message = "";
            }
            return updated;
        });
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

                <header className="border-b border-base-300 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                        Create Route Profile
                    </h1>
                    <span className="text-xs font-semibold text-secondary bg-error/10 px-2 py-1 rounded-sm uppercase tracking-wider">
                        All Fields Required
                    </span>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="form-control md:col-span-2">
                        <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Ride Title</label>
                        <input type="text" className="input input-bordered w-full bg-base-300 text-base-content font-medium" name="title" placeholder="e.g. Morning Coastal Loop" required />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Difficulty Deck</label>
                        <select className="select select-bordered w-full bg-base-300 text-base-content font-medium" name="difficulty">
                            <option value="Beginner">Beginner</option>
                            {/* <option value="Moderate">Moderate</option> */}
                            <option value="Intermediate">Intermediate</option>
                        </select>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="form-control">
                        <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Ride Date</label>
                        <input type="date" className="input input-bordered w-full bg-base-300 text-base-content" name="start_date" required />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Start Time</label>
                        <input type="time" className="input input-bordered w-full bg-base-300 text-base-content" name="start_Time" onChange={handleTimeInput} required />
                    </div>
                    <div className="form-control">
                        <div className="flex justify-between items-center label">
                            <label className="font-bold text-xs uppercase tracking-wider text-secondary">End Time</label>
                            {time.message && <span className="text-[11px] text-secondary font-semibold animate-pulse">{time.message}</span>}
                        </div>
                        <input type="time" className={`input input-bordered w-full bg-base-300 text-base-content ${time.message ? 'input-secondary' : ''}`} name="end_Time" onChange={handleTimeInput} required />
                    </div>
                </section>

                <section className="form-control w-full">
                    <label className="label font-bold text-xs uppercase tracking-wider text-secondary">Ride Details & Logistics</label>
                    <textarea className="textarea textarea-bordered h-32 w-full bg-base-300 text-base-content text-base leading-relaxed resize-y" name="description" placeholder="Inform riders of pacing requirements, terrain changes, safety protocols..." />
                </section>

                <section className="p-4 sm:p-6 rounded-box bg-base-100 border border-neutral/5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-sm font-300 text-base-content uppercase">Route Blueprint</h2>
                        <p className="text-xs text-secondary mt-0.5">Choose to upload an active tracking node file or inject plain structural string maps.</p>
                    </div>

                    <div className="flex gap-6 mt-1">
                        <label className="label cursor-pointer flex items-center gap-2">
                            <input type="radio" name="routeInput" checked={!routeRadio} onChange={() => setRouteRadio(false)} className="radio radio-primary radio-sm" />
                            <span className="text-sm font-300 text-base-content">GPX / GeoJSON</span>
                        </label>
                        <label className="label cursor-pointer flex items-center gap-2">
                            <input type="radio" name="routeInput" checked={routeRadio} onChange={() => setRouteRadio(true)} className="radio radio-primary radio-sm" />
                            <span className="text-sm font-300 text-base-content">Text</span>
                        </label>
                    </div>

                    {!routeRadio ? (
                        <div className="form-control w-full mt-2">
                            <label className="text-xs font-medium text-secondary mb-2">Select a GPX/GeoJson file with start/end anchors: </label>
                            <input
                                type="file"
                                accept=".gpx,.geojson"
                                onChange={handleFileInput}
                                className={`file-input file-input-bordered file-input-sm w-full max-w-md bg-base-300 text-base-content ${fileError ? 'file-input-secondary' : ''}`}
                                required={!routeRadio}
                            />
                            {fileError && <p className="text-xs text-secondary font-medium mt-1.5">{fileError}</p>}
                        </div>
                    ) : (
                        <div className="form-control w-full mt-2">
                            <textarea className="textarea textarea-bordered h-40 font-mono text-xs w-full bg-base-300 text-base-content" placeholder="Paste raw coordinate sequence mapping or route data text payload here..." value={routeText} onChange={(e) => setRouteText(e.target.value)} required={routeRadio} />
                        </div>
                    )}

                    {routeData && (
                        <div className="w-full mt-4 rounded-box overflow-hidden border border-base-100 shadow-inner relative">
                            <Map geoData={routeData.geojson} center={[routeData.latitude, routeData.longitude]} zoom={routeData.zoom} />
                            <div className="absolute bottom-5 right-3 bg-base-100/90 backdrop-blur-xs px-2 py-1 rounded text-xs font-300 text-base-content shadow-xs">
                                Calculated Track: {routeData.totalDistance ? `${routeData.totalDistance.toFixed(2)} km` : '0.00 km'}
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
                        disabled={isSubmitting || !!time.message}
                        className="btn btn-primary px-8 text-primary-content font-bold tracking-wide uppercase shadow-md transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "Uploading Profile..." : "Create Route"}
                    </button>
                </footer>

            </form>
        </div>
    );
}