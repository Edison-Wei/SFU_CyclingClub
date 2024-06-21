import mysql from 'mysql2/promise';
import { NextResponse, NextRequest } from "next/server";
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { rid } = req.query;
        const connection = await mysql.createConnection(connectionCredentials("route"));

        // Delete Route Given by ID or Store the route, distance,
        const queryRoute = `SELECT gpx, distance FROM CyclingRoutes.ExecRoutes WHERE id=${rid}`;
        const [resultRoute] = await connection.execute(queryRoute);

        // Check if the rid exists
        // If not throw 501 error
        if(!resultRoute) {
            throw new Error(`501: Cycling Route not found on id ${id}`);
        }

        // To check if the gpx data already exists in storage
        const checkRouteStorage = `SELECT * FROM CyclingRoutes.RouteStorage WHERE gpx=${resultRoute.gpx}`;
        const [result] = await connection.execute(checkRouteStorage);
        
        if(!result) {
            const storeRoute = `INSERT INTO CyclingRoute.RouteStorage WHERE gpx=${resultRoute.gpx}, distance=${resultRoute.distance} id=(SELECT COUNT(*) FROM CyclingRoute.RouteStorage)`;
            await connection.execute(storeRoute);
        }

        // Delete the row From ExecRoutes
        const queryDelete = `DELETE FROM CyclingRoutes.ExecRoutes WHERE id=${rid}`;
        await connection.execute(queryDelete);

        connection.end();

        res.status(200);

    } catch (error) {
        console.error("Error: Could not Store deleted Route:", error);
        res.status(500).json({ error: error.message })
    }
}