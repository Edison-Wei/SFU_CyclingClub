import connectionCredentials from '../../../app/utils/dbConnection';
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const connection = await mysql.createConnection(connectionCredentials("route"));

        const {created_by, gpx, distance} = req.body;

        let queryInsertSuggestion = "INSERT INTO CyclingRoutes.RouteSuggestions (created_by, date_created, gpx, distance) VALUES (?, CURRENT_DATE(), ?, ?)";

        let values = [created_by, gpx, distance];

        await connection.execute(queryInsertSuggestion, values);

        connection.end();

        res.status(200).json({ result: "Suggestion Route has been successfully Added"});

    } catch (error) {
        console.error("Error in Inserting new Suggestion Route: ", error);
        res.status(500).json({ error: "Problem when Inserting Suggest Route.\nCan be an email constraint occurred. Check database for any problems" });
    }
}