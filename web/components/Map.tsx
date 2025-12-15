'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default Leaflet icons in Webpack/Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Custom Icons could be added here based on status

const MapComponent = ({ data }: { data: any[] }) => {
    // data is array of boreholes with lat/long (from village)
    
    return (
        <MapContainer center={[2.5, 38.0]} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((bh, idx) => (
                <Marker 
                    key={idx} 
                    position={[bh.latitude || 0, bh.longitude || 0]} 
                    icon={defaultIcon}
                >
                    <Popup>
                        <strong>{bh.name}</strong><br />
                        Status: {bh.status}<br />
                        Risk: {bh.drought_risk_level}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
