"use client"

import dynamic from "next/dynamic";
import { useState, useTransition, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_ROUTE, parseRoute, RouteInfo } from "@/components/services/RouteParser";
import { Route } from "@/types/RouteType";

// Dynamic import for the Map component to prevent SSR issues
const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="skeleton w-full h-[400px] rounded-box"></div>
});


export default function Suggestion() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // UI State
    const [routeRadio, setRouteRadio] = useState(false); // false = File, true = Text
    const [showSubmitted, setShowSubmitted] = useState(false);
    const [processingStatus, setProcessingStatus] = useState(false);

    // Data State
    const [routeData, setRouteData] = useState<RouteInfo>(DEFAULT_ROUTE);
    const [errorMessage, setErrorMessage] = useState({ fullname: "", email: "", file: "", routeText: "" });

    const processRoutePayload = (text: string) => {
        const [loadedRoute, routeInjection] = text.split(";");
        if (routeInjection) setProcessingStatus(true);

        const info = parseRoute(loadedRoute);
        setRouteData(info);
        return info;
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setRouteData(DEFAULT_ROUTE);
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            processRoutePayload(result);
        };
        reader.readAsText(file);
    };

    async function handleSubmit(formData: FormData) {
        setErrorMessage({ fullname: "", email: "", file: "", routeText: "" });

        const fullname = formData.get("fullname") as string;
        const email = formData.get("email") as string;
        const routeText = formData.get("routeText") as string;
        const file = formData.get("routefile")
        const violations = { fullname: "", email: "", file: "", routeText: "" };

        if (fullname.split(" ").length > 1) {
            violations.fullname = "Enter your full name"
        }
        // Validation: SFU Email Check
        if (!email.match(/^[A-Za-z0-9._%+-]+@sfu\.ca$/)) {
            violations.email = "Must be a valid @sfu.ca email.";
        }

        if (routeRadio) {
            if (routeText) {
                violations.routeText = "Please provide a valid route (GPX/GeoJSON).";
            }
        }
        else {
            if (!file) {
                violations.file = "GPX or GeoJSON file must be given."
            }
        }
        if (!file && !routeRadio) {
        }

        if (violations.email || violations.file || violations.routeText || violations.fullname) {
            setErrorMessage(violations);
            return;
        }

        // Honeypot logic
        if (processingStatus) {
            setShowSubmitted(true);
            return;
        }

        startTransition(async () => {
            try {
                const response = await fetch("/api/suggestroute", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: formData,
                })
                setShowSubmitted(true);
            } catch (error) {
                console.error(error);
                alert("Submission failed. Please contact an executive via Discord.");
            }
        });
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
            <FormSubmitted showSubmitted={showSubmitted} onHome={() => router.replace("/")} />

            <main className="max-w-4xl mx-auto py-12 px-6">
                <form action={handleSubmit} className="card bg-base-200 shadow-xl border border-base-300 overflow-hidden">
                    <div className="card-body p-8 gap-8">
                        {/* Header */}
                        <header className="border-b border-base-300 pb-6">
                            <h1 className="text-4xl font-black text-primary tracking-tight">
                                Suggest a Route
                                <span className="badge badge-secondary badge-sm ml-3 align-middle">SFU Exclusive</span>
                            </h1>
                            <p className="mt-3 text-base-content/80">
                                Help the community grow. Your suggestion will be reviewed by our ride leaders.
                                <a href="https://linktr.ee/sfucycling" target="_blank" className="link link-primary font-semibold ml-1">Not a member? Join here.</a>
                            </p>
                        </header>

                        <div className="flex flex-col gap-3">
                            <section className="space-y-6">
                                {/* Email Input */}
                                <div className="form-control w-full grid grid-cols-2">
                                    <div className="">
                                        <label className="label">
                                            <span className="label-text font-bold uppercase mb-1 tracking-wider text-base-content text-sm md:text-md">Full name</span>
                                        </label>
                                        <input
                                            name="fullname"
                                            type="fullname"
                                            placeholder="John Doe"
                                            className={`input input-bordered bg-base-100 focus:border-primary transition-all ${errorMessage.fullname ? 'input-error' : ''}`}
                                            required
                                        />
                                        {errorMessage.fullname && <span className="label-text-alt text-error mt-2">{errorMessage.fullname}</span>}
                                    </div>
                                    <div className="">
                                        <label className="label">
                                            <span className="label-text font-bold uppercase mb-1 tracking-wider text-base-content text-sm md:text-md">SFU Email</span>
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="student@sfu.ca"
                                            className={`input input-bordered bg-base-100 focus:border-primary transition-all ${errorMessage.email ? 'input-error' : ''}`}
                                            required
                                        />
                                        {errorMessage.email && <span className="label-text-alt text-error mt-2">{errorMessage.email}</span>}
                                    </div>
                                </div>

                                {/* Route Selection Strategy */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold uppercase mb-1 tracking-wider text-base-content text-sm md:text-md">Input Method</span>
                                    </label>
                                    <div className="join w-full">
                                        <button
                                            type="button"
                                            className={`btn join-item flex-1 ${!routeRadio ? 'btn-primary' : 'btn-ghost bg-base-300'}`}
                                            onClick={() => setRouteRadio(false)}
                                        >
                                            Upload File
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn join-item flex-1 ${routeRadio ? 'btn-primary' : 'btn-ghost bg-base-300'}`}
                                            onClick={() => setRouteRadio(true)}
                                            disabled={true}
                                        >
                                            Paste Code
                                        </button>
                                        {errorMessage.file && <p className="text-error text-xs mt-2 font-semibold">{errorMessage.file}</p>}
                                    </div>
                                </div>

                                {/* Dynamic Inputs */}
                                <div className="p-4 rounded-box bg-base-300/50 border border-base-300">
                                    {!routeRadio ? (
                                        <div className="space-y-3">
                                            <p className="text-xs font-medium text-base-content">Upload .gpx or .geojson</p>
                                            <input
                                                type="file"
                                                name="routefile"
                                                accept=".gpx,.geojson"
                                                onChange={handleFileInput}
                                                className="file-input file-input-bordered file-input-primary w-full bg-base-100"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-xs font-medium text-base-content">Paste Raw Data</p>
                                            <textarea
                                                name="routeText"
                                                className={`textarea textarea-bordered w-full h-32 font-mono text-xs bg-base-100 ${errorMessage.routeText ? 'textarea-error' : ''}`}
                                                placeholder='{"type": "FeatureCollection", ...}'
                                            ></textarea>
                                        </div>
                                    )}
                                    {errorMessage.routeText && <p className="text-error text-xs mt-2 font-semibold">{errorMessage.routeText}</p>}
                                </div>
                            </section>

                            {/* Preview Section */}
                            <section className="flex flex-col">
                                <label className="label">
                                    <span className="label-text font-bold uppercase tracking-wider mb-1 text-base-content/80 text-sm md:text-md">Route Preview</span>
                                </label>
                                <div className="flex-1 min-h-[40vh] lg:min-h-[75vh] w-full rounded-box overflow-hidden border border-base-300 bg-base-300 relative shadow-inner">
                                    {routeData.geojson ? (
                                        <Map
                                            key={routeData.totalDistance}
                                            geoData={routeData.geojson}
                                            center={[routeData.latitude, routeData.longitude]}
                                            zoom={routeData.zoom}
                                        />
                                    ) : (
                                        <div className="absolute inset-10 flex flex-col items-center justify-center text-base-content/30 p-6 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                            <p className="text-sm">Upload data to see route on map</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Honeypots */}
                        <div className="hidden">
                            <input name="name" tabIndex={-1} onChange={() => setProcessingStatus(true)} />
                            <input name="phoneNumber" tabIndex={-1} onChange={() => setProcessingStatus(true)} />
                        </div>

                        {/* Submit */}
                        <footer className="card-actions justify-end pt-6">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="btn btn-primary btn-wide text-lg shadow-lg"
                            >
                                {isPending ? <span className="loading loading-spinner"></span> : "Submit Suggestion"}
                            </button>
                        </footer>
                    </div>
                </form>
            </main>
        </div>
    );
}

const FormSubmitted = ({ showSubmitted, onHome }: { showSubmitted: boolean, onHome: () => void }) => {
    if (!showSubmitted) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box border-t-4 border-primary text-center py-10">
                <div className="flex justify-center mb-4">
                    <div className="bg-success/10 text-success p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h3 className="font-black text-3xl text-base-content">Route Sent!</h3>
                <div className="py-4 space-y-2">
                    <p className="text-lg">Your contribution has been logged.</p>
                    <p className="text-sm text-base-content/60">An executive will review the safety and difficulty of the route shortly.</p>
                </div>
                <div className="modal-action justify-center mt-6">
                    <button className="btn btn-primary btn-wide" onClick={onHome}>Return Home</button>
                </div>
            </div>
            <div className="modal-backdrop bg-black/80 backdrop-blur-sm"></div>
        </div>
    );
}