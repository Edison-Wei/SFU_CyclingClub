"use client"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { LatLngExpression } from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { GeoJSON as GeoJSONType } from "@we-gold/gpxjs";

interface MapProps {
    geoData: GeoJSONType | null
    center: LatLngExpression
    zoom: number
}

function SetView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap()

    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom, map])
    
    return null;
}

function onEachFeature(feature: any, layer: L.Layer) {
    layer.bindPopup(feature.properties?.name ?? "No data")
}

function RouteData({geoData}: {geoData: GeoJSONType | null}) {
    const geoJsonRef = useRef<L.GeoJSON | null>(null)

    useEffect(() => {
        if (!geoJsonRef.current || !geoData) return

        geoJsonRef.current.clearLayers()
        geoJsonRef.current.addData(geoData as any)
    }, [geoData])

    if (!geoData) return null

    return (
        <GeoJSON ref={geoJsonRef} data={geoData as any} style={{ color: "black" }} onEachFeature={onEachFeature}/>
    )
}

export default function Map({ geoData, center, zoom }: MapProps) {
    return (
        <div className="md:h-[40vh] w-[50vh] lg:h-[80vh] lg:w-full">
            <MapContainer center={center} zoom={zoom} className="h-full w-full z-0">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <SetView center={center} zoom={zoom} />
                <RouteData geoData={geoData} />
            </MapContainer>
        </div>
    )
}