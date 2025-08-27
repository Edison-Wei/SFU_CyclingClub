import React, { useState } from 'react';

const images = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg'
];

const SlideShow = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-around md:h-[400px] lg:h-[600px] xl:h-[700px] items-center bg-white text-black p-2">
            {/* Image */}
            <div className="w-full sm:w-1/2 relative h-48 sm:h-64 lg:h-80 xl:h-[400px]">
                <img
                    src={images[currentImageIndex]}
                    alt={`Slide ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    loading='lazy'
                />
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                >
                    &#10094;
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                >
                    &#10095;
                </button>
            </div>
            {/* Text and Button */}
            <div className="text-center p-6 sm:w-1/2">
                <h2 className="text-xl md:text-2xl lg:text-2xl font-bold mb-2">Ready To Join the SFU Cycling Club?</h2>
                <p className="text-md md:text-xl lg:text-xl mb-4">We would love to have you!</p>
                <a
                    href="https://linktr.ee/sfucycling"
                    className="bg-primary-red text-white text-md hover:bg-gray-500 font-bold cursor-pointer px-6 py-2 rounded-lg"
                >
                    Join Us
                </a>
            </div>
        </div>
    );
};

export default SlideShow;
