import { NextResponse } from "next/server";
import connectionCredentials from "@/app/utils/dbConnection";
import mysql from 'mysql2/promise'

export async function GET(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const id = req.nextUrl.searchParams.get("id")
        const routeDateStr = req.nextUrl.searchParams.get("route_date")

        if (id != process.env.live_tracker_id) {
            return NextResponse.json({ message: "Access denied"}, { status: 502 })
        }

        const connection = await mysql.createConnection(connectionCredentials("route"));

        let getRouteQuery = "SELECT gpx, distance, start_date, start_time, end_time FROM CyclingRoutes.ExecRoutes WHERE start_date > 1965-09-09 ORDER BY start_date LIMIT 1";

        const [results] = await connection.execute(getRouteQuery);

        connection.end();

        if (results.length == 0) {
            return NextResponse.json({ message: "No Route Found"}, { status: 203 });
        }

        const distance = results[0].distance
        const start_date = results[0].start_date.toISOString()
        const start_time = results[0].start_time
        const end_time = results[0].end_time
        const geojsonParsed = JSON.parse(results[0].gpx)
        let gpx = []
        let markerCoordinates = []

        const futureRouteDate = new Date(start_date)
        const currentRouteDate = new Date(routeDateStr)
        const todayDate = Date.now()

        // Compare the date saved on device to the next date available on the server
        //  and compare todays date to the on device date
        // Comparison has to be done in seconds (int)
        if (futureRouteDate.getTime() >= currentRouteDate.getTime() && todayDate < currentRouteDate.getTime()) {
            console.log("For some reason your broken")
            return NextResponse.json({ mostRecentRoute: true}, { status: 202 });
        }

        for (const feature of geojsonParsed.features) {
            console.log(feature)
            if (feature.geometry.type == "LineString") {
                for (const [lng, lat, elev] of feature.geometry.coordinates) {
                    const elevNotNULL = (elev != null) ? elev : 0.01
                    gpx.push([lng, lat, elevNotNULL])
                }
            }
            else if (feature.geometry.type == "Point") {
                const message = Object.values(feature.properties)[0];
                const coordinate = feature.geometry.coordinates
                markerCoordinates.push({message: message, coordinate: coordinate})
            }
        }

        return NextResponse.json({gpx, markerCoordinates, distance, start_date, start_time, end_time}, { status: 201 });

        // Only use this when not connected to mysql server
        // return NextResponse.json(placeHolderData, { status: 201 });
    } catch(error) {
        console.log(error)
        return NextResponse.json({ message: "Route could not be fetched" }, { status: 501 });
    }
}

// TODO: Reduce memory usage in a route and store it for later use
export async function POST(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const requestHeader = new Headers(req.headers)
        const id = requestHeader.get("Authorization").slice(8);

        if (id != process.env.live_tracker_id) {
            return NextResponse.json({ message: "Access denied"}, { status: 502 })
        }

        const routeData = await req.json();

        let features = [];
        let routeCoordinates = [];
        let prevElevation = routeData.coordinates[0].elevation;
        
        try {
            for (const coordinate of routeData.coordinates) {
                const elevation = coordinate.elevation - prevElevation;
                prevElevation = coordinate.elevation;
                routeCoordinates.push([coordinate.longitude, coordinate.latitude, elevation]);
            }

            features.push({
                "type": "Feature",
                "properties": '',
                "geometry": {
                    "coordinates": routeCoordinates,
                    "type": "LineString"
                }
            });
    
            if (routeData.markerCoordinates != 0) {
                for (const marker of routeData.marker_Coordinates) {
                    features.push({
                        "type": "Feature",
                        "properties": { "message": marker.message },
                        "geometry": {
                            "coordinates": [
                                marker.coordinate.longitude,
                                marker.coordinate.latitude
                            ],
                            "type": "Point"
                        }
                    });
                }
            }

        } catch (error) {
            routeCoordinates = [];
        }
        
        const geoJSON = JSON.stringify({
            "type": "FeatureCollection",
            "features": features
        });

        // SQL connection
        const connection = await mysql.createConnection(connectionCredentials("route"));
        await connection.beginTransaction();
        
        try {
            const queryCurrentRoute = `SELECT rid, title, description FROM CyclingRoutes.ExecRoutes WHERE start_date = CURRENT_DATE()`;
            const queryDeleteExecRoute = `DELETE FROM CyclingRoutes.ExecRoutes WHERE rid = ?`;
            const queryInsertPrevRoute = "INSERT INTO CyclingRoutes.PreviousRoute VALUES (?, ?, ?, ?, ?, CURRENT_DATE())";
            const queryRIDMAX = 'SELECT * FROM (SELECT MAX(rid) errid FROM `ExecRoutes`) er, (SELECT MAX(rid) prrid FROM `PreviousRoute`) pr';
    
            const [routeRID] = await connection.query(queryCurrentRoute);
            if (routeRID.length == 0) {
                const [routeRIDMAX] = await connection.query(queryRIDMAX);
                const ridMAX = routeRIDMAX[0].errid > routeRIDMAX[0].prrid ? routeRIDMAX[0].errid : routeRIDMAX[0].prrid

                const values = [ridMAX + 1, "", "", geoJSON, routeData.elapsed_Time];
                await connection.query(queryInsertPrevRoute, values);
            } else {
                await connection.query(queryDeleteExecRoute, [routeRID[0].rid]);

                const values = [routeRID[0].rid, routeRID[0].title, routeRID[0].description, geoJSON, routeData.elapsed_Time];
                await connection.query(queryInsertPrevRoute, values);
            }
                
            connection.commit();
            connection.end();

        } catch (error) {
            connection.rollback()
            connection.end()
            return NextResponse.json({ routeProcessed: false }, { status: 502 })
        }

        return NextResponse.json({ routeProcessed: true }, { status: 201 })
    } catch(error) {
        console.log(error)
        return NextResponse.json({ routeProcessed: false }, { status: 501 })
    }
}