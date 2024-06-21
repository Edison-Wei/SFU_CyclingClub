import cross from "/public/crossmark.svg"
import Image from "next/image"

export default function RouteLayout({ title, distance, start_date, id, setIdSelection, setShowModal }) {

    function handleDeletion(id) {
        // setIdSelection(id);
        setShowModal(true);
    }

    return (
        <div className="relative p-1 border-b-2 border-primary-red md:h-16 max-h-20">
            <button onClick={() => handleDeletion(id)} className="absolute p-1 h-full">
                <Image src={cross} alt="Delete" height={18} width={18}/>
            </button>
            <button onClick={() => setIdSelection(id)} className="grid grid-cols-5 w-full">
                <p className="col-start-2 col-span-2">
                    {title}
                </p>
                <div className="">
                    {distance}
                </div>
                <div className="">
                    {start_date}
                </div>
            </button>
        </div>
    )
}

const data = {
    title: "No active",
    gpx: "",
    difficulty: "null",
    distance: 0,
    start_date: "2024-01-01",
    start_time: "00:00",
    end_time: "00:00"
}