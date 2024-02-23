import Navigation from "./Navigation"

export default function Hero() {
    return (
        <nav className="relative">
            <img src={"https://www.sfu.ca/content/sfu/main/about/give/jcr:content/main_content/image.img.640.medium.jpg/1638826572368.jpg"} alt="Banner for the SFU Cycling Club" className="w-screen" />
            <div className="absolute w-[550px] md:inset-x-[25%] lg:inset-x-1/4 inset-y-1/2 md:text-[25px] lg:text-[32px] font-semibold text-white">
                Welcome to SFU Cycling Club
            </div>
            <div className="md:flex md:justify-between md:absolute md:w-screen md:inset-y-10 text-[12px] md:text-[18px] font-medium">
                <Navigation />
            </div>
        </nav>
    )
}