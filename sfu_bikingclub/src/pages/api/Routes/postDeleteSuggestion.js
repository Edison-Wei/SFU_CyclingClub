import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { sid } = req.query;

        const connection = await mysql.createConnection(connectionCredentials("route"));

        const queryDeleteRoute = `DELETE FROM CyclingRoutes.RouteSuggestions WHERE sid=?`;
        const values = [ sid ];
        await connection.execute(queryDeleteRoute, values);

        connection.end();

        res.status(200).json({ result: "Route has been deleted"});

    } catch (error) {
        console.error("Error in Deleting Route: ", error);
        res.status(500).json({ error: "Problem when Inserting Suggest Route.\nCan be an email constraint occurred. Check database for any problems" });
    }
}