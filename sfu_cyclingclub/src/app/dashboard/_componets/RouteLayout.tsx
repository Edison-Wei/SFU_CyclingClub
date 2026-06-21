import { Route } from "@/types/RouteType";
import Image from "next/image"
import Link from "next/link";

interface RouteLayoutProps {
    routeinfo: Route
    setSelectedRoute: (route: Route) => void
    isActive: boolean
}

export default function RouteLayout({ routeinfo, setSelectedRoute, isActive }: RouteLayoutProps) {
    return (
        <div className={`group flex items-center px-4 py-3 border-b border-base-300 transition-colors hover:bg-base-300 ${isActive ? 'bg-base-300/70 border-l-2 border-l-primary' : ''}`}> 
            <div 
                onClick={() => setSelectedRoute(routeinfo)} 
                className="grid grid-cols-5 items-center w-full text-left"
            >
                <div className="col-span-2">
                    <h3 className="text-primary font-semibold text-sm lg:text-base leading-tight truncate mr-2">
                        {routeinfo.title}
                    </h3>
                </div>
                <p className="text-sm">{routeinfo.distance} km</p>
                <p className="text-sm text-base">{routeinfo.start_date.toISOString().slice(0,10)}</p>
                <p className="text-xs text-base text-center">
                    {routeinfo.start_time.slice(0, 5)} - {routeinfo.end_time.slice(0, 5)}
                </p>
            </div>
        </div>
    )
}