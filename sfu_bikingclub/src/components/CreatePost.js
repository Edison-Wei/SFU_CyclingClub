'use client';

import { useRouter } from "next/navigation";
import { useState } from 'react';
import { useSession } from "next-auth/react";
import Header from "@/components/Header";

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('Routes');
    const [image, setImage] = useState('');

    const { data: session } = useSession();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title, desc, category, authorId: session?.user?.id, image,
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
            <Header />
            <form onSubmit={handleSubmit}>
                <div className="pt-8">
                    <hr className="my-2 border-gray-400 px-0 " />
                    <h1 className="text-lg px-4">
                        Create Post
                    </h1>
                    <hr className="my-2 border-gray-400 px-0" />
                </div>
                <div className="flex justify-center items-center h-full pt-40 pb-80">
                    <div className="grid grid-cols-1 gap-6 w-full max-w-lg">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Add a title"
                                required
                                className="rounded-lg border border-gray-300 px-4 py-2 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="desc"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Add a detailed description"
                                required
                                className="rounded-lg border border-gray-300 px-4 py-2 w-full h-32"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image (Optional)</label>
                            <input
                                type="text"
                                id="image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="Image URL"
                                className="rounded-lg border border-gray-300 px-4 py-2 w-full"
                            />
                        </div>
                        <div className="pt-1 w-full">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                id="category"
                                className="rounded-lg border border-gray-300 px-4 py-2 w-full"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
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
                            className="rounded-lg bg-primary-red text-white px-4 py-2"
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
