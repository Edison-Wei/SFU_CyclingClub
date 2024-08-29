import connectionCredentials from '../../../app/utils/dbConnection';
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const sid = req.query.sid;

        const connection = await mysql.createConnection(connectionCredentials("route"));

        const queryRouteSuggestion = "SELECT * FROM CyclingRoutes.RouteSuggestions WHERE sid = ?";

        const [resultsSuggestionInfo] = await connection.execute(queryRouteSuggestion, [ sid ]);

        connection.end();


        res.status(200).json({ resultsSuggestionInfo });

    } catch (error) {
        console.error("Error in getRouteSuggestionInfo: ", error);
        res.status(500).json({ error: "Route suggestion information was not found, check the console for more information."})
    }
}