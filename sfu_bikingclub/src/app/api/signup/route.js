import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
import mysql from 'mysql2/promise';
import connectionCredentials from "@/app/utils/dbConnection";

export async function POST(req) {
    try {
        const {name, email, password} = await req.json();
        
        // encrypt user password
        const hasedPassword = await bcrypt.hash(password, 10);
        const queryMaxUID = `Select MAX(uid) as uid FROM Account.Users`;
        const querySignUp= `INSERT INTO Account.Users VALUES (?, ?, 'student', ?, ?)`;
        

        const connection = await mysql.createConnection(connectionCredentials("account"));

        await connection.beginTransaction();

        const [maxUID] = await connection.query(queryMaxUID);
        const uid = maxUID[0].uid == null ? 0 : (maxUID[0].uid + 1);
        console.log("uid:", uid);
        
        await connection.query(querySignUp, [uid, name, email, hasedPassword]);
        
        connection.commit();
        connection.end();

        // connecting and storing the data to MongoDB 
        // await connectMongoDB();
        // await User.create({name, email, password: hasedPassword});


        return NextResponse.json({message: "User registered."}, {status: 201});

    } catch(error) {
        return NextResponse.json({message: "An error occured while registering the user"}, {status: 500});
    }
}