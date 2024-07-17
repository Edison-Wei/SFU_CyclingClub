'use client';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UserInfo() {
    const {data: session} = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        const res = await signOut({ redirect: false }); // Ensure redirect is set to false
        if (!res.error) {
            // Redirect to the desired page after sign-out
            router.push('/login');
        }
    };

    return <div className="grid place-items-start px-2">
            <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6">
                <div>
                    Name: <span className="font-bold">{session?.user?.name}</span>
                </div>
                <div>
                    Email: <span className="font-bold">{session?.user?.email}</span>
                </div>
                <button 
                    onClick={handleSignOut}
                    className="bg-[#890B29] text-white text-sm font-bold cursor-pointer px-6 py-2 rounded-lg">
                    Log Out
                </button>
            </div>

        </div>
}