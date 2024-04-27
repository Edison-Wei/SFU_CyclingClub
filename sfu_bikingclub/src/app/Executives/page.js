"use client"
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";

function ExecList({name, position, image, description}) {
    return (
        <div className="grid grid-cols-3 p-3 bg-gray-100 border-b-8 border-white">
            <div className="px-6 py-1">
                <Image src={image} width={150} height={150} alt={`Picture of an Exective`}  className="shadow-md"/>
            </div>
            <div className="flex flex-col col-span-2">
                <div className="pb-3">
                    <h2 className="text-[20px] font-semibold">
                        {name}
                    </h2>
                    <h3 className="text-[18px] font-[550]">
                        {position}
                    </h3>
                </div>
                <p className="text-[14px] text-pretty">
                    {description}
                </p>
            </div>
        </div>
    )
}

function SponsorList({name, link, linkname, image, description}) {
    return (
        <div className="grid grid-cols-3 bg-gray-200 p-3 w-3/4 border-b-8 border-white">
            <div className="px-6 py-1">
                <Image src={image} width={200} height={200} alt={`Sponsor Image`} className="shadow-md" />
            </div>
            <div className="flex flex-col col-span-2 justify-around">
                <h2 className="text-[20px] font-semibold">
                    {name}
                </h2>
                <p className="text-[14px] text-pretty">
                    {description}
                </p>
                <Link href={link} className="underline hover:text-blue-500">{linkname}</Link>
            </div>
        </div>
    )
}

export default function Executives() {
    
    return (
        <div className="w-full h-full py-6">
            <Header />
            <div className="flex py-8 px-12 justify-center">
                <span className="text-[30px] font-bold">Executive Team</span>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-col justify-around w-1/2">
                    {execs.map(exec => (
                        <ExecList 
                            name={exec.name}
                            position={exec.position}
                            image={exec.image}
                            description={exec.description}
                            key={exec.name}
                        />
                    ))}
                </div>
            </div>
            <div className="flex py-8 px-12 justify-center">
                <span className="text-[30px] font-semibold">Sponsors</span>
            </div>
            <div className="grid grid-cols-2 justify-items-center">
                    {sponsors.map(sponsor => (
                        <SponsorList 
                            name={sponsor.name}
                            link={sponsor.link}
                            linkname={sponsor.linkname}
                            image={sponsor.image}
                            description={sponsor.description}
                            key={sponsor.name}
                        />
                    ))}
            </div>
        </div>
    );
}

const execs = [
    {
        name: "Matthew",
        position: "President",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "Amelia",
        position: "Vice President",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad min"
    },
    {
        name: "Edison",
        position: "Tech Lead",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerci"
    },
    {
        name: "Claire",
        position: "Tech Lead",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco lab"
    },
    {
        name: "James",
        position: "Treasurer",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod .",
    }
]

const sponsors = [
    {
        name: "Cycling Club",
        link: "./",
        linkname: "Home",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
    },
    {
        name: "SFU Cycling Club",
        link: "./",
        linkname: "Home",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "SFU Cycling Club",
        link: "./",
        linkname: "Home",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna al"
    },
    {
        name: "SFU Cycling Club",
        link: "./",
        linkname: "Home",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
    },
    {
        name: "SFU Cycling Club",
        link: "./",
        linkname: "Home",
        image: "/logo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
    }
]