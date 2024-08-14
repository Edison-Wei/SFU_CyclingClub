import Image from "next/image"

function RouteLayout({ routeinfo, setSelectedRoute, setShowModal }) {

    return (
        <div className="flex border-b-2 border-primary-red md:h-16 max-h-20 sm:text-[10px] md:text-[16px] lg:text-[18px] hover:bg-gray-400">
            <button onClick={() => setShowModal(true)} className="pl-2 h-full">
                <Image src={"/crossmark.svg"} alt="Delete" height={18} width={18}/>
                {/* &#10060; */}
            </button>
            <button onClick={() => setSelectedRoute(routeinfo)} className="grid grid-cols-6 content-center w-full h-full">
                <h2 className="col-start-2 col-span-3 max-h-20 text-left">
                    {routeinfo.title}
                </h2>
                <p className="">
                    {routeinfo.distance}
                </p>
                <p className="">
                    {routeinfo.start_date.slice(0,10)}
                </p>
            </button>
        </div>
    )
}

export default RouteLayout;