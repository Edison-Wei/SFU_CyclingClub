// import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "example@sfu.ca",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "ex: abc123"
                },
                async authorize(credentials) {
                    const { email, password } = credentials as {
                        email: string
                        password: string
                    }

                    // TODO: Call a DB instead 
                    const response = await fetch(`/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    })

                    // if (!user) return null

                    // const isValid = await bcrypt.compare(password, user.password);

                    // if (!isValid) return null



                    if (!response.ok) 
                        return null

                    const user = await response.json()

                    return user ?? null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.uid = user.uid
                token.name = user.name
                token.role = user.role
                token.email = user.email
            }
            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user.uid = token.uid
                session.user.role = token.role
            }
            return session
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/blog",
        signOut: "login"
    }
})