import mysql from 'mysql2/promise';
import { NextResponse, NextRequest } from "next/server";

// Change all without the "_dev"
let connectionParams = {
    host: process.env.host_dev,
    port: parseInt(process.env.port_dev),
    user: process.env.user_dev,
    password: process.env.password_dev,
    database: process.env.database_dev,
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const connection = await mysql.createConnection(connectionParams);

        //Change
        let get_exp_query = "SELECT * FROM ClubMemberActivity.StravaRides";

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