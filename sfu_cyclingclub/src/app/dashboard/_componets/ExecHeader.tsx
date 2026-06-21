'use client'
// import UserInfo from "@/components/UserInfo";
import Link from "next/link";
import { useState } from "react";
import { UserInfo } from "./UserInfo";

export default function ExecHeader({ children }: { children: React.ReactNode }) {
    const [toggleSideBar, setToggleSideBar] = useState(false);
    return (
        <>
            <aside className="relative">
                <button
                    className="pl-3 pt-2 fixed text-4xl font-bold z-30 text-base-content dark:text-white hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setToggleSideBar(!toggleSideBar)}
                    aria-label="Toggle Navigation Sidebar"
                >
                    &#8801;
                </button>

                <div className={`w-72 md:w-64 pl-5 pr-3 h-screen fixed top-0 left-0 z-20 bg-base-100 border-r border-base-200 flex flex-col justify-between py-8 transition-transform duration-300 ease-in-out ${toggleSideBar ? "translate-x-0" : "-translate-x-full"}`}>
                    <nav
                        className="mt-10 flex flex-col gap-2"
                        onClick={() => setToggleSideBar(false)}
                    >
                        <h2 className="text-xs uppercase font-semibold text-secondary tracking-wider border-b-1 px-3 mb-2">
                            Executive Menu
                        </h2>

                        <Link href="/" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Home Page
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>
                        <Link href="/dashboard" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Dashboard
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>
                        <div className="p-[0.1px] border-[0.5px] border-primary"></div>
                        <Link href="/dashboard/route" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Routes
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>                        
                        <Link href="/dashboard/route/create" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Add a Route
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>
                        <Link href="/dashboard/route/suggested" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Member Route
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>
                        <div className="p-[0.1px] border-[0.5px] border-primary"></div>
                        <Link href="/dashboard/post" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Blog Posts
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>
                        <Link href="/dashboard/post/create" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Create Blog Post
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>
                        <div className="p-[0.1px] border-[0.5px] border-primary"></div>
                        <Link href="/dashboard/memberaccess" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Member Permissions
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>
                        <Link href="/dashboard/executiveNsponsor" className="group px-3 py-2 text-md font-bold text-primary hover:bg-base-300 rounded-box transition-colors">
                            Executives & Sponsors
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                        </Link>
                    </nav>

                    <div className="w-full border-t border-base-300 pt-4">
                        <UserInfo />
                    </div>
                </div>

                {toggleSideBar && (
                    <div
                        className="fixed inset-0 bg-black/40 z-10 backdrop-blur-xs"
                        onClick={() => setToggleSideBar(false)}
                    />
                )}
            </aside>

            {children}
        </>
    );
}