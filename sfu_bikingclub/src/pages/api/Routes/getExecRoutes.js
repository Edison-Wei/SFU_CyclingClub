import mysql from 'mysql2/promise';
import { NextResponse, NextRequest } from "next/server";
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // Can be changed (Should take the searchParams(URL params)) not 100%
        // const obFrom = request.nextUrl.searchParams.get('searchParams');
        // const dobTo = request.nextUrl.searchParams.get('searchParams');

        const connection = await mysql.createConnection(connectionCredentials("route"));

        let get_exp_query = "SELECT * FROM CyclingRoutes.ExecRoutes";

        // Can be used to pass parameters into our sql query
        // let values = [ data1, data2, ...data3];
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