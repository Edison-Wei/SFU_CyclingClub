import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const {name, email, password} = await req.json();
        
        // encrypt user password
        const hasedPassword = await bcrypt.hash(password, 10);

        // connecting and storing the data to MongoDB 
        await connectMongoDB();
        await User.create({name, email, password: hasedPassword});


        return NextResponse.json({message: "User registered."}, {status: 201});

    } catch(error) {
        return NextResponse.json({message: "An error occured while registering the user"}, {status: 500});
    }
}