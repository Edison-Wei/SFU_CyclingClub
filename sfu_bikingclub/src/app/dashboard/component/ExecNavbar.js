'use client'
import Link from "next/link";
import { useState } from "react";

export default function ExecNavbar() {
    const [toggleSideBar, settoggleSideBar] = useState(false);
    return (
        <aside>
            <button className={`pl-5 fixed text-[40px] font-bold z-20`} onClick={() => settoggleSideBar(!toggleSideBar)}>
                &#8801;
            </button>
            <div className={`sm:w-1/6 pl-5 pr-3 h-full absolute z-10 bg-gray-200 transition duration-500 ${toggleSideBar ? "translate-x-0 " : "-translate-x-full"}`}>
                <div className="mt-32 flex flex-col justify-end gap-4 text-primary-red lg:text-[18px] md:text-[15px]">
                    <Link href={"/"} className="underline hover:opacity-70 font-medium">Home</Link>
                    <Link href={"/dashboard"} className="underline hover:opacity-70 font-medium">Dashboard</Link>
                    <Link href={"/dashboard/insert"} className="underline hover:opacity-70 font-medium">Insert Route</Link>
                    <Link href={"/dashboard/member"} className="underline hover:opacity-70 font-medium">Member Route</Link>
                </div>
            </div>
        </aside>
    );
}