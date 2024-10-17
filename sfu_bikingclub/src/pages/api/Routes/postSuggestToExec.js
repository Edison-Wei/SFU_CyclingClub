import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // TODO: Slice gpx/geojson points/markers given by members 

        const { sid, title, difficulty, description, gpx, distance, start_Date, start_Time, end_Time } = req.body;

        const connection = await mysql.createConnection(connectionCredentials("route"));


        const queryInsertRoute = "INSERT INTO CyclingRoutes.ExecRoutes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE()) ";
        const queryrid = "SELECT MAX(rid) as rid FROM CyclingRoutes.ExecRoutes";
        const queryDeleteMemberRoute = `DELETE FROM CyclingRoutes.RouteSuggestions WHERE sid=?;`

        // Delete Member Suggested Route
        const [ resultDelete ] = await connection.execute(queryDeleteMemberRoute, [ sid ]);

        // Grab rid (because AUTO_INCREMENT is not enabled on MySQL)
        const [ rid ] = await connection.execute(queryrid);
        rid[0].rid += 1;

        const values = [rid[0].rid, title, gpx, difficulty, description, distance, start_Date, start_Time, end_Time];

        // Then insert route into ExecRoutes with the planned information
        const [ resultInsert ] = await connection.execute(queryInsertRoute, values);



        connection.end();

        res.status(200).json({ result: "Suggested Route has been added to Exec Route list"});

    } catch (error) {
        console.error("Error in postSuggestToExec: ", error);
        res.status(500).json({ error: "Problem when deleting or inserting Route to Exec database.\nCan be time constraint. Check database for any problems" });
    }
}