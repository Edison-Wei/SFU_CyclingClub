import Navigation from "./Navigation"
import Link from "next/link";

export default function Hero() {
    return (
        <nav className="relative flex items-center">
            <img src={"https://www.sfu.ca/content/sfu/main/about/give/jcr:content/main_content/image.img.640.medium.jpg/1638826572368.jpg"} alt="Banner for the SFU Cycling Club" className="w-screen" />
            <div className="absolute flex items-center w-[550px] md:inset-x-[25%] lg:inset-x-1/4 inset-y-1/2 md:text-[25px] lg:text-[32px] font-semibold text-white">
                <Link href="./">
                    <img
                        src={"/logo.jpg"}
                        alt={"Picture of "}
                        width={200}
                        height={200}
                        className="w-[25vw] h-[25vw] sm:w-[20vw] sm:h-[20vw] md:w-[10vw] md:h-[10vw] rounded-full object-cover shadow-md"
                    />
                </Link>
                <div className="ml-4">
                    <p className="mb-2">SFU CYCLING CLUB</p>
                    <div className="md:text-[15px] font-[550] hover:text-rose-600">
                        <Link href="#joinInformation">JOIN NOW!</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
