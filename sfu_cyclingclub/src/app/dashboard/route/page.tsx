"use client"
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import DeletionModal from "../_componets/DeletionModal";
import { DEFAULT_ROUTE, Route, RawRoute, ProcessRawRoutes } from "@/types/RouteType";
import { BEGINNER_ROUTE_DETAILS_1, BEGINNER_ROUTE_DETAILS_2, INTERMEDIATE_ROUTE_DETAILS_1, INTERMEDIATE_ROUTE_DETAILS_2 } from "@/_static_data/RouteDetails";
import Link from "next/link";

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-base-200 animate-pulse">
            <span className="text-secondary text-sm tracking-widest uppercase">Loading Map…</span>
        </div>
    )
});

export default function Dashboard() {
    const [interRoute, setInterRoute] = useState<Route[]>([]);
    const [beginRoute, setBeginRoute] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<Route>(DEFAULT_ROUTE);
    const [selection, setSelection] = useState(0);
    const [showDeletionModal, setShowDeletionModal] = useState(false);

    useEffect(() => {
        const fetchAllRoutes = async () => {
            try {
                // const res = await fetch(`/api/Routes.getExecRoutes`, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                // });
                // const data = await res.json()
                const data = {
                    resultsIR: [INTERMEDIATE_ROUTE_DETAILS_1, INTERMEDIATE_ROUTE_DETAILS_2],
                    resultsBR: [BEGINNER_ROUTE_DETAILS_1, BEGINNER_ROUTE_DETAILS_2],
                };
                setInterRoute(ProcessRawRoutes(data.resultsIR));
                setBeginRoute(ProcessRawRoutes(data.resultsBR));
            } catch (error) {
                console.error("Error fetching routes", error);
            }
        };
        fetchAllRoutes();
    }, []);

    const currentList = selection === 0 ? interRoute : beginRoute;

    async function handleDeleteRoute(rid: number | string) {
        try {
            await fetch(`/api/Routes/postDeleteRoute?rid=${rid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (selection === 0) setInterRoute(prev => prev.filter(r => r.rid !== rid));
            else setBeginRoute(prev => prev.filter(r => r.rid !== rid));
            setShowDeletionModal(false);
        } catch {
            alert("Failed to delete route");
        }
    }

    const changeDisplayRoute = (difficulty: string) => {
        if (difficulty === "Beginner") {
            setSelection(1)
            setSelectedRoute(beginRoute[0])
            return
        }
        setSelection(0)
        setSelectedRoute(interRoute[0])
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            {showDeletionModal && (
                <DeletionModal
                    rid={selectedRoute.rid}
                    title={selectedRoute.title}
                    setShowDeletionModal={setShowDeletionModal}
                    handleDeleteRoute={handleDeleteRoute}
                />
            )}

            <div className="px-8 pt-6 pb-6 border-b border-base-300 bg-base-100">
                <div className="max-w-screen-xl mx-auto flex items-end justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em] font-semibold mb-1">Executive Portal</p>
                        <h1 className="text-primary text-3xl font-bold tracking-tight">Routes Dashboard</h1>
                    </div>
                    <Link
                        href="/dashboard/route/create"
                        className="btn btn-primary btn-sm font-bold tracking-wider text-primary-content"
                    >
                        + New Route
                    </Link>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-5">
                <div className="w-full lg:w-[42%] h-[50vh] md:h-full flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm">

                    <div className="flex border-b border-base-300">
                        {["Intermediate", "Beginner"].map((label, i) => (
                            <button
                                key={label}
                                onClick={() => {changeDisplayRoute(label)}}
                                className={`flex-1 py-3 text-sm font-bold tracking-wider uppercase transition-all border-b-2 ${
                                    selection === i
                                        ? "border-primary text-primary bg-base-100"
                                        : "border-transparent text-secondary hover:text-primary hover:bg-base-100/60"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 px-4 py-2 bg-base-100 border-b border-base-300">
                        <span className="col-span-3 text-[10px] uppercase tracking-widest font-bold text-secondary">Title</span>
                        <span className="col-span-1 text-[10px] uppercase tracking-widest font-bold text-secondary">Status</span>
                        <span className="col-span-2 text-[10px] uppercase tracking-widest font-bold text-secondary">Date</span>
                        <span className="col-span-1 text-[10px] uppercase tracking-widest font-bold text-secondary text-right">Time</span>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-base-300">
                        {currentList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-secondary py-16">
                                <span className="text-3xl opacity-30">⛰</span>
                                <p className="text-sm">No routes in this category.</p>
                            </div>
                        ) : (
                            currentList.map(route => (
                                <RouteRow
                                    key={route.rid}
                                    route={route}
                                    isActive={selectedRoute.rid === route.rid}
                                    onSelect={() => setSelectedRoute(route)}
                                />
                            ))
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-base-300 bg-base-100">
                        <p className="text-[10px] text-secondary uppercase tracking-widest">
                            {currentList.length} route{currentList.length !== 1 ? 's' : ''} listed
                        </p>
                    </div>
                </div>

                <div className="w-full lg:flex-1 flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm">

                    <div key={selectedRoute.rid} className="flex-1 min-h-[300px] relative">
                        {!selectedRoute && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-200/80 backdrop-blur-sm gap-2 pointer-events-none">
                                <span className="text-4xl opacity-20">🗺</span>
                                <p className="text-secondary text-sm">Select a route to preview</p>
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
                                    <h2 className="text-primary text-xl font-bold tracking-tight leading-tight">
                                        {selectedRoute.title}
                                    </h2>
                                    <p className="text-secondary text-xs mt-1 uppercase tracking-wider">
                                        {selectedRoute.start_date
                                            ? new Date(selectedRoute.start_date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
                                            : 'No date'}
                                        &nbsp;·&nbsp;
                                        {selectedRoute.start_time?.slice(0, 5) || '—'} – {selectedRoute.end_time?.slice(0, 5) || '—'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                    <Link
                                        href={{ pathname: '/dashboard/route/edit', query: { rid: selectedRoute.rid } }}
                                        className="btn btn-ghost btn-xs font-bold text-secondary hover:text-primary tracking-widest"
                                    >
                                        EDIT
                                    </Link>
                                    <span className="text-base-300">|</span>
                                    <button
                                        onClick={() => setShowDeletionModal(true)}
                                        className="btn btn-ghost btn-xs font-bold text-secondary hover:text-primary tracking-widest"
                                    >
                                        DELETE
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-base-content leading-relaxed line-clamp-2">
                                {selectedRoute.description || "No description provided for this route."}
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <StatChip label="Distance" value={selectedRoute.distance ? `${selectedRoute.distance} km` : '—'} />
                                <StatChip label="Elevation Gain" value={selectedRoute.elevation ? `${selectedRoute.elevation} m` : '—'} />
                            </div>
                        </div>
                    ) : (
                        <div className="border-t border-base-300 bg-base-100 px-5 py-4">
                            <p className="text-secondary text-xs uppercase tracking-widest">No route selected</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}


function RouteRow({ route, isActive, onSelect }: { route: Route; isActive: boolean; onSelect: () => void }) {
    return (
        <button
            onClick={onSelect}
            className={`w-full grid grid-cols-7 items-center px-4 py-3 text-left transition-colors hover:bg-base-300 ${
                isActive ? 'bg-base-300/80 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'
            }`}
        >
            <span className="col-span-3 text-primary font-semibold text-sm truncate pr-2">
                {route.title}
            </span>
            <span className="col-span-1 text-base-content text-sm">
                {route.approved ? "Approved" : "Waiting"}
            </span>
            <span className="col-span-2 text-base-content text-xs">
                {route.start_date.toISOString().slice(0, 10)}
            </span>
            <span className="col-span-1 text-secondary text-xs text-right">
                {route.start_time.slice(0, 5)}
            </span>
        </button>
    );
}

function StatChip({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5 bg-base-300 border border-base-300 rounded-box px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">{label}</span>
            <span className="text-base-content font-bold text-sm">{value}</span>
        </div>
    );
}