"use client"
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";


function ExecList({ name, position, image, description }) {
    return (
        <div className="flex flex-col md:flex-row items-start p-4 bg-gray-100 border-b-8 border-white">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                <Image
                    src={image}
                    width={150}
                    height={150}
                    alt={`Picture of ${name}`}
                    className="shadow-md"
                />
            </div>
            <div className="flex flex-col">
                <div className="mb-2">
                    <h2 className="text-xl font-semibold">{name}</h2>
                    <h3 className="text-lg font-medium">{position}</h3>
                </div>
                <p className="text-md text-gray-700">{description}</p>
            </div>
        </div>
    );
}


function SponsorList({ name, link, linkname, image, description }) {
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
                <div className="flex flex-col justify-around w-full px-12">
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

            <section className="my-16 py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-2xlg p-8 bg-white shadow-lg rounded-lg">
                        <h2 className="text-4xl font-bold text-primary-red mb-8">Our Sponsors</h2>
                        <p className="text-lg text-gray-700 mb-8">
                            We are grateful for the support of our sponsors, who make our club's activities possible.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 items-center">
                            {/* Sponsor 1 */}
                            <div className="flex justify-center">
                                <img
                                    src="/sfss.png"
                                    alt="Sponsor 1 Logo"
                                    className="h-20 md:h-24 lg:h-32 object-contain"
                                />
                            </div>
                            {/* Sponsor 2
                            <div className="flex justify-center">
                                <img
                                src="/sponsor2-logo.jpg"
                                alt="Sponsor 2 Logo"
                                className="h-20 md:h-24 lg:h-32 object-contain"
                                />
                            </div>
                            {/* Sponsor 3 
                            <div className="flex justify-center">
                                <img
                                src="/sponsor3-logo.jpg"
                                alt="Sponsor 3 Logo"
                                className="h-20 md:h-24 lg:h-32 object-contain"
                                />
                            </div>
                            {/* Sponsor 4 
                            <div className="flex justify-center">
                                <img
                                src="/sponsor4-logo.jpg"
                                alt="Sponsor 4 Logo"
                                className="h-20 md:h-24 lg:h-32 object-contain"
                                />
                            </div> */}
                            {/* Add more sponsors as needed */}
                        </div>
                    </div>
                </div>
            </section >

        </div >
    );
}

const execs = [
    {
        name: "Matthew",
        position: "President",
        image: "/logo.jpg",
        description: "Hi everyone! I'm Matthew Eng, a third-year student at SFU, majoring in Biomedical Physiology. My academic journey is cemented by a deep fascination with the human body and its complex processes, a passion that I’m eager to translate into a future career in healthcare or research. During the pandemic in 2020, when socialising took a new form and the world slowed down, I ventured into the world of cycling. It started as a fun way to spend time with friends and family, riding on my trusty hybrid bike. My first profound journey took us to Steveston (~40km ride), a scenic spot with the presence of Slurpees which marked the beginning of my love for cycling. By 2021, my enthusiasm had grown, and I leaped into road cycling. The transition opened up a whole new world of possibilities—from the flats of Richmond to the challenging mountains in North Vancouver. There's a unique thrill in pushing my limits and screaming through the pain in my legs, but the real joy comes from sharing these moments with others. Cycling isn't just a solitary pursuit for me; it's a way to connect, to laugh, and to create memories. As I look forward to 2024, my ambitions are set high. I’m excited to meet fellow cyclists at SFU, to share stories, tips, and rides. One of my major goals is to complete the 2024 Whistler Fondo, a gruelling yet exhilarating ride that promises both challenge and accomplishment. Here’s to more kilometres, more friendships, and more adventures on two wheels!"
    },
    {
        name: "Amelia",
        position: "Vice President",
        image: "/logo.jpg",
        description: "Hello and welcome to our cycling club at SFU! I’m Amélia and I’m a third-year geography student majoring in Global Environmental Systems! Having grown up in Burnaby surrounded by the mountains across the water, I have developed a love for being out in nature. This includes hiking, camping, walking, and most importantly cycling! It is a wonderful way to bring exploration in nature and in the city together. I’ve been biking since my childhood; Starting with short rides around our neighbourhood with my parents, to slowly increasing distances to bike around Vancouver and the other cities in the Lower Mainland. The most memorable times for me were when I was having these experiences with friends and I look forward to sharing this with other students who enjoy biking!"
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
        description: "Hi! My name is Claire Shou and I am a third-year computer science student. In my first year of university I studied health science, where I explored my passion for healthcare and physical wellness. I then discovered my passion for technology, where I transferred to studying computer science. I hope to intersect my two passions for healthcare and technology in my future career. In my free time, I enjoy spending as much time as possible outdoors, whether it's snowboarding in the winter or paddle-boarding and biking in the summer! I am excited to connect with more people during my time involved with the SFU Cycling Club!"
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