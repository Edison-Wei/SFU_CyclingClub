'use client';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreatePost() {

    const { data: session } = useSession(); 
    const router = useRouter();

    const handleSubmit = async (e) => { // e is data grabbed within the form tag

        try {
            const res = await fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: e.get("title"),
                    desc: e.get("desc"),
                    category: e.get("category"),
                    authorUid: session?.user?.uid,
                    authorName: session?.user?.name,
                    image: e.get("image"),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            const data = await res.json();
            console.log('Post created:', data);
            router.replace("/blog");

        } catch (error) {
            console.error('Failed to create post:', error.message);
        }
    };

    return (
        <div>
            <form action={handleSubmit}>
                <div className="pt-2">
                    <hr className="my-2 border-gray-400 px-0 " />
                    <h1 className="text-lg px-16">
                        Create Post
                    </h1>
                    <hr className="my-2 border-gray-400 px-0" />
                </div>
                <div className="flex justify-center items-center h-full pt-28 pb-80">
                    <div className="grid grid-cols-1 gap-6 w-full max-w-lg">
                        <div>
                            <label className="block md:text-md font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Add a title"
                                required
                                className="rounded-lg border border-gray-300 px-4 py-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="block md:text-md font-medium text-gray-700">Description</label>
                            <textarea
                                name="desc"
                                placeholder="Add a detailed description"
                                required
                                className="rounded-lg border border-gray-300 px-4 py-2 w-full h-32"
                            ></textarea>
                        </div>
                        <div>
                            {/* TODO: Allow input of images on device rather than url
                                Compress the images to be shown and then saved once complete 
                                https://stackoverflow.com/questions/14672746/how-to-compress-an-image-via-javascript-in-the-browser*/}
                            <label className="block md:text-md font-medium text-gray-700">Image (Optional)</label>
                            <input
                                type="text"
                                name="image"
                                placeholder="Image URL"
                                className="rounded-lg border border-gray-300 px-4 py-2 w-full"
                            />
                        </div>
                        <div className="pt-1 w-full">
                            <label className="block md:text-md font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                className="rounded-lg border border-gray-300 px-4 py-2 w-full"
                                required
                            >
                                <option value="" disabled hidden>Select a category</option>
                                <option value="Routes">Routes</option>
                                <option value="Gear">Gear</option>
                                <option value="Deals">Deals</option>
                                <option value="Safety">Safety</option>
                                <option value="Misc">Other</option>
                            </select>
                        </div>
                        <button
                            className="rounded-lg bg-primary-red text-white px-4 py-2 hover:bg-red-800 hover:shadow-md transition"
                            type="submit"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
