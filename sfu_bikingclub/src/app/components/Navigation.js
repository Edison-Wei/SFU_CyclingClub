import Link from "next/link";

export default function Navigation() {
    return (
        <>
           <div className="md:px-16"> 
                    <a>
                        <img src="./images/logo.jpg" style={{ width: '50px', height: 'auto' }} />
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

function CreateLink({link, linkText}) {
    return <Link href={link} className="md:px-4">{linkText}</Link>
}