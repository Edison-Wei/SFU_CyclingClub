import { parseGPX, GeoJSON } from "@we-gold/gpxjs";
import { FILE_NOT_READ, GEOJSON_PARSER_STATUS } from "../errors/ErrorTypes";

type ParseError = {
    status: string,
    reason: string,
}


export type RouteInfo = {
    geojson: GeoJSON | null,
    totalDistance: number,
    latitude: number,
    longitude: number,
    elevation: number,
    zoom: number,
    error?: ParseError | unknown,
}

export const DEFAULT_ROUTE: RouteInfo = {
    geojson: null,
    totalDistance: 0,
    latitude: 49.2327007,
    longitude: -123.0514226,
    elevation: 0,
    zoom: 11,
}

type Coordinate = [longitude: number, latitude: number, elevation?: number];


function isParseError(error: unknown): error is ParseError {
    return (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "reason" in error
    );
}

function isValidGeoJSON(input: unknown): input is GeoJSON {
    if (!input || typeof input !== "object") {
        return false;
    }

    const geo = input as GeoJSON;

    return (
        (geo.type === "Feature" || geo.type === "FeatureCollection") &&
        Array.isArray(geo.features)
    );
}

export function parseRoute(route: string): RouteInfo {

    if (!route.trim()) return DEFAULT_ROUTE;

    try {
        const [parsedFile, error] = parseGPX(route);

        if (error || !parsedFile) { 
            throw { status: FILE_NOT_READ, reason: "GPX file could not be read" } as unknown as ParseError; 
        }
        if (parsedFile.tracks.length === 0) {
            throw { status: GEOJSON_PARSER_STATUS, reason: "Not a GPX file, parsing with JSON.parse" } as unknown as ParseError;
        }

        const calculatedGeoJSON = CalculateGeojson(parsedFile.toGeoJSON());

        if (!calculatedGeoJSON) throw new Error("Failed to calculate GeoJSON");

        return calculatedGeoJSON
    } catch (gpxError: ParseError | unknown) {
        try {

            const parsedFile = JSON.parse(route) as unknown;
            if (!isValidGeoJSON(parsedFile)) {
                throw gpxError;
            }

            const calculatedGeoJSON = CalculateGeojson(parsedFile);

            if (!calculatedGeoJSON) {
                throw new Error("Could not calculateGeojson: " + gpxError);
            }

            return calculatedGeoJSON
        } catch (jsonError) {
            return {
                ...DEFAULT_ROUTE,
                error: isParseError(jsonError)
                ? jsonError
                : jsonError instanceof Error
                ? jsonError
                : new Error("Unknown parsing error"),
            };
        }
    }
}

/**
 * Calculates the given GeoJSON object with type "LineString" on Distance (in km), Center of start and end point, and Zoom (to fit the route)
 * 
 * @param geoJSON A JSON object to contain information in GeoJSON format
 * @returns an object containing { "totalDistance": distance, "latitude": lat1, "longitude": lng1, "zoom": zoom }
 * @returns null for all errors
 */
