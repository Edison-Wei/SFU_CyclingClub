import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="md:flex md:justify-between md:absolute md:w-screen md:inset-y-10 text-[18px] font-medium">
            <div className="px-20"> 
                <Link href={"./"} className="">{"Logo"}</Link>
            </div>

            <div className="px-14">
                <CreateLink link={"./"} linkText={"Events"} />
                <CreateLink link={"./"} linkText={"Strava Club"} />
                <CreateLink link={"./"} linkText={"Executives"} />
                <CreateLink link={"./About"} linkText={"About"} />
            </div>
        </nav>
    )
}

function CreateLink({link, linkText}) {
    return <Link href={link} className="px-6">{linkText}</Link>
}