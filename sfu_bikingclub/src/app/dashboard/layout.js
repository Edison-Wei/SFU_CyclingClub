'use client'
import ExecNavbar from "./component/ExecNavbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";


export default function RootLayout({ children }) {
  const { data: session } = useSession();
  let allowedAccess = false
  
  if (session?.user?.role == 'Executive') {
    allowedAccess = true
  }

  return allowedAccess ? 
  (<>
    <ExecNavbar/>
    {children}
  </>)
  :
  (<>
    <Header />
    <div className="flex flex-col justify-center items-center gap-6 h-52">
        <h1 className="text-[20px]">You do not have permission to access this page.</h1>
        <Link href={"/"} className="underline hover:text-blue-400 font-semibold" >Click here to go back home</Link>
    </div>
  </>)
}