"use client"

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PostType } from "@/types/PostType";
import { DEFAULT_POST, samplePosts } from "@/_static_data/blogpost";

async function fetchAllPosts(): Promise<PostType[]> {
    try {
        const res = await fetch("/api/Posts/getAllPosts", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching admin dashboard posts: ", error);
        return [];
    }
}

function PostDashboardContent() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostType>(DEFAULT_POST);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            // const response = await fetchAllPosts();
            // if (response.length === 0) {
            //     setErrorMsg("Could not render the executive content repository.");
            //     return;
            // }
            // setPosts(response)
            // setSelectedPost(response[0]);
            setPosts(samplePosts)
            setSelectedPost(samplePosts[0])
        }
        loadData()
        setIsLoading(false)
    }, []);

    async function handleDeletePost(pid: number) {
        try {
            const res = await fetch(`/api/Posts/deletePost?pid=${pid}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Server refused deletion request");

            const updatedList = posts.filter(post => post.pid !== pid);
            setPosts(updatedList);
            
            setSelectedPost(updatedList.length > 0 ? updatedList[0] : DEFAULT_POST);
            setShowDeleteModal(false);
        } catch (error) {
            console.error(error);
            alert("Critical Error: Failed to remove post configuration files.");
        }
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            {showDeleteModal && (
                <PostDeletionModal
                    post={selectedPost}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => handleDeletePost(selectedPost.pid)}
                />
            )}

            <div className="px-8 pt-6 pb-6 border-b border-base-300 bg-base-100">
                <div className="max-w-screen-xl mx-auto flex items-end justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em] font-semibold mb-1">Executive Portal</p>
                        <h1 className="text-primary text-3xl font-bold tracking-tight">Content Dashboard</h1>
                    </div>
                    <Link
                        href="/dashboard/post/create"
                        className="btn btn-primary btn-sm font-bold tracking-wider text-primary-content shadow-sm"
                    >
                        + New Post
                    </Link>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-5">
                
                <div className="w-full lg:w-[42%] h-[50vh] md:h-[70vh] flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm overflow-hidden">
                    <div className="flex border-b border-base-300 bg-base-100 px-4 py-3">
                        <span className="text-sm font-bold tracking-wider uppercase text-primary">Publication Library</span>
                    </div>

                    {errorMsg && (
                        <div className="bg-error/20 text-primary text-xs font-semibold p-3 border border-secondary/20">
                            {errorMsg}
                        </div>
                    )}

                    <div className="grid grid-cols-9 px-4 py-2 bg-base-100 border-b border-base-300">
                        <span className="col-span-4 text-[10px] uppercase tracking-widest font-bold text-secondary">Post Title</span>
                        <span className="col-span-3 text-[10px] uppercase tracking-widest font-bold text-secondary">Approval Status</span>
                        <span className="col-span-2 text-[10px] uppercase tracking-widest font-bold text-secondary text-right">Date Released</span>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-base-300">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-secondary text-xs animate-pulse font-medium">
                                Loading application workspace items...
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-secondary py-16">
                                <span className="text-3xl opacity-30">📝</span>
                                <p className="text-sm">No blog documents mapped to current profile.</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <PostRow
                                    key={post.pid}
                                    post={post}
                                    isActive={selectedPost.pid === post.pid}
                                    onSelect={() => setSelectedPost(post)}
                                />
                            ))
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-base-300 bg-base-100">
                        <p className="text-[10px] text-secondary uppercase tracking-widest font-medium">
                            {posts.length} file{posts.length !== 1 ? "s" : ""} registered locally
                        </p>
                    </div>
                </div>

                <div className="w-full lg:flex-1 flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm overflow-hidden min-h-[500px]">
                    {selectedPost ? (
                        <div className="flex-1 flex flex-col h-full bg-base-100">
                            
                            <div className="w-full h-48 relative bg-base-300 border-b border-base-300">
                                {selectedPost.image ? (
                                    <Image
                                        src={selectedPost.image}
                                        alt={selectedPost.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-wider text-secondary uppercase bg-base-300/40">
                                        No Header Cover Image Specified
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-1 gap-4">
                                <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-4">
                                    <div>
                                        <h2 className="text-primary text-2xl font-bold tracking-tight leading-tight mb-1">
                                            {selectedPost.title}
                                        </h2>
                                        <p className="text-secondary text-xs uppercase tracking-wider font-medium">
                                            By {selectedPost.authorName || "Club Executive"} &nbsp;·&nbsp;
                                            {selectedPost.datePosted 
                                                ? new Date(selectedPost.datePosted).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
                                                : "Draft Profile"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <Link
                                            href={`/dashboard/post/edit?pid=${selectedPost.pid}`}
                                            className="btn btn-ghost btn-xs font-bold text-primary hover:bg-primary/10 tracking-widest"
                                        >
                                            EDIT
                                        </Link>
                                        <span className="text-base-300">|</span>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="btn btn-ghost btn-xs font-bold text-secondary hover:bg-error/10 tracking-widest"
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto max-h-64 text-sm text-base-content leading-relaxed whitespace-pre-wrap pr-1">
                                    {selectedPost.content || (
                                        <span className="italic text-secondary">Document contains no core body description text.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-secondary p-12 bg-base-100">
                            <span className="text-4xl opacity-20">📖</span>
                            <p className="text-xs uppercase tracking-widest font-semibold">No content item selected</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

interface RowProps {
    post: PostType;
    isActive: boolean;
    onSelect: () => void;
}

function PostRow({ post, isActive, onSelect }: RowProps) {
    return (
        <button
            onClick={onSelect}
            className={`w-full grid grid-cols-9 items-center px-4 py-3.5 text-left transition-all hover:bg-base-300/60 ${
                isActive ? "bg-base-300 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
            }`}
        >
            <span className="col-span-4 text-primary font-semibold text-sm truncate pr-2">
                {post.title || "Untitled Draft Entry"}
            </span>
            <span className="col-span-3 text-secondary font-normal text-sm truncate pr-2">
                {post.publish ? "Published" : "Not Approved"}
            </span>
            <span className="col-span-2 text-secondary text-xs text-right font-medium">
                {post.datePosted ? new Date(post.datePosted).toISOString().slice(0, 10) : "—"}
            </span>
        </button>
    );
}

interface ModalProps {
    post: PostType;
    onClose: () => void;
    onConfirm: () => void;
}

function PostDeletionModal({ post, onClose, onConfirm }: ModalProps) {
    return (
        <div 
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="mx-4 w-full max-w-md bg-base-100 border border-base-300 rounded-box p-6 shadow-2xl animate-in scale-in duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <h2 className="pb-3 text-primary text-xl font-bold tracking-tight">
                        Delete Blog Post?
                    </h2>
                    <p className="text-sm text-secondary mb-6">
                        Are you sure you want to completely erase <span className="font-semibold text-base-content">"{post.title || "Untitled"}"</span>? This will wipe the server record database instantly.
                    </p>
                    <div className="flex justify-end gap-2 text-sm">
                        <button 
                            onClick={onClose} 
                            className="btn btn-ghost btn-sm font-bold tracking-wide"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm} 
                            className="btn btn-secondary btn-sm font-bold tracking-wide text-white shadow-sm"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PostDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <p className="text-secondary text-sm font-medium animate-pulse">Opening Publication Database...</p>
            </div>
        }>
            <PostDashboardContent />
        </Suspense>
    );
}