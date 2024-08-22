import Image from "next/image"
import { useRouter } from "next/navigation";

function RouteLayout({ routeinfo, setSelectedRoute, setShowDeletionModal }) {
    const router = useRouter();

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
                <button onClick={() => router.push(`/dashboard/${routeinfo.rid}`)} className="pb-1 z-10 hover:font-bold">
                    Edit
                </button>
                <button onClick={() => setShowDeletionModal(true)} className="z-10 hover:brightness-200">
                    <Image src={"/crossmark.svg"} alt="Delete" height={18} width={18} />
                    {/* &#10060; */}
                </button>
            </div>
        </div>
    )
}

export default RouteLayout;