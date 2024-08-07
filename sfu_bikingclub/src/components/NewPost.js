'use client';
import { useRouter } from 'next/navigation';

export default function NewPost() {
    const router = useRouter();

    const handleCreatePost = async () => {
        router.push("/login");
    }

    return (
        <div className="px-4 py-2">
            <button
                onClick={handleCreatePost}
                className="flex items-center justify-center w-12 h-12 bg-primary-red rounded-full text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </button>
        </div>
    )

};