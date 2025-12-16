import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import L from "leaflet"; // If needed for custom icons

// Fix for default Leaflet icon not showing
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// let DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow
// });
// L.Marker.prototype.options.icon = DefaultIcon;

interface Village {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  drought_risk_level: string;
  district: { name: string };
}

interface WaterSource {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  status: string;
  water_level: number;
}

interface DroughtMapProps {
  villages: Village[];
  waterSources: WaterSource[];
}

const DroughtMap = ({ villages, waterSources }: DroughtMapProps) => {
  return (
    <MapContainer
      center={[9.56, 44.065]} // Hargeisa Approx
      zoom={7}
      style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {villages?.map((village) => (
        <CircleMarker
          key={village.id}
          center={[village.latitude || 0, village.longitude || 0]}
          radius={20}
          pathOptions={{
            color:
              village.drought_risk_level === "Severe"
                ? "red"
                : village.drought_risk_level === "High"
                ? "orange"
                : village.drought_risk_level === "Medium"
                ? "yellow"
                : "green",
            fillOpacity: 0.5,
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{village.name}</h3>
              <p>District: {village.district?.name}</p>
              <p>
                Risk:{" "}
                <span className="font-semibold">
                  {village.drought_risk_level}
                </span>
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {waterSources?.map((source) => (
        <Marker
          key={source.id}
          position={[source.latitude || 0, source.longitude || 0]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{source.name}</h3>
              <p>Type: {source.type}</p>
              <p>Status: {source.status}</p>
              <p>Water Level: {source.water_level}m</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DroughtMap;
