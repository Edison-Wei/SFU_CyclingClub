'use client';

import { ThemeToggle } from "@/components/AppHeader";
// import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function UserInfo() {
    // const { data: session } = useSession();
    const router = useRouter();

    const session = {
        user: {
            name: "james",
            email: "sas@sfu.ca"
        }
    }

    const handleSignOut = async () => {
        const res = await signOut({ redirect: false });
        if (!res?.error) {
            router.push('/login');
        }
    };

    return (
        <div className="w-full p-4 rounded-box bg-base-300 border border-neutral/5 shadow-inner">
            <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2 text-xs mb-4">
                <div>
                    <span className="text-secondary font-semibold block">Name</span>
                    <span className="text-sm font-bold text-base-content dark:text-white">
                        {session?.user?.name || "Guest User"}
                    </span>
                </div>
                <div>
                    <span className="text-secondary font-semibold block">Email</span>
                    <span className="text-sm font-bold text-base-content dark:text-white break-all">
                        {session?.user?.email || "No email available"}
                    </span>
                </div>
            </div>
            <ThemeToggle />
            </div>

            {/* Button hooks into your --color-primary and --radius-field natively via daisyUI styling */}
            <button
                onClick={handleSignOut}
                className="btn btn-primary btn-sm btn-block text-primary-content font-bold cursor-pointer transition-all"
            >
                Log Out
            </button>
        </div>
    );
}