import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.scss";
import Pin from "../pin/Pin";

// Helper component to fit bounds dynamically
function MapBounds({ items }) {
  const map = useMap();

  if (items.length === 1) {
    const [latitude, longitude] = [items[0].latitude, items[0].longitude];
    map.setView([latitude, longitude], 13); // Adjust the zoom level for a single item
  } else if (items.length > 1) {
    const bounds = items.map((item) => [item.latitude, item.longitude]);
    map.fitBounds(bounds, { padding: [120, 120] }); // Add padding for better viewing
  }

  return null;
}


function Map({ items }) {
  const defaultCenter = [31.5204, 74.3587]; // Default center if no items
  const defaultZoom = 5; // Default zoom level

  return (
    <MapContainer
      center={items.length === 1 ? [items[0].latitude, items[0].longitude] : defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item._id} />
      ))}
      {/* Fit the map bounds based on items */}
      <MapBounds items={items} />
    </MapContainer>
  );
}

export default Map;
