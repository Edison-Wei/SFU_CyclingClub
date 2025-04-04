import Link from "next/link";


export default function Header() {

  return (
    <nav className="md:flex md:justify-between md:w-full sticky top-0 left-0 w-full z-20">
      <div className="flex-1 py-1 md:px-10 md:text-[15px] font-[550] text-white flex justify-around md:justify-end bg-primary-red">
        <CreateLink link={"/"} linkText={"HOME"} />
        <CreateLink link={"/About"} linkText={"ABOUT"} />
        <CreateLink link={"/Executives"} linkText={"EXECUTIVES"} />
        <CreateLink link={"/blog"} linkText={"BLOG"} />
        <a href={"https://www.strava.com/clubs/1079967"} className={"md:px-4 hover:text-gray-500"}>STRAVA</a>
      </div>
    </nav>
  );
}

function CreateLink({ link, linkText }) {
  return <Link href={link} className="md:px-4 hover:text-gray-500">{linkText}</Link>
}
