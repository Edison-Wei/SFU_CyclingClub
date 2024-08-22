import { parseGPX } from "@we-gold/gpxjs";

export const FILE_NOT_READ = 601; // The given file could not be parsed by the parseGPX
export const GEOJSON_PARSER_STATUS = 602; // This will indicate that the gpx data is of GeoJSON

export function parseRoute(route) {

    if(route.gpx === "") {
        return {
            latitude: 49.2790223,
            longitude: -122.9201949,
            zoom: 11.5,
            totalDistance: 0,
            geojson: ""
        }
    }

    try {
        const [parsedFile, error] = parseGPX(route.gpx);

        if (error)
            throw {status: FILE_NOT_READ, reason: "GPX file could not be read"};

        if (parsedFile.tracks.length === 0)
            throw {status: GEOJSON_PARSER_STATUS, reason: "Not a GPX file, parsing with JSON.parse"};

        let totalDistance = parsedFile.tracks[0].distance.total;
        totalDistance = (totalDistance > 1000? totalDistance/1000 : totalDistance);
        totalDistance = Math.round(totalDistance * 100) / 100;
        const pointOne = parsedFile.tracks[0].points[0];
        const pointTwo = parsedFile.tracks[0].points[parsedFile.tracks[0].points.length-1];

        // Calculate zoom distance (0 space - 10 cities)
        const tan = Math.tan(45);
        let lat = pointOne.latitude - pointTwo.latitude;
        lat = (lat < 0? lat*-1: lat);
        let lng = pointOne.longitude - pointTwo.longitude;
        lng = (lng < 0? lng*-1: lng);
        const zoom = 12 - (lat > lng? lat * tan : lng * tan);

        // Calculate the center of pointOne and pointTwo
        lat = (pointOne.latitude + pointTwo.latitude)/2;
        lng = (pointOne.longitude + pointTwo.longitude)/2;

        return {
            latitude: lat,
            longitude: lng,
            zoom: zoom,
            distance: totalDistance,
            geojson: parsedFile.toGeoJSON()
        };
    } catch (error) {
        try {
            if (error.status === FILE_NOT_READ)
                throw error;

            const GeoJSON = JSON.parse(route.gpx);
            if (GeoJSON.type != "Feature" && GeoJSON.type != "FeatureCollection")
                throw error.reason;

            const jsonData = CalculateGeojson(GeoJSON);
            if (!jsonData)
                throw new Error("Could not calculateGeojson: " + error.reason);

            return {
                geojson: GeoJSON,
                distance: jsonData.totalDistance,
                latitude: jsonData.latitude,
                longitude: jsonData.longitude,
                zoom: jsonData.zoom,
            }
        } catch (error) {
            return {
                geojson: "",
                distance: 0,
                latitude: 49.2790223,
                longitude: -122.9201949,
                zoom: 11.5,
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

    const Radius = 6371; // Radius of Earth in km

    let distance = 0; // in km
    let zoom = 12; // 0 space - 10 cities

    let lng1;
    let lat1;

    GeoJSON.features.map((feature) => {
        if (feature.geometry.type != "LineString")
            return null;


        lng1 = feature.geometry.coordinates[0][0] * (Math.PI/180);
        lat1 = feature.geometry.coordinates[0][1] * (Math.PI/180);

        feature.geometry.coordinates.map((point) => {
            const lng2 = point[0] * (Math.PI/180);
            const lat2 = point[1] * (Math.PI/180);

            const x = (lng2 - lng1) * Math.cos((lat1 + lat2)/2);
            const y = lat2 - lat1;
            distance = distance + Math.sqrt(x*x + y*y) * Radius;
            lng1 = lng2;
            lat1 = lat2;
        })
        // calc center and zoom
        const length = feature.geometry.coordinates.length-1;
        const pointOne = feature.geometry.coordinates[0];
        const pointTwo = feature.geometry.coordinates[length];

        // Calculate zoom distance (0 space - 10 cities)
        const tan = Math.tan(45);
        lat1 = pointOne[1] - pointTwo[1];
        lat1 = (lat1 < 0 ? lat1 * -1 : lat1);
        lng1 = pointOne[0] - pointTwo[0];
        lng1 = (lng1 < 0 ? lng1 * -1 : lng1);
        zoom = zoom - (lat1 > lng1 ? lat1 * tan : lng1 * tan);

        // Calculate the center of pointOne and pointTwo
        lat1 = (pointOne[1] + pointTwo[1]) / 2;
        lng1 = (pointOne[0] + pointTwo[0]) / 2;
    })
    distance = Math.round(distance * 100) / 100;

    return { "totalDistance": distance, "latitude": lat1, "longitude": lng1, "zoom": zoom };
}

