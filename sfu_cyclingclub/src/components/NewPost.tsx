"use client";
import { useRouter } from 'next/navigation';

export default function NewPost() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/login")}
            className="btn btn-primary btn-circle btn-lg shadow-2xl hover:scale-110 transition-transform group"
            aria-label="Create New Post"
        >
            <svg 
                className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
            </svg>
        </button>
    );
}