import { NextResponse } from "next/server";
import connectionCredentials from "@/app/utils/dbConnection";
import mysql from 'mysql2/promise'

export async function POST(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }


    try {
        const requestHeader = new Headers(req.headers)
        const id = requestHeader.get("Authorization").slice(8);

        if (id != process.env.live_tracker_id) {
            return NextResponse.json({ message:"Access denied" }, { status: 502 });
        }

        const coordinateData = await req.json();


        // SQL connection and queries
        const connection = await mysql.createConnection(connectionCredentials("route"));
        
        const queryMID = `SELECT MAX(mid) mid FROM CyclingRoutes.LiveTracker`;
        const queryInsertCoordinate = 'INSERT INTO CyclingRoutes.LiveTracker VALUES (?, ?, ?, ?, ?, CURRENT_DATE())'

        await connection.beginTransaction();
        const [maxMID] = await connection.query(queryMID);
        let mid = maxMID[0].mid == null ? 0 : (maxMID[0].mid + 1);

        if (coordinateData.length == 0) {
            connection.end()
            return NextResponse.json({ message: "Coordinates could not be processed" }, { status: 502 });
        }

        for (const coordinateData of coordinateData) {
            const values = [mid, coordinateData.latitude, coordinateData.longitude, "location", ""];
            await connection.query(queryInsertCoordinate, values);
            mid++;
        }
        
        connection.commit();
        connection.end();

        return NextResponse.json({ message: "Coordinates processed" }, { status: 201 });
    } catch(error) {
        console.log(error)
        return NextResponse.json({ message: "Processing error" }, { status: 501 });
    }
}