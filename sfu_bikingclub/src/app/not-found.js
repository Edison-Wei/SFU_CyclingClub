import Header from "@/components/Header";
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <Header />
            <div className="flex flex-col justify-center items-center h-52">
                <h1 className="text-[20px]">404 Page Not Found</h1>
                <Link href={"/"} className="underline hover:text-blue-400" >Click here to go back home</Link>
            </div>
        </>
    )
}