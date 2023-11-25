import Link from "next/link";

export default function Navigation() {
    return (
        <nav class="px-12 py-8 grid grid-cols-2">
            <div className="Navigation-bar-SFU-Icon">
                {/* Logo */}
                <CreateLink link={"./Home"} linkText={"Click Here"} />
            </div>

            <div className="Navigation-bar-related">
                <CreateLink link={"./"} linkText={"Events"} />
                <CreateLink link={"./"} linkText={"Strava Club"} />
                <CreateLink link={"./"} linkText={"Executives"} />
                <CreateLink link={"./"} linkText={"About"} />
            </div>
        </nav>
    )
}

function CreateLink({link, linkText}) {
    return <Link href={link} class="p-8">{linkText}</Link>
}