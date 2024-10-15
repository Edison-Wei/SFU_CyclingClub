import Image from "next/image"
import Link from "next/link";

// TODO: Fix selection/deletion of route. Exec has to select the route first, then they are able to delete it
function RouteLayout({ routeinfo, setSelectedRoute, setShowDeletionModal }) {

    return (
        <div className="min-h-16 max-h-32 px-2 flex items-center border-b-2 border-primary-red sm:text-[10px] md:text-[16px] lg:text-[18px] hover:bg-gray-400"> 
            <button onClick={() => setSelectedRoute(routeinfo)} className="grid grid-cols-6 content-center place-items-center w-[95%] h-full">
                <h2 className="col-span-2 place-self-start text-left font-medium">
                    {routeinfo.title}
                </h2>
                <p className="">
                    {routeinfo.distance} km
                </p>
                <p className="">
                    {routeinfo.start_date.slice(0, 10)}
                </p>
                <p className="col-span-2">
                    {routeinfo.start_time.slice(0, 5)} - {routeinfo.end_time.slice(0, 5)}
                </p>
            </button>
            <div className="flex flex-col items-center">
                <Link href={{pathname: `/dashboard/edit`, query: {rid: routeinfo.rid}}} className="pb-1 z-10 hover:font-bold">
                    Edit
                </Link>
                <button onClick={() => setShowDeletionModal(true)} className="z-10 hover:brightness-200">
                    <Image src={"/crossmark.svg"} alt="Delete" height={18} width={18} />
                    {/* &#10060; */}
                </button>
            </div>
        </div>
    )
}

export default RouteLayout;