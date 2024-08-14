const { CalculateGeojson } = require("@/app/dashboard/component/CalculateGeojson");
const { parseGPX } = require("@we-gold/gpxjs");

const FILE_NOT_READ = 601; // The given file could not be parsed by the parseGPX
const GEOJSON_PARSER_STATUS = 602; // This will indicate that the gpx data is of GeoJSON

export function transformRouteData(routes) {
    var rideInfo = [];
    var x = 0;

    while(x < routes.length) {
        const route = routes[x];
        if(route.gpx === "") {
            rideInfo.push({
                rid: route.rid,
                title: route.title,
                geojson: "",
                latitude: 49.2790223,
                longitude: -122.9201949,
                zoom: 11.5,
                difficulty: route.difficulty,
                distance: route.distance,
                start_date: route.start_date,
                start_time: route.start_time,
                end_time: route.end_time,
            })
            x++;
            continue;
        }

        try {
            const [parsedFile, error] = parseGPX(route.gpx);

            if (error)
                throw {status: FILE_NOT_READ, reason: "GPX file could not be read"};

            if (parsedFile.tracks.length === 0)
                throw {status: GEOJSON_PARSER_STATUS, reason: "Not a GPX file, parse with JSON.parse"};

            const pointOne = parsedFile.tracks[0].points[0];
            const pointTwo = parsedFile.tracks[0].points[parsedFile.tracks[0].points.length - 1];

            // Calculate zoom distance (0 space - 10 cities)
            const tan = Math.tan(45);
            let lat = pointOne.latitude - pointTwo.latitude;
            lat = (lat < 0 ? lat * -1 : lat);
            let lng = pointOne.longitude - pointTwo.longitude;
            lng = (lng < 0 ? lng * -1 : lng);
            const zoom = 12 - (lat > lng ? lat * tan : lng * tan);

            // Calculate the center of pointOne and pointTwo
            lat = (pointOne.latitude + pointTwo.latitude) / 2;
            lng = (pointOne.longitude + pointTwo.longitude) / 2;

            rideInfo.push({
                rid: route.rid,
                title: route.title,
                geojson: parsedFile.toGeoJSON(),
                latitude: lat,
                longitude: lng,
                zoom: zoom,
                difficulty: route.difficulty,
                distance: route.distance,
                start_date: route.start_date,
                start_time: route.start_time,
                end_time: route.end_time,
            });

        } catch (error) {
            try {
                if (error.status === FILE_NOT_READ)
                    throw error.reason;
    
                const GeoJSON = JSON.parse(route.gpx);
                if (GeoJSON.type != "Feature" && GeoJSON.type != "FeatureCollection")
                    throw error.reason;
    
                const jsonData = CalculateGeojson(GeoJSON);
                if (!jsonData)
                    throw error.reason;
    
                rideInfo.push({
                    rid: route.rid,
                    title: route.title,
                    geojson: GeoJSON,
                    latitude: jsonData.latitude,
                    longitude: jsonData.longitude,
                    zoom: jsonData.zoom,
                    difficulty: route.difficulty,
                    distance: route.distance,
                    start_date: route.start_date,
                    start_time: route.start_time,
                    end_time: route.end_time,
                });
            } catch (error) {
                rideInfo.push({
                    rid: route.rid,
                    title: route.title,
                    geojson: "",
                    latitude: 49.2790223,
                    longitude: -122.9201949,
                    zoom: 11.5,
                    difficulty: route.difficulty,
                    distance: route.distance,
                    start_date: route.start_date,
                    start_time: route.start_time,
                    end_time: route.end_time,
                })
            }
        }
        x++;
    }

    

    return rideInfo;
}