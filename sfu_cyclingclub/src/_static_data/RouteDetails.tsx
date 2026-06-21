import { RawRoute } from "@/types/RouteType"

const defaultGPX = `<?xml version="1.0"?>
<gpx version="1.1" creator="default">
  <wpt lat="49.2790223" lon="-122.9201949">
    <name>Default Location</name>
  </wpt>
</gpx>`;

export const BEGINNER_ROUTE_DETAILS_1: RawRoute = {
    rid: 0,
    title: "Short ride",
    approved: false,
    description: "A Beginner Ride",
    gpx: defaultGPX,
    difficulty: "beginner",
    distance: 1214,
    start_date: new Date("1965-09-09T07:00:00.000Z"),
    start_time: "00:00",
    end_time: "00:00",
    date_created: new Date("1965-09-09T07:00:00.000Z"),
}
export const BEGINNER_ROUTE_DETAILS_2: RawRoute = {
    rid: 2,
    title: "Short ride",
    approved: true,
    description: "A Beginner Ride",
    gpx: defaultGPX,
    difficulty: "beginner",
    distance: 321,
    start_date: new Date("1965-09-09T07:00:00.000Z"),
    start_time: "00:00",
    end_time: "00:00",
    date_created: new Date("1965-09-09T07:00:00.000Z"),
}

export const INTERMEDIATE_ROUTE_DETAILS_1: RawRoute = {
    rid: 1,
    title: "Long ride",
    approved: true,
    description: "A Intermediate Ride",
    gpx: defaultGPX,
    difficulty: "intermediate",
    distance: 46,
    start_date: new Date("1965-09-09T07:00:00.000Z"),
    start_time: "00:00",
    end_time: "00:00",
    date_created: new Date("1965-09-09T07:00:00.000Z"),
}
export const INTERMEDIATE_ROUTE_DETAILS_2: RawRoute = {
    rid: 3,
    title: "Long ride",
    approved: false,
    description: "A Intermediate Ride",
    gpx: defaultGPX,
    difficulty: "intermediate",
    distance: 124124,
    start_date: new Date("1965-09-09T07:00:00.000Z"),
    start_time: "00:00",
    end_time: "00:00",
    date_created: new Date("1965-09-09T07:00:00.000Z"),
}