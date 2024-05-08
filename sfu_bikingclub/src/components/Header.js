import Link from "next/link";


export default function Header() {

    return (
        <nav className="md:flex md:justify-between md:w-full sticky top-0 left-0 w-full z-10">
          <div className="flex-1 bg-white md:px-10 md:text-[15px] font-[550] text-[#890B29] flex justify-around md:justify-end">
            <CreateLink link={"/"} linkText={"Home"} />
            <CreateLink link={"/About"} linkText={"About"} />
            <CreateLink link={"/Executives"} linkText={"Executives"} />
            <CreateLink link={"/login"} linkText={"Blog"} />
            <a href={"https://www.strava.com/clubs/1079967"} className={"md:px-4 hover:text-gray-500"}>Strava</a>
          </div>
        </nav>
      );
}

function CreateLink({ link, linkText }) {
    return <Link href={link} className="md:px-4 hover:text-gray-500">{linkText}</Link>
}
