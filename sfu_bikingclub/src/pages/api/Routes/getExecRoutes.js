import mysql from 'mysql2/promise';
import { NextResponse, NextRequest } from "next/server";
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {

        const connection = await mysql.createConnection(connectionCredentials("route"));

        const queryIR = `SELECT * FROM CyclingRoutes.ExecRoutes WHERE difficulty = "intermediate"`;
        const queryBR = `SELECT * FROM CyclingRoutes.ExecRoutes WHERE difficulty = "beginner"`;
        // const queryRoute = `SELECT * FROM CyclingRoutes.ExecRoutes WHERE difficulty = "$intermediate$ "`;

        const [resultsIR] = await connection.execute(queryIR);
        const [resultsBR] = await connection.execute(queryBR);

        connection.end();

        res.status(200).json({ resultsIR, resultsBR });

    } catch (error) {
        console.error("Error in StravaRides: ", error);
        res.status(500).json({ error: error.message })
    }
}