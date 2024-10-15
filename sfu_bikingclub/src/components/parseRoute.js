import { parseGPX } from "@we-gold/gpxjs";
import { FILE_NOT_READ, GEOJSON_PARSER_STATUS } from "./errorCodes/errorCodes";

export function parseRoute(route) {

    if (route.gpx === "") {
        return {
            geojson: "",
            distance: 0,
            latitude: 49.2790223,
            longitude: -122.9201949,
            elevation: 0,
            zoom: 11.5
        }
    }

    try {
        const [parsedFile, error] = parseGPX(route.gpx);

        if (error)
            throw { status: FILE_NOT_READ, reason: "GPX file could not be read" };

        if (parsedFile.tracks.length === 0)
            throw { status: GEOJSON_PARSER_STATUS, reason: "Not a GPX file, parsing with JSON.parse" };

        const GeoJSON = CalculateGeojson(parsedFile.toGeoJSON());

        return {
            geojson: GeoJSON.geojson,
            distance: GeoJSON.totalDistance,
            latitude: GeoJSON.latitude,
            longitude: GeoJSON.longitude,
            elevation: GeoJSON.elevation,
            zoom: GeoJSON.zoom
        };
    } catch (error) {
        try {
            if (error.status === FILE_NOT_READ)
                throw error;

            const parsedFile = JSON.parse(route.gpx);
            if (parsedFile.type != "Feature" && parsedFile.type != "FeatureCollection")
                throw error.reason;

            const GeoJSON = CalculateGeojson(parsedFile);

            if (!GeoJSON)
                throw new Error("Could not calculateGeojson: " + error.reason);

            return {
                geojson: GeoJSON.geojson,
                distance: GeoJSON.totalDistance,
                latitude: GeoJSON.latitude,
                longitude: GeoJSON.longitude,
                elevation: GeoJSON.elevation,
                zoom: GeoJSON.zoom
            }
        } catch (error) {
            return {
                geojson: "",
                distance: 0,
                latitude: 49.2790223,
                longitude: -122.9201949,
                elevation: 0,
                zoom: 11.5,
                error: error
            }
        }
    }
}

/**
 * Calculates the given GeoJSON object with type "LineString" on Distance (in km), Center of start and end point, and Zoom (to fit the route)
 * 
 * @param GeoJSON A JSON object to contain information in GeoJSON format
 * @returns an object containing { "totalDistance": distance, "latitude": lat1, "longitude": lng1, "zoom": zoom }
 * @returns null for all errors
 */
function CalculateGeojson(GeoJSON) {
    if (GeoJSON.type != "Feature" && GeoJSON.type != "FeatureCollection")
        return null;
    if (GeoJSON.features.length > 3)
        return null;

    const points = {
        right: GeoJSON.features[0].geometry.coordinates[0][0],
        left: GeoJSON.features[0].geometry.coordinates[0][0],
        top: GeoJSON.features[0].geometry.coordinates[0][1],
        bottom: GeoJSON.features[0].geometry.coordinates[0][1]
    };
    const Radius = 6371; // Radius of Earth in km

    let totalDistance = 0; // in km
    let zoom = 13; // 0 space - 11 cities

    let lng1;
    let lat1;
    let prevElev;
    let totalElevation = 0;
    const pointsLength = GeoJSON.features[0].geometry.coordinates.length - 1;

    for (const feature of GeoJSON.features) {
        if (feature.geometry.type != "LineString")
            continue;

        lng1 = feature.geometry.coordinates[0][0] * (Math.PI / 180);
        lat1 = feature.geometry.coordinates[0][1] * (Math.PI / 180);
        prevElev = feature.geometry.coordinates[0][2];

        for (const [lng, lat, elev] of feature.geometry.coordinates) {

            // Check RightLngCoords
            if (points.right < lng)
                points.right = lng;
            // Check LeftLngCoords
            if (points.left > lng)
                points.left = lng;
            // Check TopLatCoords
            if (points.top < lat)
                points.top = lat;
            // Check BottomLatCoords
            if (points.bottom > lat)
                points.bottom = lat;

            // Calculate Elevation gain/loss point to point
            totalElevation += elev - prevElev;
            prevElev = elev;

            // Used to calculate totalDistance from previous point to current point
            const lng2 = lng * (Math.PI / 180);
            const lat2 = lat * (Math.PI / 180);

            const x = (lng2 - lng1) * Math.cos((lat1 + lat2) / 2);
            const y = lat2 - lat1;
            totalDistance = totalDistance + Math.sqrt(x * x + y * y) * Radius;
            lng1 = lng2;
            lat1 = lat2;
        }
    }
    totalDistance = Math.round(totalDistance * 100) / 100;

    // Calculate zoom distance (0 space - 11 cities)
    zoom = zoom - Math.log10(totalDistance);

    // Calculate the center of pointOne and pointTwo
    const lat = (points.top + points.bottom) / 2;
    const lng = (points.right + points.left) / 2;

    // Push two Points into the geojson
    // One for a Start Marker
    // One for a End Marker
    GeoJSON.features.push({
        "type": "Feature",
        "properties": { startPoint: "Starting/Meeting Point" },
        "geometry": {
            "coordinates": [
                GeoJSON.features[0].geometry.coordinates[0][0],
                GeoJSON.features[0].geometry.coordinates[0][1]
            ],
            "type": "Point"
        }
    });
    GeoJSON.features.push({
        "type": "Feature",
        "properties": { endPoint: "Ending Point" },
        "geometry": {
            "coordinates": [
                GeoJSON.features[0].geometry.coordinates[pointsLength][0],
                GeoJSON.features[0].geometry.coordinates[pointsLength][1]
            ],
            "type": "Point"
        }
    });

    return {
        "geojson": GeoJSON,
        "totalDistance": totalDistance,
        "latitude": lat,
        "longitude": lng,
        "zoom": zoom,
        "elevation": totalElevation
    };
}