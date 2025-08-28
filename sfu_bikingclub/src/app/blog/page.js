'use client';

import { useEffect, useState } from 'react';
import BlogPost from "@/components/BlogPost";
import Header from "@/components/Header";
import NewPost from "@/components/NewPost";
import { useSession } from 'next-auth/react';

export default function Blog() {
    const {data: session } = useSession()
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/post?page=0');
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
            <div className="w-full h-full py-2 flex flex-col justify-center items-center gap-6">
                <Header/>
                <p className='mb-4 text-lg'>Loading Blog posts...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-2">
            <Header />
            <div className='bg-gray-100 bg-opacity-30'>
                <h1 className='py-6 bg- text-[30px] font-bold text-center'>Blog</h1>
                {posts.length === 0 ? (
                    <div className="w-full h-screen flex flex-col justify-center items-center bg-white text-black">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">No blog posts yet!</h1>
                        <p className="text-lg md:text-xl">Stay tuned for updates!</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center">
                        {posts.map((post) => (
                            <BlogPost key={post.pid} post={post} />
                        ))}
                    </div>
                )}
                {session?.role == 'Executive'? (
                    <div className="sticky bottom-0 flex justify-center w-full">
                        <NewPost />
                    </div>
                ) : (
                    <></>
                )}
                {posts.length === 0 ? (
                    <div className="w-full h-screen flex flex-col justify-center items-center bg-white text-black">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">No blog posts yet!</h1>
                        <p className="text-lg md:text-xl">Stay tuned for updates!</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center">
                        {posts.map((post) => (
                            <BlogPost key={post.pid} post={post} />
                        ))}
                    </div>
                )}
                {posts.length === 0 ? (
                    <div className="w-full h-screen flex flex-col justify-center items-center bg-white text-black">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">No blog posts yet!</h1>
                        <p className="text-lg md:text-xl">Stay tuned for updates!</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center">
                        {posts.map((post) => (
                            <BlogPost key={post.pid} post={post} />
                        ))}
                    </div>
                )}
            </div>
            {/* TODO: Allow blog to populate only 16 blog posts then move to NEXT page 
                    to populate the next 16 posts
                    - From most recent to oldest post */}
            <div>
                
            </div>
        </div>
    );
}
