import Header from "@/components/Header";

export default function About() {
    return (
        <div>
            <Header />
            <div className="my-4">
                <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
                    <h2 className="text-3xl font-bold mb-4">About SFU Cycling Club</h2>

                    <section className="mb-8 p-6 bg-gray-100 shadow-md rounded-lg">
                        <h3 className="text-2xl font-semibold mb-2">Turning the gears - Our beginning</h3>
                        <p className="sm:text-md md:text-xl lg:text-xl text-gray-700 mb-4">
                            In October 2021, amidst a growing demand for a university community dedicated to road cycling, a group of enthusiastic cyclists from Simon Fraser University (SFU) joined a Discord group. As the group gained momentum, it became clear that cycling was popularised at SFU and there needed to be a formal structure to support and expand SFU`s cycling activities. This led to the SFU Cycling Club`s official recognition by the Simon Fraser Student Society (SFSS) in 2023. Now a fully accredited club, SFU Cycling is the cornerstone for prospective to seasoned cyclists who aspire to enjoy the sport of cycling within an uplifted community of enthusiasts.
                        </p>
                    </section>

                    <section className="mb-8 p-6 bg-gray-100 shadow-md rounded-lg">
                        <h3 className="text-2xl font-semibold mb-2">Pedalling Forward</h3>
                        <p className="sm:text-md md:text-xl lg:text-xl text-gray-700 mb-4">
                            At the heart of the SFU Cycling Club is a vibrant community dedicated to fostering a love for cycling. Our activities revolve around organising regular bike rides that cater to various skill levels and interests. Whether you`re looking to explore scenic routes, push your limits on challenging terrains, or simply enjoy a leisurely ride with friends, there`s a spot for you in our club!
                        </p>

                        <p className="sm:text-md md:text-xl lg:text-xl text-gray-700 mb-4">
                            The SFU Cycling Club is not confined to the university campus. Our rides take us from the urban landscapes to the North Shore mountains, offering members a wide range of experiences. Some of our favourite itineraries include:
                        </p>
                        <ul className="sm:text-md md:text-xl lg:text-xl list-disc list-inside text-gray-700 mb-4">
                            <li><strong>Stanley Park:</strong> Known for its stunning views and gnarly “short” climb, Stanley Park is a favourite for leisurely rides and social gatherings.</li>
                            <li><strong>Seymour Demonstration Forest:</strong> This peaceful location offers a perfect escape into nature, with its lush greenery and car-free paths.</li>
                            <li><strong>Burnaby Mountain:</strong> With its challenging hills and scenic routes, the SFU campus itself provides a great training ground for cyclists of all levels.</li>
                            <li><strong>UBC:</strong> Riding around the UBC campus, this ride provides a speedy flat section and leg-burning hill climb. Once completed, these diverse sections provide a significant rewarding experience.</li>
                        </ul>
                        <p className="sm:text-md md:text-xl lg:text-xl text-gray-700 mb-4">From the flats to the mountains, every ride with the SFU Cycling Club is an adventure waiting to happen.</p>
                    </section>

                    <section className="mb-8 p-6 bg-gray-100 shadow-md rounded-lg">
                        <h3 className="text-2xl font-semibold mb-2">Beyond the Rides</h3>
                        <p className="sm:text-md md:text-xl lg:text-xl text-gray-700 mb-4">
                            Beyond the rides, the SFU Cycling Club is a hub for friendship and community engagement. We provide ample opportunities for members to connect, share experiences, and build lasting relationships. Our events often extend beyond cycling, with volunteer opportunities that allow members to give back to the community while promoting a healthy and active lifestyle.
                        </p>
                    </section>

                    <section className="mb-8 p-6 bg-gray-100 shadow-md rounded-lg">
                        <h3 className="text-2xl font-semibold mb-2">Ready to Ride?</h3>
                        <p className="sm:text-md md:text-xl lg:text-xl text-gray-700 mb-4">
                            Our doors are open to everyone at SFU! Whether you`re a seasoned cyclist or a newcomer to the sport, we welcome you to join us. Our club thrives on diversity, and we believe that every member brings something unique to our community. As long as you have a passion for cycling and a desire to be part of a supportive and dynamic group, the SFU Cycling Club is the place for you. Come ride with us and discover the joy of cycling in a supportive and enthusiastic community!
                        </p>
                        <p className="sm:text-md md:text-xl lg:text-xl text-gray-700 mb-4">
                            For more information or to join our next ride, connect with us on our Discord or follow us on our social media channels. We can`t wait to ride with you!
                        </p>
                        <div className="flex justify-center">
                            <a
                                href="https://linktr.ee/sfucycling"
                                className="bg-primary-red text-white text-m hover:bg-gray-500 font-bold cursor-pointer px-6 py-2 rounded-lg"
                            >
                                Join Us
                            </a>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
