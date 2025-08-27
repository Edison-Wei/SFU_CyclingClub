"use client"
import Header from "@/components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

async function fetchExecutivesandSponsors() {
    try {
        const res = await axios.get(`/api/Executives/getExecutivesandSponsors`);

        return res.data;
    } catch (error) {
        const errorRes = error.response.data
        return errorRes
    }
}

function ExecList({ exec, images }) {
    let profileimage = "/logo.jpg"
    for (let image in images) {
        if (image.id == exec.id)
            profileimage = image
    }

    return (
        <div className="flex flex-col md:flex-row items-start p-4 mb-4 bg-gray-200 shadow-lg rounded-sm">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                <Image
                    src={profileimage}
                    width={150}
                    height={150}
                    alt={`Picture of ${exec.name}`}
                    className="rounded-md"
                />
            </div>
            <div className="flex flex-col">
                <div className="mb-2">
                    <h2 className="text-xl font-bold">{exec.name}</h2>
                    <h3 className="text-lg font-medium">{exec.role}</h3>
                </div>
                <p className="text-md text-gray-700">{exec.description}</p>
            </div>
        </div>
    );
}


function SponsorList({ sponsor, images }) {
    
    let logoImage = "/logo.jpg"
    for (let image in images) {
        if (image.id == sponsor.id)
            logoImage = image
    }
    return (
        <div className="min-h-52 h-full min-w-64 max-w-80 flex flex-col items-center bg-gray-200 shadow-md rounded-xl p-4 transition duration-300 hover:shadow-2xl hover:bg-gray-300">
            <div className="mb-3">
                <a href={sponsor.link} className="">
                    <Image src={logoImage} width={150} height={150} alt={`Sponsor Image`} className="rounded-md" />
                </a>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">{sponsor.name}</h3>
            <p className="text-md text-gray-600 text-center mt-2">{sponsor.description}</p>
        </div>
    )
}

export default function Executives() {
    const [ExecutivesandSponsors, setExecutivesandSponsor] = useState([])
    const [images, setimage] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExecutivesandSponsors().then( res => {
            console.log(res)
            setExecutivesandSponsor(res.ExecutivesNSponsors);
            setimage(res.Images);
        }).finally (
            setLoading(false)
        )
    }, []);

    if (loading) {
        return (<></>)
    }


    return (
        <div className="w-full h-full">
            <Header />
            <div className="flex py-8 px-12 justify-center">
                <span className="text-[30px] font-bold">Executive Team</span>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-col justify-around w-full px-12">
                    {ExecutivesandSponsors.filter(list => {
                        if (list.role != "sponsor")
                            return list
                    }).map(exec => (
                        <ExecList exec={exec} images={images} key={exec.id}/>
                    ))}
                </div>
            </div>

            <section className="my-16 py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-2xlg p-8">
                        <h2 className="text-[30px] font-bold text-primary-red mb-8">Our Sponsors</h2>
                        <p className="text-lg text-gray-700 mb-8">
                            We are grateful for the support of our sponsors, who make our club&apos;s activities possible.
                        </p>
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center"> */}
                        <div className="flex flex-wrap gap-8 justify-center">
                        {ExecutivesandSponsors.filter(list => {
                            if (list.role == "sponsor")
                                return list
                        }).map(sponsor => (
                            <SponsorList sponsor={sponsor} images={images} key={sponsor.id} />
                        ))}
                        </div>
                    </div>
                </div>
            </section >

        </div >
    );
}