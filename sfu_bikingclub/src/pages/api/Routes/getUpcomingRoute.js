import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { currentDate } = req.query;

        const connection = await mysql.createConnection(connectionCredentials("route"));

        const queryIR = `SELECT title, gpx, difficulty, distance, start_date, end_time, start_time FROM CyclingRoutes.ExecRoutes WHERE start_date > ? AND difficulty = "intermediate"`;
        const queryBR = `SELECT title, gpx, difficulty, distance, start_date, end_time, start_time FROM CyclingRoutes.ExecRoutes WHERE start_date > ? AND difficulty = "beginner"`;

        // Can be used to pass parameters into our sql query
        // let values = [ data1, data2, ...data3];
        let values = [currentDate];

        const [resultsIR] = await connection.execute(queryIR, values);
        const [resultsBR] = await connection.execute(queryBR, values);

        const routes = [resultsIR[0], resultsBR[0]];

        connection.end();
        // fields: fields.map(f => f.name)
        res.status(200).json({ routes });

    } catch (error) {
        console.error("Error in StravaRides: ", error);
        res.status(500).json({ error: error.message })
    }
}