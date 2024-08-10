
/**
 * Calculates the given GeoJSON object with type "LineString" on Distance (in km), Center of start and end point, and Zoom (to fit the route)
 * 
 * @param GeoJSON A JSON object to contain information in GeoJSON format
 * @returns an object containing { "totalDistance": distance, "latitude": lat1, "longitude": lng1, "zoom": zoom }
 * @returns null for all errors
 */
export function CalculateGeojson(GeoJSON) {
    if (GeoJSON.type != "Feature" && GeoJSON.type != "FeatureCollection")
        return null;
    if (GeoJSON.features.length > 3)
        return null;

    const Radius = 6371; // Radius of Earth in km

    let distance = 0; // in km
    let zoom = 12; // 0 space - 10 cities

    let lng1;
    let lat1;

    try {
        GeoJSON.features.map((feature) => {
            if (feature.geometry.type != "LineString")
                return;

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
            // calc center
            // and zoom
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
    } catch (error) {
        console.error("Could not calculate GeoJSON Data: " + error);
        return null;
    }

    return { "totalDistance": distance, "latitude": lat1, "longitude": lng1, "zoom": zoom };
}

