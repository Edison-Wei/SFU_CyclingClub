"use client"

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function CreatePostContent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [previewTitle, setPreviewTitle] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [previewContent, setPreviewContent] = useState("");
    const [previewAuthor, setPreviewAuthor] = useState("");

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title");
        const authorName = formData.get("authorName");
        const image = formData.get("image");
        const content = formData.get("content");

        try {
            const res = await fetch("/api/Posts/createpost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    authorName,
                    publish: true,
                    image,
                    content,
                    datePosted: new Date(),
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
            setFormError(error.message || "Something went wrong creating your post.");
        }
        setIsSubmitting(false);
    }

    async function saveAsDraft() {
        setFormError(null);
        setIsSaving(true);

        try {
            const res = await fetch("/api/Posts/createpost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: previewTitle,
                    authorName: previewAuthor,
                    publish: false,
                    image: previewImage,
                    content: previewContent,
                    datePosted: new Date(),
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

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="px-8 pt-6 pb-6 border-b border-base-300 bg-base-100">
                <div className="max-w-screen-xl mx-auto flex items-end justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase tracking-[0.2em] font-semibold mb-1">Executive Portal</p>
                        <h1 className="text-primary text-3xl font-bold tracking-tight">Create Publication</h1>
                    </div>
                    <Link
                        href="/dashboard/post"
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
                    <div className="border-b border-base-300 pb-2">
                        <h2 className="text-sm font-bold tracking-wider uppercase text-primary">Post Composer</h2>
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
                            placeholder="e.g. Annual Club Membership Updates"
                            onChange={(e) => setPreviewTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Author Name</label>
                        <input
                            className="input input-bordered w-full bg-base-100"
                            name="authorName"
                            type="text"
                            placeholder="e.g. John Doe (Club Vice-President)"
                            onChange={(e) => setPreviewAuthor(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Cover Image URL</label>
                        <input
                            className="input input-bordered w-full bg-base-100"
                            name="image"
                            type="url"
                            placeholder="https://example.com/assets/banner.jpg"
                            onChange={(e) => setPreviewImage(e.target.value)}
                        />
                        <span className="text-[10px] text-secondary/70 italic">Leave empty to omit the top cover display panel banner.</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-xs uppercase tracking-wider text-secondary">Core Article Content</label>
                        <textarea
                            className="textarea textarea-bordered h-64 w-full bg-base-100 text-sm leading-relaxed placeholder:text-base-content/40"
                            name="content"
                            placeholder="Draft your main story announcement text body here..."
                            onChange={(e) => setPreviewContent(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submission CTA row */}
                    <div className="border-t border-base-300 pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn btn-ghost btn-sm border border-base-300 font-bold tracking-wide"
                            disabled={isSubmitting || isSaving}
                        >
                            Discard
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
                            {isSubmitting ? "Publishing..." : "Publish Article"}
                        </button>
                    </div>
                </form>

                <div className="w-full lg:col-span-5 flex flex-col bg-base-200 rounded-box border border-base-300 shadow-sm overflow-hidden h-fit lg:sticky lg:top-6">
                    <div className="flex border-b border-base-300 bg-base-100 px-4 py-3">
                        <span className="text-sm font-bold tracking-wider uppercase text-secondary">Live Layout Preview</span>
                    </div>

                    <div className="flex flex-col h-full bg-base-100">
                        <div className="w-full h-40 relative bg-base-300 border-b border-base-300 flex items-center justify-center overflow-hidden">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Live Cover Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Suppress broken load links gracefully
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="text-xs font-semibold tracking-wider text-secondary uppercase opacity-60">
                                    No Cover Media Mounted
                                </div>
                            )}
                        </div>

                        <div className="p-5 flex flex-col gap-3 min-h-[250px]">
                            <div className="border-b border-base-300 pb-3">
                                <h2 className="text-primary text-xl font-bold tracking-tight leading-tight mb-1 truncate">
                                    {previewTitle || "Untitled Publication Draft"}
                                </h2>
                                <p className="text-secondary text-[11px] uppercase tracking-wider font-semibold">
                                    By {previewAuthor || "Executive Staff Admin"} &nbsp;·&nbsp; {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>

                            <div className="text-xs text-base-content/80 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto break-words">
                                {previewContent || (
                                    <span className="italic text-secondary/50">Your article body text will parse live down inside this viewport window layout container frame...</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function CreatePostPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <p className="text-secondary text-sm font-medium animate-pulse">Mounting Form Composer Panel...</p>
            </div>
        }>
            <CreatePostContent />
        </Suspense>
    );
}