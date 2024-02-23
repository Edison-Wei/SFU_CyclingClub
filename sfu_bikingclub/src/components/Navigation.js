import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
    return (
        <>
            <div className="md:px-16">
                <a>
                    <Image
                        src={"/logo.jpg"}
                        alt={"Picture of "}
                        width={200}
                        height={200}
                        className="w-[30vw] h-[30vw] sm:w-[25vw] sm:h-[25vw] md:w-[15vw] md:h-[15vw] rounded-full object-cover shadow-md"
                    />
                </a>
            </div>

            <div className="md:px-10">
                <CreateLink link={"./Events"} linkText={"Events"} />
                <a href={"https://www.strava.com/clubs/1079967"} className={"md:px-4"}>Strava</a>
                <CreateLink link={"./Executives"} linkText={"Executives"} />
                <CreateLink link={"./About"} linkText={"About"} />
            </div>
        </>
    )
}

function CreateLink({ link, linkText }) {
    return <Link href={link} className="md:px-4">{linkText}</Link>
}