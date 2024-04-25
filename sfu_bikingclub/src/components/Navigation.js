import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
    return (
        <nav className="md:flex md:justify-between items-center md:w-full">
            <div className="mt-3 md:px-16">
                <a href="./">
                    <img
                        src={"/logo.jpg"}
                        alt={"Picture of "}
                        width={200}
                        height={200}
                        className="w-[25vw] h-[25vw] sm:w-[20vw] sm:h-[20vw] md:w-[10vw] md:h-[10vw] rounded-full object-cover shadow-md"
                    />
                </a>
            </div>
        </nav>
    )
}