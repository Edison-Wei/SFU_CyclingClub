"use client";

import { PostType } from "@/types/PostType";
import { month } from "./DateTimeFormat";

export default function BlogPost({ post }: { post: PostType }) {
    if (!post.datePosted) {
        return <></>
    }

    const datePosted = new Date(post.datePosted);

    return (
        <div className="card bg-base-200 shadow-md border border-base-300 transition-all duration-300 hover:shadow-xl hover:border-primary/50 group">
            <a href={`/blog/${post.pid}`} className="flex flex-col h-full">
                {post.image && (
                    <figure className="h-38 overflow-hidden">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </figure>
                )}
                
                <div className="card-body p-5 gap-3">
                    <h2 className="card-title text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                    </h2>
                    
                    <p className="text-sm text-base-content/80 line-clamp-3 h-15 md:h-20">
                        {post.content}
                    </p>

                    <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-300">
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                            {post.authorName}
                        </span>
                        <span className="text-[10px] opacity-60">
                            {`${month(datePosted.getMonth())} ${datePosted.getDate()}, ${datePosted.getFullYear()}`}
                        </span>
                    </div>
                </div>
            </a>
        </div>
    );
}