import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {

        let queryUpdateRoute = "UPDATE CyclingRoutes.ExecRoutes SET ";
        let tobeUpdated = [];
        let values = [];


        const { rid, title, difficulty, gpx, distance, start_Date, start_Time, end_Time } = req.body;

        if (title && title != "") {
            tobeUpdated.push("`title` = ?")
            values.push(title);
        }
        if (difficulty && difficulty != "") {
            tobeUpdated.push("`difficulty` = ?")
            values.push(difficulty);
        }
        if (gpx && gpx != "") {
            tobeUpdated.push("`gpx` = ?")
            values.push(gpx);
        }
        if (distance && distance != 0) {
            tobeUpdated.push("`distance` = ?")
            values.push(distance);
        }
        if (start_Date && start_Date != "") {
            tobeUpdated.push("`start_Date` = ?")
            values.push(start_Date);
        }
        if (start_Time && start_Time != "") {
            tobeUpdated.push("`start_Time` = ?")
            values.push(start_Time);
        }
        if (end_Time && end_Time != "") {
            tobeUpdated.push("`end_Time` = ?")
            values.push(end_Time);
        }
        if (tobeUpdated.length === 0) {
            res.status(203).json({ result: "Do not click the button, If you are not editing any of the fields."});
        }

        let counter = 0;
        while (counter < tobeUpdated.length) {
            if (counter+1 < tobeUpdated.length)
                queryUpdateRoute = queryUpdateRoute.concat(tobeUpdated[counter] + ", ");
            else
                queryUpdateRoute = queryUpdateRoute.concat(tobeUpdated[counter]);

            counter++;
        }


        queryUpdateRoute = queryUpdateRoute.concat(" WHERE `rid` = ?;");
        values.push(rid);

        const connection = await mysql.createConnection(connectionCredentials("route"));

        await connection.execute(queryUpdateRoute, values);

        connection.end();
        
        res.status(200).json({ result: "Route has been successfully Updated"});

    } catch (error) {
        console.error("Error in Updating Route : ", error);
        res.status(500).json({ error: "Problem updating route. Possible issues:\n The Start time is before the End time (4:00 - 2:00)." });
    }
}