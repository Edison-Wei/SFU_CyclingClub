import Link from "next/link";

export default function HeroBanner() {
    return (
        <section className="relative w-full overflow-hidden">
            <img 
                src={"/banner.jpg"}
                alt="SFU Cycling Club Banner"
                className="w-full h-[50vw] min-h-h[300px] object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex max-w-4xl items-center gap-4 md:gap-6">
                    <Link href="/" className="shrink-0">
                        <div className="avatar">
                            <div className="w-[12vw] min-w-[60px] max-w-[140px] rounded-full ring ring-primary">
                                <img
                                    src="/logo.jpg"
                                    alt="SFU Cycling Club Logo"
                                />
                            </div>
                        </div>
                    </Link>

                    <div className="flex flex-col text-white drop-shadow-lg">
                        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                            SFU CYCLING CLUB
                        </h1>
                        <div className="mt-2 text-sm sm:text-base md:text-lg font-bold">
                            <Link href="https://linktr.ee/sfucycling" className="transition-colors duration-200 hover:text-primary">
                                JOIN NOW!
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}