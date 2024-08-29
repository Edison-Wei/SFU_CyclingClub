import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const connection = await mysql.createConnection(connectionCredentials("route"));

        // Using the VIEW upcomingRide defined in ExecRoute.sql
        const queryUpcoming = `SELECT * FROM CyclingRoutes.upcomingRide`;

        let [results] = await connection.execute(queryUpcoming);

        connection.end();

        // Not possible to parse GPX file using parseGPX
        // Can write a function to parse if needed

        if (results.length === 0) {
            results.push(placeHolderData);
            results.push(placeHolderData);
        }
        else if (results.length < 2){
            if (results[0].difficulty === "Intermediate")
                results.push(placeHolderData);
            else {
                results = [placeHolderData, results[0]];
            }
        }

        res.status(200).json({ results });

    } catch (error) {
        console.error("Error Fetching upcoming Rides: ", error);
        res.status(500).json({ results: [placeHolderData, placeHolderData] });
    }
}

const placeHolderData = {
    rid: 0,
    title: "No Planned Route, Check back later",
    gpx: "",
    difficulty: "Suggest a route that could be featured",
    distance: 0,
    start_date: "1965-09-09T07:00:00.000Z",
    start_time: "00:00",
    end_time: "00:00"
}