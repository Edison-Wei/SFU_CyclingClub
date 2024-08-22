import mysql from 'mysql2/promise';
import connectionCredentials from '../../../app/utils/dbConnection';

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { rid } = req.query;

        const connection = await mysql.createConnection(connectionCredentials("route"));

        // // Delete Route Given by ID or Store the route, distance,
        // const queryRoute = `SELECT gpx, distance FROM CyclingRoutes.ExecRoutes WHERE id=${rid}`;
        // const [resultRoute] = await connection.execute(queryRoute);

        // // Check if the rid exists
        // // If not throw 501 error
        // if(!resultRoute) {
        //     throw new Error(`501: Cycling Route not found on id ${id}`);
        // }

        // // To check if the gpx data already exists in storage
        // const checkRouteStorage = `SELECT * FROM CyclingRoutes.RouteStorage WHERE gpx=${resultRoute.gpx}`;
        // const [result] = await connection.execute(checkRouteStorage);
        
        // if(!result) {
        //     const storeRoute = `INSERT INTO CyclingRoute.RouteStorage WHERE gpx=${resultRoute.gpx}, distance=${resultRoute.distance} id=(SELECT COUNT(*) FROM CyclingRoute.RouteStorage)`;
        //     await connection.execute(storeRoute);
        // }

        // Delete the row From ExecRoutes
        const queryDeleteRoute = `DELETE FROM CyclingRoutes.ExecRoutes WHERE rid=?`;
        const values = [ rid ];
        await connection.execute(queryDeleteRoute, values);

        connection.end();

        res.status(200).json({ result: "Route has been deleted"});

    } catch (error) {
        console.error("Error in Deleting Route: ", error);
        res.status(500).json({ error: "Problem when Inserting Suggest Route.\nCan be an email constraint occurred. Check database for any problems" });
    }
}