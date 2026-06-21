"use client"

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PostType } from "@/types/PostType";
import { samplePosts } from "@/_static_data/blogpost";

async function fetchPostDetails(pid: string | null): Promise<PostType | null> {
    if (!pid) return null;
    try {
        const res = await fetch(`/api/Posts/editpost?pid=${pid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();

        return data.result || data.post || data;
    } catch (error) {
        console.error("Error fetching single post parameters: ", error);
        return null;
    }
}

function EditPostContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pid = searchParams.get("pid");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [image, setImage] = useState("");
    const [content, setContent] = useState("");
    const [datePosted, setDatePosted] = useState<Date>(new Date());

    useEffect(() => {
        if (!pid) {
            setFormError("Missing required parameter configuration tracking token 'pid'.");
            setIsLoading(false);
            return;
        }
        const loadData = async () => {
            const post = await fetchPostDetails(pid);

            if (post) {
                setTitle(post.title || "");
                setAuthorName(post.authorName || "");
                setImage(post.image || "");
                setContent(post.content || "");
                if (post.datePosted) setDatePosted(new Date(post.datePosted));
            } else {
                setFormError("Failed to find target document registry on server cluster backend.");
            }
            setIsLoading(false);
        }
        loadData()
    }, [pid]);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/Posts/editpost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pid,
                    title,
                    authorName,
                    image,
                    content,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to commit local publication modifications back to database.");
            }

            alert("Success! Changes written to master log registry.");
            router.push("/dashboard/posts");
            router.refresh();
        } catch (error: any) {
            setFormError(error.message || "Something went wrong updating your post.");
        }
        setIsSubmitting(false);
    }

    async function saveAsDraft() {
        setFormError(null);
        setIsSaving(true);

        try {
            const res = await fetch("/api/Posts/editpost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pid: pid,
                    title: title,
                    authorName: authorName,
                    publish: false,
                    image: image,
                    content: content,
                    datePosted: datePosted,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create the new publication record.");
            }

            alert("Success! The post has been added to the system.");
            router.push("/dashboard/post");
            router.refresh();
        } catch (error: any) {
            console.log(error)
            setFormError(error.message || "Something went wrong creating your post.");
        }
        setIsSaving(true);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <p className="text-secondary text-sm font-medium animate-pulse">Syncing Publication Configuration Data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="px-8 pt-6 pb-6 border-b border-base-300 bg-base-100">
                <div className="max-w-screen-xl mx-auto flex items-end justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em] font-semibold mb-1">Executive Portal</p>
                        <h1 className="text-primary text-3xl font-bold tracking-tight">Modify Publication</h1>
                    </div>
                    <Link
                        href="/dashboard/posts"
                        className="btn btn-ghost btn-sm font-bold tracking-wider text-secondary hover:text-primary"
                    >
                        ← Back to Library
                    </Link>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                <form
                    onSubmit={handleSubmit}
                    className="w-full lg:col-span-7 bg-base-200 border border-base-300 rounded-box p-6 md:p-8 shadow-sm flex flex-col gap-6 text-sm"
                >
                    <div className="border-b border-base-300 pb-2 flex justify-between items-center">
                        <h2 className="text-sm font-bold tracking-wider uppercase text-primary">Content Customization Editor</h2>
                        <span className="text-[10px] text-secondary font-mono tracking-wider opacity-60">ID: {pid}</span>
                    </div>

                    {formError && (
                        <div className="bg-error/10 border border-error/20 text-primary p-3 rounded-md font-medium text-xs">
                            {formError}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Document Title</label>
                        <input
                            className="input input-bordered w-full bg-base-100"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Post Title Name"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Author Name</label>
                        <input
                            className="input input-bordered w-full bg-base-100"
                            name="authorName"
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Author Descriptor Tag"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Cover Image URL</label>
                        <input
                            className="input input-bordered w-full bg-base-100"
                            name="image"
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://domain.com/assets/banner.jpg"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Article Content Body</label>
                        <textarea
                            className="textarea textarea-bordered h-64 w-full bg-base-100 text-sm leading-relaxed"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Draft announcement details here..."
                            required
                        />
                    </div>

                    {/* Bottom Action CTA Trigger Grid */}
                    <div className="border-t border-base-300 pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn btn-ghost btn-sm border border-base-300 font-bold tracking-wide"
                            disabled={isSubmitting || isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={saveAsDraft}
                            className="btn btn-ghost btn-sm border border-base-300 font-bold tracking-wide"
                            disabled={isSubmitting || isSaving}
                        >
                            {isSaving ? "Saving Draft..." : "Save as Draft"}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isSaving}
                            className="btn btn-primary btn-sm px-6 font-bold tracking-wide text-primary-content shadow-sm"
                        >
                            {isSubmitting ? "Saving Changes..." : "Commit Changes"}
                        </button>
                    </div>
                </form>

                <div className="w-full lg:col-span-5 flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm overflow-hidden h-fit lg:sticky lg:top-6">
                    <div className="flex border-b border-base-300 bg-base-100 px-4 py-3">
                        <span className="text-sm font-bold tracking-wider uppercase text-secondary">Updated Visual Preview</span>
                    </div>

                    <div className="flex flex-col h-full bg-base-100">
                        <div className="w-full h-40 relative bg-base-300 border-b border-base-300 flex items-center justify-center overflow-hidden">
                            {image ? (
                                <img
                                    src={image}
                                    alt="Live Cover Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="text-xs font-semibold tracking-wider text-secondary uppercase opacity-60">
                                    No Cover Media Mounted
                                </div>
                            )}
                        </div>

                        {/* Content Field Layout Previews */}
                        <div className="p-5 flex flex-col gap-3 min-h-[250px]">
                            <div className="border-b border-base-300 pb-3">
                                <h2 className="text-primary text-xl font-bold tracking-tight leading-tight mb-1 truncate">
                                    {title || "Untitled Draft Entry"}
                                </h2>
                                <p className="text-secondary text-[11px] uppercase tracking-wider font-semibold">
                                    By {authorName || "Executive Admin Staff"} &nbsp;·&nbsp; {datePosted.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>

                            <div className="text-xs text-base-content/80 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto break-words">
                                {content || (
                                    <span className="italic text-secondary/50">Changes to the body field will render automatically below...</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function EditPostPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <p className="text-secondary text-sm font-medium animate-pulse">Assembling Form Workspace Panels...</p>
            </div>
        }>
            <EditPostContent />
        </Suspense>
    );
}