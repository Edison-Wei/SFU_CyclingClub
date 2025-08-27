import connectionCredentials from '../../../app/utils/dbConnection';
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { title, difficulty, description, gpx, distance, start_Date, start_Time, end_Time } = req.body;

        const connection = await mysql.createConnection(connectionCredentials("route"));

        const queryrid = "SELECT MAX(rid) as rid FROM CyclingRoutes.ExecRoutes";
        const queryInsertRoute = "INSERT INTO CyclingRoutes.ExecRoutes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE()) ";

        // Grab rid (because AUTO_INCREMENT is not enabled on MySQL)
        await connection.beginTransaction()
        
        const [ resultrid ] = await connection.query(queryrid);
        const rid = resultrid[0].uid == null ? 0 : (resultrid[0].rid + 1)

        const values = [rid, title, description, gpx, difficulty, distance, start_Date, start_Time, end_Time];

        await connection.query(queryInsertRoute, values);

        connection.commit()
        connection.end();

        res.status(200).json({ result: "Route has been successfully Added"});

    } catch (error) {
        console.error("Error in Inserting new Route: ", error);
        res.status(500).json({ error: "Problem adding new route. Possible issues:\n The Start time is before the End time (4:00 - 2:00).\n The route selected could not be processed" });
    }
}