import { RawSuggestRoute } from "@/types/RouteType";


const defaultGPX = `<?xml version="1.0"?>
<gpx version="1.1" creator="default">
  <wpt lat="49.2790223" lon="-122.9201949">
    <name>Default Location</name>
  </wpt>
</gpx>`;

export const SUGGESTROUTE1: RawSuggestRoute = {
    sid: 0,
    created_by: "SFU Member",
    date_created: new Date("1965-09-09T07:00:00.000Z"),
    gpx: defaultGPX,
}

export const SUGGESTROUTE2: RawSuggestRoute = {
    sid: 1,
    created_by: "SFU Member",
    date_created: new Date("1965-09-09T07:00:00.000Z"),
    gpx: defaultGPX,
}