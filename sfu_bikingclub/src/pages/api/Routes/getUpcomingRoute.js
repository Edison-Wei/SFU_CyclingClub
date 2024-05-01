import mysql from 'mysql2/promise';
import connectionCredentials from '@/pages/MysqlConnection/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { currentDate } = req.query;

        const connection = await mysql.createConnection(connectionCredentials("route"));

        let get_exp_query = "SELECT * FROM CyclingRoutes.ExecRoutes WHERE start_date > " + currentDate;

        // Can be used to pass parameters into out sql query
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