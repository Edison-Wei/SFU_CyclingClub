import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { interID, beginId } = req.query;

        const connection = await mysql.createConnection(connectionCredentials("route"));

        // AND difficulty = "intermediate"
        const queryIR = `SELECT gpx FROM CyclingRoutes.ExecRoutes WHERE id = ${interID}`;
        const queryBR = `SELECT gpx FROM CyclingRoutes.ExecRoutes WHERE id = ${beginId}`;

        const [resultsIR] = await connection.execute(queryIR);
        const [resultsBR] = await connection.execute(queryBR);

        const routes = [resultsIR[0], resultsBR[0]];

        connection.end();
        // fields: fields.map(f => f.name)
        res.status(200).json({ routes });

    } catch (error) {
        console.error("Error in StravaRides: ", error);
        res.status(500).json({ error: error.message })
    }
}