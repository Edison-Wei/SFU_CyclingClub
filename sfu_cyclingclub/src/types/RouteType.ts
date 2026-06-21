import { parseRoute } from "@/components/services/RouteParser"
import { GeoJSON } from "@we-gold/gpxjs"

export type Route = {
    rid: number,
    title: string,
    approved: boolean,
    description: string,
    difficulty: string,
    distance: number,
    geojson: GeoJSON | null,
    latitude: number,
    longitude: number,
    elevation: number,
    start_date: Date,
    start_time: string,
    end_time: string,
    zoom: number,
}

export type RawRoute = {
    rid: number,
    title: string,
    approved: boolean,
    description: string,
    gpx: string,
    difficulty: "beginner" | "intermediate",
    distance: number,
    start_date: Date,
    start_time: string,
    end_time: string,
    date_created?: Date,
}

export type SuggestionRoute = {
    sid: number;
    created_by: string;
    distance: number;
    latitude: number;
    longitude: number;
    elevation: number;
    zoom: number;
    geojson?: any;
    date_created: Date;
};

export type RawSuggestRoute = {
    sid: number;
    created_by: string;
    date_created: Date;
    gpx: string;
}

export const DEFAULT_ROUTE: Route = {
    rid: 0,
    title: "",
    approved: false,
    description: "",
    difficulty: "beginner",
    distance: 0,
    geojson: null,
    latitude: 49.2790223,
    longitude: -122.9201949,
    elevation: 0,
    start_date: new Date("1965-09-09T07:00:00.000Z"),
    start_time: "00:00",
    end_time: "00:00",
    zoom: 11.5
}

export const ProcessRawRoutes = (routes: RawRoute[]) => {
    return routes.map(({ rid, title, approved, description, gpx, difficulty, distance, start_date, start_time, end_time }) => {
        const { geojson, totalDistance, latitude, longitude, elevation, zoom } = parseRoute(gpx);

        return {
            rid,
            title,
            approved,
            description,
            difficulty,
            distance,
            start_date: new Date(start_date),
            start_time,
            end_time,
            geojson: geojson ?? null,
            latitude,
            longitude,
            elevation,
            zoom,
        };
    });
};