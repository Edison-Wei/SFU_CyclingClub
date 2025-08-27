import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import mysql from 'mysql2/promise';
import connectionCredentials from "@/app/utils/dbConnection";

export async function POST(req) {
    try {
        const {email} = await req.json();
        const connection = await mysql.createConnection(connectionCredentials("account"));

        const queryUsers = `SELECT fullname, email, role FROM Account.Users WHERE email = ?`;

        const [user] = await connection.execute(queryUsers, [email])

        // await connectMongoDB();
        // const {email} = await req.json();
        // const user = await User.findOne({email}).select("_id");
        if (user.length != 0)
            return NextResponse.json({user: user[0]});
        return NextResponse.json({user: null})

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}