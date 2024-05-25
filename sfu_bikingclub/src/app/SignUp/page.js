import Header from "@/components/Header";
import SignUpForm from "@/components/SignUpForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function SignUp() {
    const session = await getServerSession(authOptions);

    if(session) {
        redirect("/blog");
    }

    return (
        <div className="w-full h-full py-6">
            <Header />
            <SignUpForm />
        </div>
    );
}