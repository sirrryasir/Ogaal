"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { WaterSource } from "@/lib/data";
import { cn } from "@/lib/utils";

// Fix for default marker icon in Leaflet
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to recenter map
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

const statusColors: Record<string, string> = {
  working: "bg-green-500",
  low: "bg-yellow-500",
  no_water: "bg-red-500",
  broken: "bg-gray-800",
};

const statusLabels: Record<string, string> = {
  working: "Working",
  low: "Low Water",
  no_water: "No Water",
  broken: "Broken",
};

// Custom DivIcon based on status
const createStatusIcon = (status: WaterSource["status"]) => {
  const colorClass = statusColors[status] || "bg-gray-400";
  return new L.DivIcon({
    className: "custom-icon",
    html: `<div class="${colorClass} w-6 h-6 rounded-full border-2 border-white shadow-md"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const userIcon = new L.DivIcon({
  className: "user-icon",
  html: `<div class="bg-blue-600 w-6 h-6 rounded-full border-2 border-white shadow-md shadow-blue-400/50 flex items-center justify-center">
    <div class="w-2 h-2 bg-white rounded-full"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

interface MapViewProps {
  sources: WaterSource[];
  onSelectSource: (source: WaterSource) => void;
  selectedSourceId?: number | null;
}

export default function MapView({
  sources,
  onSelectSource,
  selectedSourceId,
}: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const defaultCenter: [number, number] = [9.56, 44.06]; // Hargeisa Coords

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="text-xs font-semibold">Your Location</div>
          </Popup>
        </Marker>
      )}

      {sources.map((source) => {
        const distance = userLocation
          ? calculateDistance(
              userLocation[0],
              userLocation[1],
              source.lat,
              source.lng
            ).toFixed(1)
          : null;

        return (
          <Marker
            key={source.id}
            position={[source.lat, source.lng]}
            icon={createStatusIcon(source.status)}
            eventHandlers={{
              click: () => onSelectSource(source),
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm">{source.name}</h3>
                <p className="text-xs text-gray-500">{source.village}</p>
                {distance && (
                  <p className="text-xs font-medium text-blue-600 mt-1">
                    {distance} km away
                  </p>
                )}
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full text-white mt-1 inline-block",
                    statusColors[source.status] || "bg-gray-400"
                  )}
                >
                  {statusLabels[source.status] || source.status}
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {selectedSourceId && sources.find((s) => s.id === selectedSourceId) && (
        <MapController
          center={[
            sources.find((s) => s.id === selectedSourceId)!.lat,
            sources.find((s) => s.id === selectedSourceId)!.lng,
          ]}
        />
      )}
    </MapContainer>
  );
}
