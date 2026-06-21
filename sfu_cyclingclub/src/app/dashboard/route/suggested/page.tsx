"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { parseRoute } from "@/components/services/RouteParser";
import { RawSuggestRoute, SuggestionRoute } from "@/types/RouteType";
import { SUGGESTROUTE1, SUGGESTROUTE2 } from "@/_static_data/SuggestRouteDetails";

const initialSelectedRoute: SuggestionRoute = {
    sid: 0,
    created_by: "",
    distance: 0,
    date_created: new Date("1965-09-09T07:00:00.000Z"),
    geojson: null,
    latitude: 49.2790223,
    longitude: -122.9201949,
    elevation: 0,
    zoom: 11.5
};

async function fetchSuggestionRoutes(): Promise<RawSuggestRoute[]> {
    try {
        const res = await fetch(`/api/Routes/getSuggestionRoutes`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching Route Suggestions: ", error);
        return [];
    }
}


export default function SuggestedRouteSubmissions() {
    const [routeSuggestions, setRouteSuggestions] = useState<SuggestionRoute[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<SuggestionRoute>(initialSelectedRoute);
    const [showDeletionModal, setShowDeletionModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const Map = dynamic(() => import('@/components/Map'), {
        ssr: false,
        loading: () => (
            <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                <p className="text-secondary text-sm font-medium animate-pulse">Route is Loading...</p>
            </div>
        )
    });

    useEffect(() => {
        const loadSuggestedRoutes = async () => {
            // const response = await fetchSuggestionRoutes();

            // if (response.length === 0) {
            //     setErrorMsg("No route suggestions found or failed to load data.");
            //     return;
            // }
            const response = [SUGGESTROUTE1, SUGGESTROUTE2]
            const result = response.map(({sid, created_by, date_created, gpx}) => {
                const { geojson, totalDistance, latitude, longitude, elevation, zoom } = parseRoute(gpx);
                return {
                    sid,
                    created_by,
                    distance: totalDistance,
                    latitude,
                    longitude,
                    elevation,
                    zoom,
                    geojson,
                    date_created,
                }
            });
            setRouteSuggestions(result);
        }
        loadSuggestedRoutes()
    }, []);

    async function handleDeleteRoute(sid: number) {
        try {
            const res = await fetch(`/api/Routes/postDeleteSuggestion?sid=${sid}`, {
                method: 'POST',
            });

            if (!res.ok) {
                throw new Error(`Failed to delete route with status ${res.status}`);
            }

            const updatedList = routeSuggestions.filter(route => route.sid !== sid);
            setRouteSuggestions(updatedList);

            if (selectedRoute.sid === sid) {
                setSelectedRoute(updatedList.length > 0 ? updatedList[0] : initialSelectedRoute);
            }
            return true;
        } catch (error) {
            console.error("Failed to delete route ", error);
            alert(`Route ID ${sid} was not found or could not be removed from the database.`);
            return null;
        }
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            {showDeletionModal && (
                <RouteSuggestionDeletetionModal
                    routeinfo={selectedRoute}
                    setShowDeletionModal={setShowDeletionModal}
                    handleDeleteRoute={handleDeleteRoute}
                />
            )}

            <div className="px-8 pt-6 pb-6 border-b border-base-300 bg-base-100">
                <div className="max-w-screen-xl mx-auto flex items-end justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em] font-semibold mb-1">Executive Portal</p>
                        <h1 className="text-primary text-3xl font-bold tracking-tight">Suggested Routes</h1>
                    </div>
                    <div className="w-52 text-xs font-semibold text-secondary max-w-xs text-right hidden sm:block">
                        Remember to check the SFSS Cycling Club member list.
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-5">

                <div className="w-full lg:w-[42%] h-[50vh] md:h-[65vh] flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm">

                    <div className="flex border-b border-base-300 bg-base-100 px-4 py-3">
                        <span className="text-sm font-bold tracking-wider uppercase text-primary">Submissions Queue</span>
                    </div>

                    {errorMsg && (
                        <div className="text-error text-xs p-3 bg-error/10 border-b border-error/20 w-full font-medium">
                            {errorMsg}
                        </div>
                    )}

                    <div className="grid grid-cols-7 px-4 py-2 bg-base-100 border-b border-base-300">
                        <span className="col-span-4 text-[10px] uppercase tracking-widest font-bold text-secondary">Submitted By</span>
                        <span className="col-span-3 text-[10px] uppercase tracking-widest font-bold text-secondary text-right">Submission Date</span>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-base-300">
                        {routeSuggestions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-secondary py-16">
                                <span className="text-3xl opacity-30">⛰</span>
                                <p className="text-sm">No suggested routes found.</p>
                            </div>
                        ) : (
                            routeSuggestions.map(route => (
                                <RouteRow
                                    key={route.sid}
                                    route={route}
                                    isActive={selectedRoute.sid === route.sid}
                                    onSelect={() => setSelectedRoute(route)}
                                />
                            ))
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-base-300 bg-base-100">
                        <p className="text-[10px] text-secondary uppercase tracking-widest font-medium">
                            {routeSuggestions.length} submission{routeSuggestions.length !== 1 ? 's' : ''} pending review
                        </p>
                    </div>
                </div>

                <div className="w-full lg:flex-1 flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm">

                    <div className="flex-1 md:h-[40vh] lg:h-[80vh] relative">
                        {!selectedRoute && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-200/80 backdrop-blur-sm gap-2 pointer-events-none">
                                <span className="text-4xl opacity-20">🗺</span>
                                <p className="text-secondary text-sm">Select a submission to preview</p>
                            </div>
                        )}
                        <Map
                            geoData={selectedRoute.geojson}
                            center={[selectedRoute.latitude, selectedRoute.longitude]}
                            zoom={selectedRoute.zoom}
                        />
                    </div>

                    {selectedRoute ? (
                        <div className="relative lg:absolute border-t border-base-300 bg-base-100 p-5 m-1 flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-secondary text-[10px] uppercase tracking-widest font-semibold mb-0.5">Submitted By</p>
                                    <h2 className="text-primary text-xl font-bold tracking-tight leading-tight">
                                        {selectedRoute.created_by || "Anonymous User"}
                                    </h2>
                                    <p className="text-secondary text-xs mt-1 uppercase tracking-wider">
                                        Received: {selectedRoute.date_created
                                            ? new Date(selectedRoute.date_created).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
                                            : 'Unknown Date'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <Link
                                        href={{ pathname: 'suggested/add', query: { sid: selectedRoute.sid } }}
                                        className="btn btn-ghost btn-xs font-bold text-primary hover:bg-primary/10 tracking-widest"
                                    >
                                        ADD TO SYSTEM
                                    </Link>
                                    <span className="text-base-300">|</span>
                                    <button
                                        onClick={() => setShowDeletionModal(true)}
                                        className="btn btn-ghost btn-xs font-bold text-primary hover:bg-secondary tracking-widest"
                                    >
                                        REJECT
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <StatChip label="Total Distance" value={selectedRoute.distance ? `${selectedRoute.distance} km` : '0 km'} />
                                <StatChip label="Target Zoom Level" value={selectedRoute.zoom ? `${selectedRoute.zoom}x` : '—'} />
                            </div>
                        </div>
                    ) : (
                        <div className="border-t border-base-300 bg-base-100 px-5 py-4">
                            <p className="text-secondary text-xs uppercase tracking-widest">No route submission selected</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

interface RouteRowProps {
    route: SuggestionRoute;
    isActive: boolean;
    onSelect: () => void;
}

function RouteRow({ route, isActive, onSelect }: RouteRowProps) {
    return (
        <button
            onClick={onSelect}
            className={`w-full grid grid-cols-7 items-center px-4 py-3.5 text-left transition-all hover:bg-base-300/60 ${isActive ? 'bg-base-300 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                }`}
        >
            <span className="col-span-4 text-primary font-semibold text-sm truncate pr-2">
                {route.created_by || "Anonymous"}
            </span>
            <span className="col-span-3 text-secondary text-xs text-right font-medium">
                {route.date_created ? route.date_created.toISOString().slice(0, 10) : "—"}
            </span>
        </button>
    );
}

function StatChip({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5 bg-base-200 border border-base-300 rounded-box px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">{label}</span>
            <span className="text-base-content font-bold text-sm">{value}</span>
        </div>
    );
}

interface DeletionModalProps {
    routeinfo: SuggestionRoute;
    setShowDeletionModal: (show: boolean) => void;
    handleDeleteRoute: (sid: number) => Promise<boolean | null>;
}

function RouteSuggestionDeletetionModal({ routeinfo, setShowDeletionModal, handleDeleteRoute }: DeletionModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeletionModal(false)}
        >
            <div
                className="mx-4 w-full max-w-md bg-base-100 border border-base-300 rounded-box p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <h2 className="pb-3 text-primary text-xl font-bold tracking-tight">
                        Reject Route Suggestion?
                    </h2>
                    <p className="text-sm text-secondary mb-6">
                        Are you sure you want to permanently discard the suggestion submitted by <span className="font-semibold text-base-content">{routeinfo.created_by || "Anonymous"}</span>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 text-sm">
                        <button
                            onClick={() => setShowDeletionModal(false)}
                            className="btn btn-ghost btn-sm font-bold tracking-wide"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                const success = await handleDeleteRoute(routeinfo.sid);
                                if (success) setShowDeletionModal(false);
                            }}
                            className="btn btn-secondary btn-sm font-bold tracking-wide text-white"
                        >
                            Discard Route
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}