import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "../i18n/LanguageContext";

// A custom map pin: a compact circular badge with a short pointed
// tail (matching the reference design), outlined with a cream border
// (same color as the rabbit silhouette), with a centered rabbit
// head+ears mark inside - matching the mark used next to the site
// title. Built as raw SVG (a "div icon") rather than an image file,
// so it stays crisp at any zoom level. The fill color varies by
// category (see PIN_COLORS below), so this is a function rather than
// a fixed string.
//
// Shape technique: the tail is a triangle whose two base corners sit
// INSIDE the circle (not on its edge), so the circle's opaque fill
// completely covers the hidden part of the triangle when drawn on
// top - only the protruding tip shows, giving a clean, seamless
// balloon-with-tail silhouette without any visible seam.
function buildPinSvg(fillColor) {
  return `
    <svg width="36" height="40" viewBox="-2 -2 36 40" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11,26 21,26 16,36" fill="${fillColor}" stroke="#F7FAF8" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="16" cy="15" r="14" fill="${fillColor}" stroke="#F7FAF8" stroke-width="2"/>
      <g transform="translate(3 5)">
        <ellipse cx="9" cy="7" rx="3.1" ry="6.8" transform="rotate(-18 9 7)" fill="#F7FAF8"/>
        <ellipse cx="17" cy="7" rx="3.1" ry="6.8" transform="rotate(18 17 7)" fill="#F7FAF8"/>
        <circle cx="13" cy="15.5" r="5.6" fill="#F7FAF8"/>
      </g>
    </svg>
  `;
}

function buildPinIcon(fillColor) {
  return L.divIcon({
    html: buildPinSvg(fillColor),
    className: "rabbit-pin-icon", // replaces Leaflet's default icon styling (no box/border)
    iconSize: [36, 40],
    iconAnchor: [18, 38], // the pin's pointed tip marks the exact location
    popupAnchor: [0, -34],
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

// Scrolls the matching clinic card into view when its map pin is
// clicked. If the card isn't currently on the page (e.g. hidden by
// the kraj filter), this simply does nothing.
function scrollToClinicCard(clinicId) {
  const cardElement = document.getElementById(`clinic-${clinicId}`);
  if (cardElement) {
    cardElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Roughly the center of the Czech Republic, used as the map's starting view.
const CZECH_REPUBLIC_CENTER = [49.8, 15.5];
const DEFAULT_ZOOM = 7;

export function ClinicMap({ clinics, onMarkerClick }) {
  const { t } = useLanguage();

  // In list view, clicking a pin scrolls to that clinic's card.
  // In map-only view, App.jsx passes a different handler that opens
  // the full clinic card as an overlay panel instead.
  const handleMarkerClick = onMarkerClick || ((clinic) => scrollToClinicCard(clinic.id));

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
        <Marker
          key={clinic.id}
          position={[clinic.lat, clinic.lng]}
          icon={getPinIcon(clinic)}
          eventHandlers={{ click: () => handleMarkerClick(clinic) }}
        >
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
