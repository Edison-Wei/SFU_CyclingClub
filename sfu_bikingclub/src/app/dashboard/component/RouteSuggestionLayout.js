import Image from "next/image"
import Link from "next/link";

function RouteSuggestionLayout({ routeinfo, setSelectedRoute, setShowDeletionModal }) {

    return (
        <div className="min-h-16 max-h-32 px-1 flex items-center border-b-2 border-primary-red sm:text-[10px] md:text-[16px] lg:text-[18px] hover:bg-gray-400">
            <button onClick={() => setSelectedRoute(routeinfo)} className="flex w-full h-full">
                <h2 className="basis-2/6 text-start font-medium">
                    {routeinfo.created_by}
                </h2>
                <p className="basis-1/6 ml-2">
                    {routeinfo.distance} km
                </p>
                <p className="basis-2/6 pl-2">
                    {routeinfo.date_created.slice(0, 10)}
                </p>
            </button>
            <div className="flex flex-col items-center">
                <Link href={{pathname: `member/add`, query: {sid: routeinfo.sid}}} className="pb-1 z-10 hover:font-bold">
                    Add
                </Link>
                <button onClick={() => setShowDeletionModal(true)} className="z-10 hover:brightness-200">
                    <Image src={"/crossmark.svg"} alt="Delete" height={18} width={18} />
                    {/* &#10060; */}
                </button>
            </div>
        </div>
    )
}

export default RouteSuggestionLayout;