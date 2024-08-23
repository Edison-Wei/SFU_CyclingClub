import connectionCredentials from '../../../app/utils/dbConnection';
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const connection = await mysql.createConnection(connectionCredentials("route"));

        const queryRouteSuggestion = "SELECT * FROM CyclingRoutes.RouteSuggestions";

        const [results] = await connection.execute(queryRouteSuggestion);

        connection.end();
        // fields: fields.map(f => f.name)
        res.status(200).json({ results });

    } catch (error) {
        console.error("Error in getSuggestionRoute: ", error);
        res.status(500).json({ error: error.message })
    }
}