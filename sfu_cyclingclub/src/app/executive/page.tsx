"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { Executive, Sponsor, ImageType, RawExecutiveNSponsor } from "@/types/ClubType";
import { EXECUTIVEANDSPONSORDATA, IMAGESDATA } from "@/_static_data/ExecutiveNSponsor";

async function fetchContent(): Promise<RawExecutiveNSponsor[] | null> {
    try {
        // const res = await fetch(`/api/Executives/getExecutivesandSponsors`)
        const data = EXECUTIVEANDSPONSORDATA

        return EXECUTIVEANDSPONSORDATA;
        // return res.data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

async function fetchImages(): Promise<ImageType[] | null> {
    try {
        // const res = await fetch(`/api/Executives/getExecutivesandSponsors`)
        const data = IMAGESDATA

        return data;
        // return res.data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}


function ExecList({ executives, images }: { executives: Executive; images: ImageType[] }) {
    const match = images?.find(img => img.id === executives.id);
    const profileimage = match ? match.url : "/logo.jpg";

    return (
        <div className="flex flex-col md:flex-row items-start p-6 mb-6 bg-base-300 border border-base-300 shadow-sm rounded-box">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <Image
                    src={profileimage}
                    width={150}
                    height={150}
                    alt={`Picture of ${executives.name}`}
                    className="rounded-lg object-cover"
                />
            </div>
            <div className="flex flex-col">
                <div className="mb-2">
                    <h2 className="text-xl font-bold text-primary">{executives.name}</h2>
                    <h3 className="text-lg font-medium text-secondary">{executives.role}</h3>
                </div>
                <p className="text-md text-base-content/80">{executives.description}</p>
            </div>
        </div>
    );
}


function SponsorList({ sponsors, images }: { sponsors: Sponsor; images: ImageType[] }) {
    const match = images?.find(img => img.id === sponsors.id);
    const logoImage = match ? match.url : "/logo.jpg";

    return (
        <div className="card w-80 bg-base-300 shadow-md border border-base-300 transition-all hover:shadow-xl hover:-translate-y-1">
            <figure className="px-10 pt-10">
                <a href={sponsors.link} target="_blank" rel="noreferrer">
                    <Image src={logoImage} width={150} height={150} alt={sponsors.name} className="rounded-xl" />
                </a>
            </figure>
            <div className="card-body items-center text-center">
                <h3 className="card-title text-primary">{sponsors.name}</h3>
                <p className="text-sm text-base-content/80">{sponsors.description}</p>
                <div className="card-actions">
                    <a href={sponsors.link} className="btn btn-ghost btn-sm text-secondary">Visit Site</a>
                </div>
            </div>
        </div>
    )
}

export default function Executives() {
    const [executives, setExecutives] = useState<Executive[]>([])
    const [sponsors, setSponsors] = useState<Sponsor[]>([])
    const [images, setImages] = useState<ImageType[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchContent();
                // TODO: Another fetch for images
                if (!response) {
                    return
                }
                let executive = []
                let sponsors = []
                const images = IMAGESDATA

                for (const item of response) {
                    if (item.role !== "Sponsor") {
                        executive.push(item)
                    }
                    else {
                        sponsors.push(item)
                    }
                }
    
                setExecutives(executive);
                setSponsors(sponsors);
                setImages(images);
            } catch (error) {
                console.error("Failed to fetch data: ", error);
            } finally {
                setLoading(false);
            }
        }
        loadData()
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }


    return (
        <div className="w-full min-h-screen bg-base-100 pb-12">
            <div className="flex py-12 justify-center">
                <h1 className="text-4xl font-bold text-base-content">Executive Team</h1>
            </div>

            <div className="max-w-4xl mx-auto px-6">
                {executives.map(exec => (
                    <ExecList executives={exec} images={images} key={exec.id} />
                ))}
            </div>

            <section className="mt-20 py-16 bg-base-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-primary mb-4">Our Sponsors</h2>
                    <p className="text-lg text-base-content/70 mb-12 max-w-2xl mx-auto">
                        We are grateful for the support of our sponsors, who make our club&apos;s activities possible.
                    </p>

                    <div className="flex flex-wrap gap-8 justify-center">
                        {sponsors.map(sponsor => (
                            <SponsorList sponsors={sponsor} images={images} key={sponsor.id} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}