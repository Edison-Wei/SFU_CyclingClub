import connectionCredentials from '../../../app/utils/dbConnection';
import mysql from 'mysql2/promise';
import { NextResponse, NextRequest } from "next/server";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const connection = await mysql.createConnection(connectionCredentials("route"));

        let get_exp_query = "SELECT * FROM CyclingRoutes.MemberRoutes";

        let values = [];

        const [results] = await connection.execute(get_exp_query, values);

        connection.end();
        // fields: fields.map(f => f.name)
        res.status(200).json({ results });

    } catch (error) {
        console.error("Error in StravaRides: ", error);
        res.status(500).json({ error: error.message })
    }
}