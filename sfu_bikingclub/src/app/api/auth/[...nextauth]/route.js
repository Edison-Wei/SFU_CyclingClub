import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider ({
            name : "credentials",
            credentials: {},

            async authorize(credentials) {
                const {email, password} = credentials;

                try {
                    await connectMongoDB();

                    const user = await User.findOne({email});
                    if(!user) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if(!passwordMatch) {
                        return null
                    }

                    return user;

                } catch (error) {
                    console.log("Error: ", error);
                    
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/blog",
        signOut: "login",
    },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
