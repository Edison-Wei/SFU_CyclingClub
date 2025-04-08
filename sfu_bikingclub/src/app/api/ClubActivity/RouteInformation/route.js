import { NextResponse } from "next/server";
import connectionCredentials from "@/app/utils/dbConnection";
import mysql from 'mysql2/promise'

export async function GET(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const connection = await mysql.createConnection(connectionCredentials("route"));

        let getRouteQuery = "SELECT gpx, distance, start_date, start_time, end_time FROM CyclingRoutes.ExecRoutes WHERE start_date > CURRENT_DATE() ORDER BY start_date LIMIT 1";

        const [results] = await connection.execute(getRouteQuery);

        connection.end();

        const distance = results[0].distance
        const start_date = results[0].start_date.toISOString()
        const start_time = results[0].start_time
        const end_time = results[0].end_time
        const geojsonParsed = JSON.parse(results[0].gpx)
        let geojsonCoordinates = []

        for (const feature of geojsonParsed.features) {
            if (feature.geometry.type != "LineString") {
                continue
            }
            for (const [lng, lat, elev] of feature.geometry.coordinates) {
                const elevNotNULL = (elev != null) ? elev : 0.01
                geojsonCoordinates.push([lng, lat, elevNotNULL])
            }
        }

        const gpx = JSON.stringify(geojsonCoordinates)

        return NextResponse.json({gpx, distance, start_date, start_time, end_time}, { status: 201 });
    } catch(error) {
        console.log(error)
        return NextResponse.json({ errormessage: "Data could not be fetched" }, { status: 501 });
    }
}

// TODO: Reduce memory usage in a route and store it for later use
export async function POST(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        console.log(req)
        return NextResponse.json({ routeProcessed: true }, { status: 201 })
    } catch(error) {
        console.log(error)
        return NextResponse.json({ routeProcessed: false }, { status: 501 })
    }
}