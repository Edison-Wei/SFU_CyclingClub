import Navigation from "./Navigation";
import Link from "next/link";

export default function Hero() {
    return (
        <nav className="relative flex items-center justify-center">
            <img
                src={"banner.jpg"}
                alt="Banner for the SFU Cycling Club"
                className="w-full h-[50vw]  object-cover"
            />
            <div className="absolute flex items-center w-[90%] sm:w-[550px] md:w-[650px] lg:w-[750px] inset-x-[5%] sm:inset-x-[25%] md:inset-x-1/4 inset-y-1/2 transform -translate-y-1/2 text-white z-10">
                <Link href="./">
                    <img
                        src={"/logo.jpg"}
                        alt={"Picture of SFU Cycling Club Logo"}
                        className="w-[30vw] h-[30vw] sm:w-[20vw] sm:h-[20vw] md:w-[15vw] md:h-[15vw] lg:w-[10vw] lg:h-[10vw] rounded-full object-cover shadow-md"
                    />
                </Link>
                <div className="ml-4 flex flex-col justify-center">
                    <p className="text-[10vw] sm:text-[40px] md:text-[50px] lg:text-[60px] font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] whitespace-nowrap overflow-hidden text-ellipsis">
                        SFU CYCLING CLUB
                    </p>
                    <div className="text-[3vw] sm:text-[10px] md:text-[15px] lg:text-[15px] font-[550] hover:text-rose-600 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                        <Link href="https://linktr.ee/sfucycling">JOIN NOW!</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
