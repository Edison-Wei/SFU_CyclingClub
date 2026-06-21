"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import BlogPost from "@/components/BlogPost";
import NewPost from '@/components/NewPost';
import { samplePosts } from '@/_static_data/blogpost';
import { PostType } from '@/types/PostType';

export default function Blog() {
    // const { data: session } = useSession();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);

    // TODO: A filter system

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // const response = await fetch('/api/post?page=0');
                // const data = await response.json();
                // setPosts(data);
                setPosts(samplePosts)
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
            <div className="min-h-screen bg-base-100 flex flex-col">
                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-lg font-medium animate-pulse">Loading Blog Posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            
            <section className="max-w-sm md:max-w-2xl lg:max-w-7xl mx-auto px-4 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-black text-primary uppercase tracking-tighter">SFU Cycling Blog</h1>
                    <div className="w-[40vw] h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
                </header>

                {posts.length === 0 ? (
                    <div className="hero min-h-[50vh] bg-base-300 rounded-box border border-base-300">
                        <div className="hero-content text-center">
                            <div className="max-w-md">
                                <h2 className="text-3xl font-bold">No blog posts yet!</h2>
                                <p className="py-6 opacity-70 text-lg">Stay tuned for updates from the SFU Cycling Club.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {posts.map((post: any) => (
                            <BlogPost key={post.pid} post={post} />
                        ))}
                    </div>
                )}
            </section>

            <div className="flex justify-center py-8">
                {/* TODO: Implement 16-post pagination logic here */}
            </div>

            {"Executive" === 'Executive' && (
                <div className="sticky bottom-8 right-8 flex justify-end px-8 pointer-events-none">
                    <div className="pointer-events-auto">
                        <NewPost />
                    </div>
                </div>
            )}
        </div>
    );
}