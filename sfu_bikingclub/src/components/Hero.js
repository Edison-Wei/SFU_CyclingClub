import Navigation from "./Navigation"

export default function Hero() {
    return (
        <nav className="relative">
            <img src={"https://www.sfu.ca/content/sfu/main/about/give/jcr:content/main_content/image.img.640.medium.jpg/1638826572368.jpg"} alt="Banner for the SFU Cycling Club" className="w-screen" />
            <div className="absolute w-[550px] md:inset-x-[25%] lg:inset-x-1/4 inset-y-1/2 md:text-[25px] lg:text-[32px] font-semibold text-white">
                SFU CYCLING CLUB
            </div>
            <div className="md:absolute md:w-full md:inset-y-0">
                <Navigation />
            </div>
        </nav>
    )
}