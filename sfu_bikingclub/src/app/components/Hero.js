import Navigation from "./Navigation"

export default function Hero() {
    return (
        <div className="relative">
            <img src={"https://www.sfu.ca/content/sfu/main/about/give/jcr:content/main_content/image.img.640.medium.jpg/1638826572368.jpg"} className="w-screen"/>
            <div className="absolute inset-x-1/3 inset-y-1/2 text-[32px] font-semibold w-screen text-white">
                Welcome to Cycling Club
            </div>
            <Navigation />
        </div>
    )
}