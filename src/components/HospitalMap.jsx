import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for selected vs unselected
const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically update map bounds
function MapUpdater({ hospitals, selectedHospitalId, centerLat, centerLon }) {
  const map = useMap();

  useEffect(() => {
    if (selectedHospitalId) {
      const selected = hospitals.find(h => h.id === selectedHospitalId);
      if (selected && Number.isFinite(selected.latitude) && Number.isFinite(selected.longitude)) {
        map.flyTo([selected.latitude, selected.longitude], 15, { duration: 1.5 });
        return;
      }
    }

    if (hospitals && hospitals.length > 0) {
      const validHospitals = hospitals.filter(h => Number.isFinite(h.latitude) && Number.isFinite(h.longitude));
      if (validHospitals.length > 0) {
        const bounds = L.latLngBounds(validHospitals.map(h => [h.latitude, h.longitude]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else if (Number.isFinite(centerLat) && Number.isFinite(centerLon)) {
      map.flyTo([centerLat, centerLon], 13);
    }
  }, [hospitals, selectedHospitalId, map, centerLat, centerLon]);

  return null;
}

export default function HospitalMap({ hospitals, selectedHospitalId, onMarkerClick, centerLat, centerLon }) {
  const defaultCenter = [
    Number.isFinite(centerLat) ? centerLat : 20.5937, 
    Number.isFinite(centerLon) ? centerLon : 78.9629
  ];

  if (hospitals && hospitals.length > 0) {
    console.log("First hospital object:", hospitals[0]);
  }

  const isSearchEmpty = Array.isArray(hospitals) && hospitals.length === 0;

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-3xl overflow-hidden shadow-md bg-slate-100 z-0">
      {isSearchEmpty && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-sm z-20">
          <p className="text-slate-600 font-bold text-lg">No hospitals found</p>
        </div>
      )}
      <MapContainer 
        center={defaultCenter} 
        zoom={centerLat ? 13 : 5} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          hospitals={hospitals} 
          selectedHospitalId={selectedHospitalId} 
          centerLat={centerLat} 
          centerLon={centerLon} 
        />

        {hospitals && hospitals.map((hospital) => {
          if (!Number.isFinite(hospital.latitude) || !Number.isFinite(hospital.longitude)) {
            return null;
          }
          return (
          <Marker 
            key={hospital.id} 
            position={[hospital.latitude, hospital.longitude]}
            icon={selectedHospitalId === hospital.id ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(hospital.id)
            }}
          >
            <Popup>
              <div className="text-center">
                <h4 className="font-bold text-sm mb-1">{hospital.name}</h4>
                <p className="text-xs text-slate-500 mb-2">{hospital.distance} km away</p>
                <a 
                  href={hospital.osmLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs font-semibold hover:underline"
                >
                  View on OpenStreetMap
                </a>
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
