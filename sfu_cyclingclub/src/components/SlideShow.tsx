import { useState } from "react";

const images = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg'
];

export default function SlideShow() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <section className="bg-base-100 text-base-content transition-colors duration-300">
            <div className="flex flex-col items-center justify-around gap-8 p-6 sm:flex-row md:h-[400px] lg:h-[600px]">
                
                <div className="relative w-full overflow-hidden rounded-box shadow-xl sm:w-1/2 h-64 md:h-80 lg:h-[450px]">
                    <img
                        src={images[currentImageIndex]}
                        alt={`SFU Cycling Slide ${currentImageIndex + 1}`}
                        className="h-full w-full object-cover transition-opacity duration-500"
                        loading="lazy"
                    />
                    
                    <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
                        <button 
                            onClick={prevSlide} 
                            className="btn btn-circle btn-sm md:btn-md bg-black/50 border-none text-white hover:bg-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button 
                            onClick={nextSlide} 
                            className="btn btn-circle btn-sm md:btn-md bg-black/50 border-none text-white hover:bg-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>

                    <div className="absolute bottom-2 right-2">
                        <div className="badge badge-neutral opacity-70">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center sm:w-1/2 sm:items-start sm:text-left">
                    <h2 className="mb-2 text-2xl font-black md:text-3xl lg:text-4xl uppercase tracking-tight">
                        Ready To Join the <span className="text-primary">SFU Cycling Club?</span>
                    </h2>
                    <p className="mb-6 text-lg opacity-80 md:text-xl">
                        Whether you're a pro or just starting, we would love to have you!
                    </p>
                    
                    <a
                        href="https://linktr.ee/sfucycling"
                        className="btn btn-primary btn-wide md:btn-lg shadow-lg hover:scale-105 transition-transform"
                    >
                        Join Us
                    </a>
                </div>
            </div>
        </section>
    )
}