function CalculateGeojson(inputGeoJSON: GeoJSON): RouteInfo | null {
    if (inputGeoJSON.features.length > 3)
        return null;

    let minLng = Infinity; // Right
    let maxLng = -Infinity; // Left
    let minLat = Infinity; // Top
    let maxLat = -Infinity; // Bottom

    // const points = {
    //     right: inputGeoJSON.features[0].geometry.coordinates[0],
    //     left: inputGeoJSON.features[0].geometry.coordinates[0],
    //     top: inputGeoJSON.features[0].geometry.coordinates[0],
    //     bottom: inputGeoJSON.features[0].geometry.coordinates[0],
    // };
    const Radius = 6371; // Radius of Earth in km

    let totalDistance = 0; // in km
    let totalElevation = 0;

    const lineFeature = inputGeoJSON.features.filter(
        (feature) => feature.geometry?.type === "LineString"
    );

    if (!lineFeature.length) {
        return null;
    }

    for (const feature of inputGeoJSON.features) {
        if (feature.geometry.type != "LineString")
            continue;

        const coords = feature.geometry.coordinates as Coordinate[]
        if (!coords?.length) continue;

        if (!Array.isArray(coords[0])) {
            continue;
        }
        let [prevLng, prevLat, prevElev = 0] = coords[0];
        let prevLngRad = prevLng * (Math.PI / 180);
        let prevLatRad = prevLat * (Math.PI / 180);

        for (let i = 1; i < coords.length; i++) {
            const [lng, lat, elev = 0] = coords[i];
        // for (const [lng, lat, elev = 0] of coords) {

            // Check RightLngCoords
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;

            // Calculate Elevation gain/loss point to point
            totalElevation += elev - prevElev;
            prevElev = elev;

            // Used to calculate totalDistance from previous point to current point
            const lngRad = lng * (Math.PI / 180);
            const latRad = lat * (Math.PI / 180);

            const x = (lngRad - prevLngRad) * Math.cos((prevLatRad + latRad) / 2);
            const y = latRad - prevLatRad;
            totalDistance += Math.sqrt(x * x + y * y) * Radius;
            prevLngRad = lngRad;
            prevLatRad = latRad;
        }
    }
    totalDistance = Math.round(totalDistance * 100) / 100;

    // Calculate zoom distance (0 space - 11 cities)
    const zoom = totalDistance > 0
                    ? Math.max(1, 13 - Math.log10(totalDistance))
                    : DEFAULT_ROUTE.zoom;

    // Calculate the center of pointOne and pointTwo
    const lat = (minLat + maxLat) / 2;
    const lng = (minLng + maxLng) / 2;

    const geojson: GeoJSON = structuredClone(inputGeoJSON)

    // const firstFeature = geojson.features[0];
    const firstFeature = lineFeature[0];
    if (firstFeature?.geometry?.type === "LineString") {
        const coords = firstFeature.geometry.coordinates as Coordinate[];

        const start = coords[0];
        const end = coords[coords.length - 1];

        geojson.features.push(
            {
                type: "Feature",
                properties: { startPoint: "Starting/Meeting Point" },
                geometry: {
                    type: "Point",
                    coordinates: [start[0], start[1]],
                },
            },
            {
                type: "Feature",
                properties: { endPoint: "Ending Point" },
                geometry: {
                    type: "Point",
                    coordinates: [end[0], end[1]],
                },
            }
        );
    }

    return {
        "geojson": geojson,
        "totalDistance": totalDistance,
        "latitude": lat,
        "longitude": lng,
        "zoom": zoom,
        "elevation": totalElevation,
    };
}

function perpendicular(point: Coordinate, start: Coordinate, end: Coordinate): number {
    const [px, py] = point;
    const [x1, y1] = start;
    const [x2, y2] = end;

    if (x1 === x2 && y1 === y2) {
        return Math.hypot(px - x1, py -y1);
    }

    const dx = x2 - x1;
    const dy = y2 - y1;

    const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

    const clampedT = Math.max(0, Math.min(1, t));

    const projX = x1 + clampedT * dx;
    const projY = y1 + clampedT * dy;

    return Math.hypot(px - projX, py - projY);
}

function simplifyCoordinates(coords: Coordinate[], epsilon: number): Coordinate[] {
    if (coords.length < 3) {
        return coords;
    }

    const start_coord = coords[0];
    const end_coord = coords[coords.length - 1];
    let maxdistance = 0;
    let index_of_farthest = 0;

    for (let i = 1; i < coords.length - 1; i++) {
        const dist = perpendicular(coords[i], start_coord, end_coord);

        if (dist > maxdistance) {
            maxdistance = dist;
            index_of_farthest = i;
        }
    }

    if (maxdistance > epsilon) {
        const leftSegment = simplifyCoordinates(coords.slice(0, index_of_farthest + 1), epsilon);
        const rightSegment = simplifyCoordinates(coords.slice(index_of_farthest), epsilon);

        return [...leftSegment.slice(0, -1), ...rightSegment];
    }

    return [start_coord, end_coord];
}

export function RamerDouglasPeucker(points: GeoJSON, epsilon: number = 0.00005): GeoJSON {
    const simplified: GeoJSON = structuredClone(points)


    for (const feature of simplified.features) {
        if (feature.geometry.type !== "LineString") {
            continue;
        }

        const coords = feature as typeof feature & {
            geometry: {
                type: "LineString";
                coordinate: Coordinate[];
            };
        };

        feature.geometry.coordinates = simplifyCoordinates(coords.geometry.coordinate, epsilon) as (number | null)[][];
    }

    return simplified;
}