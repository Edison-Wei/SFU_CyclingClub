import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Login() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="w-full h-full py-6">
            <Header />
            <LoginForm />
        </div>
    );
}