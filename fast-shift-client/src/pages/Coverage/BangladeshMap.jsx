import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ZoomToDistrict = ({ district }) => {
  const map = useMap();

  useEffect(() => {
    if (district) {
      map.flyTo([district.latitude, district.longitude], 10, {
        duration: 1.5,
      });
    }
  }, [district, map]);

  return null;
};

const BangladeshMap = ({ districts, selectedDistrict }) => {
  const markerRefs = useRef({});

  useEffect(() => {
    if (selectedDistrict && markerRefs.current[selectedDistrict.district]) {
      markerRefs.current[selectedDistrict.district].openPopup();
    }
  }, [selectedDistrict]);

  return (
    <MapContainer
      center={[23.685, 90.3563]}
      zoom={7}
      scrollWheelZoom={true}
      className="w-full h-[500px] rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {districts.map((d, i) => (
        <Marker
          key={i}
          position={[d.latitude, d.longitude]}
          ref={(ref) => (markerRefs.current[d.district] = ref)}
        >
          <Popup>
            <h3 className="font-semibold">{d.district}</h3>
            <p className="text-sm">Region: {d.region}</p>
            <p className="text-sm">City: {d.city}</p>
            <p className="text-sm mt-2">Covered Areas:</p>
            <ul className="text-xs list-disc pl-4">
              {d.covered_area.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          </Popup>
        </Marker>
      ))}

      <ZoomToDistrict district={selectedDistrict} />
    </MapContainer>
  );
};

export default BangladeshMap;
