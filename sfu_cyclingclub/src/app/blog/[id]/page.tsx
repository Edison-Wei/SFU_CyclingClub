"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { samplePosts } from '@/_static_data/blogpost';
import { PostType } from '@/types/PostType';
import { month } from '@/components/DateTimeFormat'; // Adjust import path if needed

export default function BlogPostDetail() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState<PostType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = () => {
            try {
                const foundPost = samplePosts.find(
                    (p) => p.pid.toString() === params.id || p.pid.toString() === params.id
                );
                if (foundPost) {
                    setPost(foundPost);
                }
            } catch (error) {
                console.error('Error finding post:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-lg font-medium animate-pulse">Loading Post Content...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center p-4">
                <div className="max-w-md text-center bg-base-200 p-8 rounded-box border border-base-300 shadow-md">
                    <h2 className="text-3xl font-bold text-primary mb-4">Post Not Found</h2>
                    <p className="mb-6 text-base-content/80">The blog article you are looking for might have been moved or deleted.</p>
                    <button onClick={() => router.push('/blog')} className="btn btn-primary">
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    const datePosted = new Date(post.datePosted!);

    return (
        <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-200">
            
            {post.image && (
                <div className="relative w-full h-[30vh] md:h-[50vh] lg:h-[55vh] bg-base-300">
                    <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent opacity-60" />
                </div>
            )}
            
            <main className={`max-w-2xl md:max-w-4xl mx-auto px-4 pb-16 ${post.image ? '-mt-24 relative z-10' : 'pt-12'}`}>
                
                {/* 2. Base-200 Foreground Container */}
                <article className="bg-base-200 p-6 md:p-10 rounded-box shadow-xl border border-base-300/50">
                    
                    {/* Meta & Navigation Headers */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <button 
                            onClick={() => router.push('/blog')} 
                            className="btn btn-sm btn-ghost gap-2 text-secondary hover:text-primary pl-0"
                        >
                            ← Back to Feed
                        </button>
                        
                        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider">
                            <span className="text-secondary uppercase">{post.authorName}</span>
                            <span className="opacity-40">•</span>
                            <span className="opacity-60 font-normal">
                                {`${month(datePosted.getMonth())} ${datePosted.getDate()}, ${datePosted.getFullYear()}`}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-5xl font-black text-primary leading-tight uppercase tracking-tighter mb-8">
                        {post.title}
                    </h1>

                    <div className="h-px bg-base-300 w-full mb-8"></div>

                    <div className="text-base-content whitespace-pre-line text-base md:text-lg leading-relaxed space-y-4 font-normal">
                        {post.content}
                    </div>

                    <div className="mt-12 p-5 bg-base-300/70 rounded-box border border-base-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-xs text-secondary font-bold uppercase tracking-widest">Author Profile</p>
                            <p className="text-md font-semibold mt-1">{post.authorName}</p>
                        </div>
                        <button 
                            onClick={() => router.push('/blog')} 
                            className="btn btn-secondary btn-sm rounded-md self-start sm:self-auto"
                        >
                            View All Posts
                        </button>
                    </div>

                </article>
            </main>
        </div>
    );
}