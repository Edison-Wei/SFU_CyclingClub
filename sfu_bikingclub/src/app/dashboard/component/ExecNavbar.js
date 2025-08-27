'use client'
import UserInfo from "@/components/UserInfo";
import Link from "next/link";
import { useState } from "react";

export default function ExecNavbar() {
    const [toggleSideBar, settoggleSideBar] = useState(false);
    return (
        <aside>
            <button className={`pl-5 pt-1 fixed text-[40px] font-bold z-20`} onClick={() => settoggleSideBar(!toggleSideBar)}>
                &#8801;
            </button>
            <div className={`sm:w-1/6 pl-5 pr-3 h-full absolute z-10 bg-gray-200 transition duration-500 ${toggleSideBar ? "translate-x-0 " : "-translate-x-full"}`}>
                <div className="mt-32 flex flex-col justify-end gap-4 text-primary-red lg:text-[18px] md:text-[15px]" onClick={() => settoggleSideBar(!toggleSideBar)}>
                    <Link href={"/"} className="hover:underline hover:opacity-70 font-medium">Home</Link>
                    <Link href={"/dashboard"} className="hover:underline hover:opacity-70 font-medium">Dashboard</Link>
                    <Link href={"/dashboard/createroute"} className="hover:underline hover:opacity-70 font-medium">Add a Route</Link>
                    <Link href={"/dashboard/suggestion"} className="hover:underline hover:opacity-70 font-medium">Member Route</Link>
                    <Link href={"/dashboard/createPost"} className="hover:underline hover:opacity-70 font-medium">Create Blog Post</Link>
                    <Link href={"/dashboard/memberaccess"} className="hover:underline hover:opacity-70 font-medium">Member Permissions</Link>
                    <Link href={"/dashboard/executivesandsponsors"} className="hover:underline hover:opacity-70 font-medium">Executives and Sponsors</Link>
                </div>
                <div className="absolute bottom-0 w-full">
                    <UserInfo />
                </div>
            </div>
        </aside>
    );
}