import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import connectionCredentials from "@/app/utils/dbConnection";

export const authOptions = {
    providers: [
        CredentialsProvider ({
            name : "credentials",
            credentials: {},

            async authorize(credentials) {
                const {email, password} = credentials;

                try {
                    const queryUser = `SELECT uid, fullname as name, role, email, CONVERT(password, CHAR) password FROM Account.Users WHERE email = ?`;

                    const connection = await mysql.createConnection(connectionCredentials("account"));
                    const [resultsUser] = await connection.execute(queryUser, [email]);
                    connection.end();

                    if (resultsUser[0].password == null)
                        return null;
                    const user = resultsUser[0]
                    
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch)
                        return null;

                    return user


                    // await connectMongoDB();

                    // const user = await User.findOne({email});
                    // if(!user) {
                    //     return null;
                    // }

                    // const passwordMatch = await bcrypt.compare(password, user.password);
                    // if(!passwordMatch) {
                    //     return null
                    // }

                    // return user;

                } catch (error) {
                    console.log("Error: ", error);
                    
                }
            }
        })
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
        signOut: "login",
    },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
