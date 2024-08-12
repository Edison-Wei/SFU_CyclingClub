'use client';

import { useEffect, useState } from 'react';
import BlogPost from "@/components/BlogPost";
import Header from "@/components/Header";
import NewPost from "@/components/NewPost";

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/post');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full py-2 flex justify-center items-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full py-2">
            <Header />
            {posts.length === 0 ? (
                <div className="w-full h-screen flex flex-col justify-center items-center bg-white text-black">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">No blog posts yet!</h1>
                    <p className="text-lg md:text-xl">Stay tuned for updates!</p>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center">
                    {posts.map((post) => (
                        <BlogPost key={post._id} post={post} />
                    ))}
                </div>
            )}
            <div className="sticky bottom-0 flex justify-center w-full">
                <NewPost />
            </div>
        </div>
    );
}
