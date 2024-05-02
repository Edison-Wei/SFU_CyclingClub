import Link from "next/link";

export default function LoginForm() {
    return (
    <div className="grid place-items-center h-screen">
        <div className="shadow-lg p-5 border-t-4">
            <h1 className="text-xl font-bold my-4">Login</h1>
            <form className="flex flex-col gap-3">
                <input type="text" placeholder="SFU Email"/>
                <input type="password" placeholder="Password"/>
                <button className="bg-[#890B29] text-white text-sm font-bold cursor-pointer px-6 py-2">LOGIN</button>
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">Error Message</div>

                <Link className="text-sm mt-3 text-right" href={'/SignUp'}>
                    Don't have an account? <span className="underline">Sign Up</span>
                </Link>
            </form>
        </div>
    </div>
    );
}