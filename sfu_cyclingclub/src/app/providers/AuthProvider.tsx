import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AuthProvider() {
    const session = await auth()

    if (!session)
        redirect("/login")
}