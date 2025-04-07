import { NextResponse } from "next/server";
import connectionCredentials from "@/app/utils/dbConnection";
import mysql from 'mysql2/promise'

export async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        
        return NextResponse.json({ routeProcessed: true }, { status: 201 });
    } catch(error) {
        console.log(error)
        return NextResponse.json({ errormessage: "Nothing happened" }, { status: 501 });
    }
}