// TO DO: Move Navigation elements into the header or vise versa?

import Link from "next/link";


export default function Header() {

    return (
        <nav className="md:flex md:justify-between md:w-full">
          <div className="flex-none w-96 bg-white-500 md:text-[20px] font-[550]">
            <Link href="#joinInformation">JOIN US!</Link>
          </div>
          <div className="flex-1 md:px-10 text-[12px] md:text-[20px] font-[550] flex justify-end">
            <CreateLink link={"./About"} linkText={"About"} />
            <CreateLink link={"./Executives"} linkText={"Executives"} />
            <CreateLink link={"./Blog"} linkText={"Cycling Blog"} />
            <a href={"https://www.strava.com/clubs/1079967"} className={"md:px-4"}>Strava</a>
          </div>
        </nav>
      );
}

function CreateLink({ link, linkText }) {
    return <Link href={link} className="md:px-4">{linkText}</Link>
}