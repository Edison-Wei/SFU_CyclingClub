"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function NavLinks({linkClass}: {linkClass: ((path: string) => string)}) {

    return (
        <>
            <li className={linkClass("/")} >
                <Link href={"/"}>HOME</Link>
            </li>
            <li className={linkClass("/about")} >
                <Link href="/about">ABOUT</Link>
            </li>
            <li className={linkClass("/executive")} >
                <Link href="/executive">EXECUTIVES</Link>
            </li>
            <li className={linkClass("/blog")} >
                <Link href="/blog">BLOG</Link>
            </li>
            <li>
                <a
                    href="https://www.strava.com/clubs/1079967"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-content/70 transition"
                >
                    STRAVA
                </a>
            </li>
        </>
    )
}

export function ThemeToggle() {
    const [theme, setTheme] = useState("light")

    useEffect(() => {
        const saved = localStorage.getItem("theme") || "light"
        setTheme(saved)
        document.documentElement.setAttribute("data-theme", saved)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
    }

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle mr-2 transition-transform duration-300 hover:scale-110"
        >
            {theme === "light" ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 animate-spin-slow"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m0-12.728L6.05 6.05m12.728 12.728l-1.414-1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M21 12.79A9 9 0 1111.21 3c0 .34.02.67.05 1A7 7 0 0021 12.79z" />
                </svg>
            )}
        </button>
    )
}

export default function AppHeader() {
    const pathname = usePathname()
    const linkClass = (path: string) =>
        `transition-all duration-200 ${pathname === path
            ? "active font-semibold"
            : "hover:text-primary-content/70"
        }`

    return (
        <div className={`navbar-start w-full bg-primary text-primary-content top-0 z-50 ${pathname.startsWith("/dashboard") ? "hidden" : ""}`}>
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content z-[1] p-2 shadow bg-base-100 text-base-content w-[50vw] sm:w-[30vw]">
                        <NavLinks linkClass={linkClass}/>
                    </ul>
                </div>
            </div>

            <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-6">
                    <NavLinks linkClass={linkClass}/>
                </ul>
                <ThemeToggle />
            </div>
            <div className="navbar-end lg:hidden px-2">
                <ThemeToggle />
            </div>
        </div>
    )
}