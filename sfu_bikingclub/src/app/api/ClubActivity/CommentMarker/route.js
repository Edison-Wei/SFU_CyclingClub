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
            return NextResponse.json({ message:"Access denied"}, { status: 502 });
        }

        const commentMarkerData = await req.json();
        
        // SQL connection and queries
        const connection = await mysql.createConnection(connectionCredentials("route"));

        const queryMID = `SELECT MAX(mid) mid FROM CyclingRoutes.LiveTracker`;
        const queryInsertCoordinate = 'INSERT INTO CyclingRoutes.LiveTracker VALUES (?, ?, ?, ?, ?, CURRENT_DATE())'

        const [maxMID] = await connection.execute(queryMID);
        const mid = maxMID[0].mid == null ? 0 : (maxMID[0].mid + 1);

        try {
            const message = commentMarkerData.message;
            const coordinate = commentMarkerData.coordinate;
            if (message == null || coordinate == null) {
                
                throw new Error;
            }
            
            const values = [mid, coordinate.latitude, coordinate.longitude, "marker", message];
            await connection.execute(queryInsertCoordinate, values);
        } catch (error) {
            connection.end()
            return NextResponse.json({ message: "Marker could not be processed" }, { status: 502 });
        }
        
        connection.end();

        return NextResponse.json({ message: "Marker processed" }, { status: 201 });
    } catch(error) {
        console.log(error)
        return NextResponse.json({ message: "Processing error" }, { status: 501 });
    }
}