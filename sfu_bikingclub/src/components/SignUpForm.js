"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRenderCount } from "@uidotdev/usehooks";

export default function SignUpForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // user does not fill out all fields
        if(!name || !email || !password) {
            setError("All fields are necessary.");
            return;
        }

        try {

            // check if user exists
            const resUserExists = await fetch("api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email})
            });

            const {user} = await resUserExists.json();

            // set error if the user exists already
            if (user) {
                setError("User already exists.");
                return;
            }

            const res = await fetch('api/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            });

            if(res.ok) {
                const form = e.target;
                form.reset();
                router.push("/blog/login"); // redirect to the login page
            } else {
                console.log("User registration failed.");
            }

        } catch (error) {
            console.log("Error during registration: ", error);
        }
    };

    console.log("Name: ", name);

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 border-t-4">
                <h1 className="text-xl font-bold my-4">Sign Up</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <input onChange={e => setName(e.target.value)} 
                            type="text" 
                            placeholder="Full Name"/>

                    <input onChange={e => setEmail(e.target.value)}
                            type="text" 
                            placeholder="SFU Email"/>

                    <input onChange={e => setPassword(e.target.value)}
                            type="password" 
                            placeholder="Password"/>

                    <button className="bg-[#890B29] text-white text-sm font-bold cursor-pointer px-6 py-2">SIGN UP</button>
                    
                    
                    { error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>)
                    }
    
                    <Link className="text-sm mt-3 text-right" href={'/blog/login'}>
                        Already have an account? <span className="underline">Login Here</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}