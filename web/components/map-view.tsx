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

// -----------------------------------------------------------------------------
// HELPER COMPONENTS & LOGIC defined at bottom
// -----------------------------------------------------------------------------

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
  // Default center (Hargeisa, Somaliland)
  const defaultCenter: [number, number] = [9.56, 44.06];

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
    <div className="relative w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={7}
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
              icon={createStatusIcon(source.status, source.source_type)}
              eventHandlers={{
                click: () => onSelectSource(source),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-sm text-gray-900">
                    {source.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500 font-medium capitalize">
                      {source.source_type}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {source.village}
                    </span>
                  </div>

                  {distance && (
                    <p className="text-xs font-medium text-blue-600 mt-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {distance} km away
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider"
                      style={{
                        backgroundColor: getStatusColor(source.status),
                      }}
                    >
                      {source.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController
          center={
            selectedSourceId && sources.find((s) => s.id === selectedSourceId)
              ? [
                  sources.find((s) => s.id === selectedSourceId)!.lat,
                  sources.find((s) => s.id === selectedSourceId)!.lng,
                ]
              : undefined
          }
        />
      </MapContainer>

      {/* Legend Component */}
      <MapLegend />
    </div>
  );
}

// -----------------------------------------------------------------------------
// HELPER COMPONENTS & LOGIC
// -----------------------------------------------------------------------------

function MapController({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase() || "";
  // User Requested Colors:
  // Green -> Working
  // Orange -> Low/Maintenance
  // Red -> Dry
  // Black -> Broken
  // Purple -> Contaminated

  if (s.includes("working") || s.includes("good")) return "#22c55e"; // Green
  if (s.includes("low") || s.includes("maintenance")) return "#f97316"; // Orange
  if (s.includes("dry") || s.includes("no water")) return "#ef4444"; // Red
  if (s.includes("broken")) return "#000000"; // Black
  if (s.includes("contaminated")) return "#9333ea"; // Purple

  return "#6b7280"; // Gray (default)
};

const getSourceIconSvg = (type: string, color: string) => {
  const t = type?.toLowerCase() || "";
  const stroke = color === "#ffffff" ? "#000" : "#fff"; // Contrast stroke if needed

  // Standard Icon Properties
  const props = `width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

  // Icons based on type
  if (t.includes("borehole")) {
    // Pipeline / Drilling Rig
    return `<svg ${props}><path d="M12 2v20M5 5h14M5 12h14M5 19h14"/></svg>`;
  }
  if (t.includes("dam")) {
    // Water wall / Dam structure
    return `<svg ${props}><path d="M2 12c.6.5 1.2 1 2.5 1s2.5-.5 3.5-1.3c1-.8 2-.6 2.5 0s.5 2.5 0 3.8c-.8.9-1.3 2-2.3 2.5C7.3 19 6 18.2 5 17c-1-1.2-2.3-1.8-3-2M22 12c-.6.5-1.2 1-2.5 1s-2.5-.5-3.5-1.3c-1-.8-2-.6-2.5 0s-.5 2.5 0 3.8c.8.9 1.3 2 2.3 2.5.9 1 2.3.2 3.3-1 1-1.2 2.3-1.8 3-2"/></svg>`;
  }
  if (t.includes("berkad")) {
    // Square storage / Tank
    return `<svg ${props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>`;
  }
  if (t.includes("spring")) {
    // Water droplet / Source
    return `<svg ${props}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
  }
  if (t.includes("dug well") || t.includes("well")) {
    // Circular well opening
    return `<svg ${props}><circle cx="12" cy="5" r="3"/><path d="M12 8v13"/><path d="M5 10a7 7 0 0 0 14 0"/></svg>`;
  }
  if (t.includes("togga") || t.includes("stream")) {
    // Wave / Stream
    return `<svg ${props}><path d="M2 13.29C3.14 11.9 4.88 11.23 6.5 12c1.4.67 2.1 1.6 3.5 1.6 1.4 0 2.1-.93 3.5-1.6 1.4-.67 3.14-.01 3.5 1.29"/></svg>`;
  }

  // Default (Droplet)
  return `<svg ${props}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
};

const createStatusIcon = (
  status: WaterSource["status"],
  type: WaterSource["source_type"]
) => {
  const color = getStatusColor(status);
  const iconSvg = getSourceIconSvg(type, "#ffffff");

  return new L.DivIcon({
    className: "custom-map-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1.5px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        padding: 3px; // Smaller padding for icon
      ">
        ${iconSvg}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10], // Center anchor for dots
    popupAnchor: [0, -10],
  });
};

const userIcon = new L.DivIcon({
  className: "user-icon",
  html: `<div class="bg-blue-600 w-6 h-6 rounded-full border-2 border-white shadow-md shadow-blue-400/50 flex items-center justify-center animate-pulse">
    <div class="w-2 h-2 bg-white rounded-full"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapLegend() {
  const statusItems = [
    { label: "Working", color: "#22c55e" },
    { label: "Low/Maint.", color: "#f97316" },
    { label: "Dry", color: "#ef4444" },
    { label: "Contaminated", color: "#9333ea" },
    { label: "Broken", color: "#000000" },
  ];

  const typeItems = [
    { label: "Borehole", type: "borehole" },
    { label: "Dam", type: "dam" },
    { label: "Berkad", type: "berkad" },
    { label: "Dug Well", type: "dug well" },
    { label: "Spring", type: "spring" },
    { label: "Togga/Stream", type: "togga" },
  ];

  return (
    <div className="absolute bottom-6 left-4 z-[500] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 max-w-[200px] text-xs">
      <h4 className="font-bold text-gray-900 mb-2 border-b pb-1">Status</h4>
      <div className="space-y-1.5 mb-3">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border border-gray-200"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>

      <h4 className="font-bold text-gray-900 mb-2 border-b pb-1">Type</h4>
      <div className="grid grid-cols-2 gap-2">
        {typeItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-gray-100 rounded-full p-0.5 text-gray-600 flex items-center justify-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: getSourceIconSvg(item.type, ""),
                }}
                className="w-full h-full"
              />
            </div>
            <span className="text-gray-700 text-[10px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
