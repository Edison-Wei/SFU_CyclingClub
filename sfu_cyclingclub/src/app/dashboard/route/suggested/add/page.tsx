"use client"

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { parseRoute } from "@/components/services/RouteParser";
import { useRouter, useSearchParams } from "next/navigation";

export type RouteSuggestionInfo = {
    sid: number;
    created_by: string;
    geojson: any;
    latitude: number;
    longitude: number;
    zoom: number;
    distance: number;
};

const initialTimeValues = {
    startTime: "",
    message: ""
};

const initialRouteSuggestion: RouteSuggestionInfo = {
    sid: 0,
    created_by: "",
    geojson: null,
    latitude: 49.2790223,
    longitude: -122.9201949,
    zoom: 11.5,
    distance: 0
};

async function fetchRouteSuggestion(sid: string | null): Promise<any> {
    if (!sid) return null;
    try {
        const res = await fetch(`/api/Routes/getRouteSuggestionInfo?sid=${sid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data.resultsSuggestionInfo;
    } catch (error) {
        console.error("Error fetching route suggestion details: ", error);
        return null;
    }
}

function AddSuggestionRoute() {
    const searchParams = useSearchParams();
    const params = searchParams.get("sid");
    const router = useRouter();

    const [discardForm, setDiscardForm] = useState(false);
    const [routeSuggestion, setRouteSuggestion] = useState<RouteSuggestionInfo>(initialRouteSuggestion);
    const [routeInformation, setRouteInformation] = useState<string>("");
    const [time, setTime] = useState(initialTimeValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const Map = dynamic(() => import('@/components/Map'), {
        ssr: false,
        loading: () => (
            <div className="h-64 w-full bg-base-300 rounded-box flex items-center justify-center border border-base-300">
                <p className="text-secondary text-sm animate-pulse">Loading Map and Routes...</p>
            </div>
        )
    });

    useEffect(() => {

        const loadData = async () => {
            if (!params) {
                setFormError("No sid provided.");
                return;
            }
            const response = await fetchRouteSuggestion(params);
            if (!response || response.length === 0) {
                setFormError("Suggestion details could not be loaded from the server.");
                return;
            }
            const routeInfo = { ...response[0] };
            const parsedRoute = parseRoute(routeInfo);

            setRouteInformation(routeInfo.gpx || "");
            delete routeInfo.gpx;
            delete routeInfo.date_created;

            setRouteSuggestion({ ...routeInfo, ...parsedRoute });
        }

        loadData();
    }, [params]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError(null);

        if (!routeSuggestion.geojson) {
            setFormError("Route geometry could not be processed. Please use a different route profile.");
            return;
        }

        if (discardForm) {
            router.push("/");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);

        const title = (formData.get("title") as string).split(";")[0];
        const difficulty = formData.get("difficulty");
        const date = formData.get("date");
        const startTime = formData.get("startTime");
        const endTime = formData.get("endTime");
        const description = formData.get("description");

        try {
            const res = await fetch("/api/Routes/postSuggestToExec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sid: params,
                    title: title,
                    difficulty: difficulty,
                    description: description,
                    gpx: routeInformation,
                    distance: routeSuggestion.distance,
                    start_Date: date,
                    start_Time: startTime,
                    end_Time: endTime,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "An error occurred while uploading the route suggestion.");
            }

            alert((data.result || "Successfully processed") + "\nReturning to your Suggestions list.");
            router.push("/dashboard/suggestion");
        } catch (error: any) {
            setFormError(error.message || "Failed to finalize suggestion creation.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleTimeInput(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        if (name === "startTime") {
            setTime(prev => ({ ...prev, startTime: value }));
        }

        if (name === "endTime") {
            if (time.startTime && time.startTime > value) {
                setTime(prev => ({ ...prev, message: "End time must be after start time" }));
            } else {
                setTime(prev => ({ ...prev, message: "" }));
            }
        }
    }

    return (
        <div className="bg-base-100">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="w-full bg-base-200 border border-base-300 rounded-box p-6 md:p-10 shadow-sm flex flex-col gap-8 text-sm"
                >
                    <div className="border-b border-base-300 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h1 className="text-primary text-2xl font-bold tracking-tight">
                                Approve Suggested Route
                            </h1>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-secondary bg-error/10 px-2 py-1 rounded self-start sm:self-center">
                                All Fields Required
                            </span>
                        </div>
                        <p className="text-secondary text-xs mt-2 uppercase tracking-wider">
                            Suggested by: <span className="font-bold text-base-content">{routeSuggestion.created_by || "Anonymous"}</span>
                        </p>
                    </div>

                    {formError && (
                        <div className="bg-error/10 border border-error/20 text-secondary p-3 rounded-md font-medium text-xs">
                            {formError}
                        </div>
                    )}

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 flex flex-col gap-1.5">
                            <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Ride Title</label>
                            <input
                                className="input input-bordered w-full bg-base-100 text-base-content"
                                name="title"
                                type="text"
                                placeholder="e.g. Saturday Morning Coffee Spin"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Difficulty Level</label>
                            <select className="select select-bordered w-full bg-base-100 font-medium text-base-content" name="difficulty">
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                            </select>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Ride Date</label>
                            <input
                                type="date"
                                className="input input-bordered w-full bg-base-100 text-base-content"
                                name="date"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Start Time</label>
                            <input
                                type="time"
                                className="input input-bordered w-full bg-base-100 text-base-content"
                                name="startTime"
                                onChange={handleTimeInput}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="font-semibold text-xs uppercase tracking-wider text-secondary">End Time</label>
                                {time.message && <span className="text-[10px] font-bold text-error animate-pulse">{time.message}</span>}
                            </div>
                            <input
                                type="time"
                                className="input input-bordered w-full bg-base-100 text-base-content"
                                name="endTime"
                                onChange={handleTimeInput}
                                required
                            />
                        </div>
                    </section>

                    <section className="flex flex-col gap-1.5">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Ride Description <span className="text-[10px] font-normal lowercase italic">(optional)</span></label>
                        <textarea
                            className="textarea textarea-bordered h-32 w-full bg-base-100 text-sm leading-relaxed placeholder:text-base-content/40"
                            name="description"
                            placeholder="Inform riders of pacing expectations, specific preparations, landmarks, hazards..."
                        />
                    </section>

                    <section className="flex flex-col gap-2">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Route Mapping Workspace</label>
                        <div className="rounded-box overflow-hidden border border-base-300 shadow-inner h-72 bg-base-100 relative">
                            {routeInformation ? (
                                <Map
                                    geoData={routeSuggestion.geojson}
                                    center={[routeSuggestion.latitude, routeSuggestion.longitude]}
                                    zoom={routeSuggestion.zoom}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-secondary font-medium text-xs bg-base-300/40">
                                    No telemetry parameters mapped to this profile
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="border-t border-base-300 pt-6 flex items-center justify-between">
                        <div className="hidden" aria-hidden="true">
                            <label>Phone Number Reference Field</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                tabIndex={-1}
                                autoComplete="off"
                                onChange={() => setDiscardForm(true)}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn btn-ghost btn-sm font-bold border border-base-300 tracking-wide text-base-content"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-sm px-6 font-bold tracking-wide text-primary-content shadow-sm"
                        >
                            {isSubmitting ? "Processing..." : "Add Route To System"}
                        </button>
                    </section>
                </form>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <p className="text-secondary text-sm font-medium animate-pulse">Initializing Portal Session...</p>
            </div>
        }>
            <AddSuggestionRoute />
        </Suspense>
    );
}