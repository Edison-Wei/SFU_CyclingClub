import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const connection = await mysql.createConnection(connectionCredentials("route"));

        // Using the VIEW upcomingRide defined in ExecRoute.sql
        const queryUpcoming = `SELECT * FROM CyclingRoutes.upcomingRide`;

        const [results] = await connection.execute(queryUpcoming);

        connection.end();

        // Not possible to parse GPX file using parseGPX
        // Can write a function to parse if needed


        res.status(200).json({ results });

    } catch (error) {
        console.error("Error Fetching upcoming Rides: ", error);
        res.status(500).json({ error: error.message })
    }
}