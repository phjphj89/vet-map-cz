import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "../i18n/LanguageContext";

// A custom map pin: the classic pin/teardrop shape, outlined with a
// cream border (same color as the rabbit silhouette), with a centered
// rabbit head+ears mark inside - matching the mark used next to the
// site title. Built as raw SVG (a "div icon") rather than an image
// file, so it stays crisp at any zoom level. The fill color varies by
// category (see PIN_COLORS below), so this is a function rather than
// a fixed string. The viewBox has a small margin around the pin shape
// so the border stroke isn't clipped at the edges.
function buildPinSvg(fillColor) {
  return `
    <svg width="36" height="46" viewBox="-2 -2 36 46" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11.5 16 26 16 26s16-14.5 16-26C32 7.163 24.837 0 16 0z"
            fill="${fillColor}" stroke="#FAF7F0" stroke-width="2" stroke-linejoin="round"/>
      <g transform="translate(3 5)">
        <ellipse cx="9" cy="7" rx="3.1" ry="6.8" transform="rotate(-18 9 7)" fill="#FAF7F0"/>
        <ellipse cx="17" cy="7" rx="3.1" ry="6.8" transform="rotate(18 17 7)" fill="#FAF7F0"/>
        <circle cx="13" cy="15.5" r="5.6" fill="#FAF7F0"/>
      </g>
    </svg>
  `;
}

function buildPinIcon(fillColor) {
  return L.divIcon({
    html: buildPinSvg(fillColor),
    className: "rabbit-pin-icon", // replaces Leaflet's default icon styling (no box/border)
    iconSize: [36, 46],
    iconAnchor: [18, 44], // the pin's pointed tip marks the exact location
    popupAnchor: [0, -40],
  });
}

// Three pin colors, one per category. Built once (not on every render).
const PIN_ICONS = {
  standard: buildPinIcon("#3F5A44"),   // green - default
  extended: buildPinIcon("#C97B4A"),   // terracotta - late evening or weekend emergency
  always: buildPinIcon("#A83B32"),     // red - open 24/7
};

// A day closing at or after this hour counts as "late evening".
// Adjustable - this is a judgment call, not a fixed rule.
const LATE_EVENING_CUTOFF_HOUR = 19;

function closesLateOnAnyDay(clinic) {
  if (!clinic.hours_parse_ok || !clinic.hours_by_day) return false;
  return Object.values(clinic.hours_by_day).some((ranges) =>
    ranges.some((range) => {
      const closingTime = range.split("-")[1];
      const closingHour = parseInt(closingTime.split(":")[0], 10);
      return closingHour >= LATE_EVENING_CUTOFF_HOUR;
    })
  );
}

function getPinIcon(clinic) {
  if (clinic.is_24_7) return PIN_ICONS.always;
  if (clinic.has_weekend_emergency || closesLateOnAnyDay(clinic)) return PIN_ICONS.extended;
  return PIN_ICONS.standard;
}

// Roughly the center of the Czech Republic, used as the map's starting view.
const CZECH_REPUBLIC_CENTER = [49.8, 15.5];
const DEFAULT_ZOOM = 7;

export function ClinicMap({ clinics }) {
  const { t } = useLanguage();

  return (
    <MapContainer
      center={CZECH_REPUBLIC_CENTER}
      zoom={DEFAULT_ZOOM}
      className="map-container"
    >
      {/* The actual map imagery, from OpenStreetMap (free, no API key). */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {clinics.map((clinic) => (
        <Marker key={clinic.id} position={[clinic.lat, clinic.lng]} icon={getPinIcon(clinic)}>
          <Popup>
            <strong>{clinic.name}</strong>
            <br />
            {clinic.address}
            <br />
            {clinic.phone || t.notAvailable}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
