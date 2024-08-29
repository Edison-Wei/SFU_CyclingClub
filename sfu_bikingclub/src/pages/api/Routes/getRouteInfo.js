import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const rid = req.query.rid;

        const connection = await mysql.createConnection(connectionCredentials("route"));

        const queryRoute = `SELECT * FROM CyclingRoutes.ExecRoutes WHERE rid = ?`;

        const [resultRouteInfo] = await connection.execute(queryRoute, [rid]);

        connection.end();

        res.status(200).json({ resultRouteInfo });

    } catch (error) {
        console.error("Error in getRouteInfo: ", error);
        res.status(500).json({ error: "Route Information was not found, check the console for more information" });
    }
}