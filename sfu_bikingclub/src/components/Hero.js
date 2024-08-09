import Navigation from "./Navigation";
import Link from "next/link";

export default function Hero() {
    return (
        <nav className="relative flex items-center justify-center">
            <img
                src={"banner.jpg"}
                alt="Banner for the SFU Cycling Club"
                className="w-full h-[50vw] object-cover"
            />
            <div className="absolute flex items-center w-[90%] sm:w-[550px] md:w-[550px] lg:w-[550px] inset-x-[5%] sm:inset-x-[25%] md:inset-x-1/4 inset-y-1/2 transform -translate-y-1/2 text-white">
                <Link href="./">
                    <img
                        src={"/logo.jpg"}
                        alt={"Picture of SFU Cycling Club Logo"}
                        className="w-[30vw] h-[30vw] sm:w-[20vw] sm:h-[20vw] md:w-[10vw] md:h-[10vw] rounded-full object-cover shadow-md"
                    />
                </Link>
                <div className="ml-4">
                    <p className="mb-2 text-[6vw] sm:text-[40px] md:text-[40px] lg:text-[40px] font-semibold">
                        SFU CYCLING CLUB
                    </p>
                    <div className="text-[3vw] sm:text-[10px] md:text-[15px] lg:text-[15px] font-[550] hover:text-rose-600">
                        <Link href="https://linktr.ee/sfucycling">JOIN NOW!</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
