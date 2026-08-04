import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WEEKDAY_ORDER } from "../i18n/translations";
import { hasWeekendEmergencyNote } from "../utils/clinicChecks";

// A custom map pin: an outline-only teardrop shape (classic map-marker
// silhouette) with a rabbit head+ears mark inside, colored to match
// the pin's outline (not white, since the pin is hollow/transparent
// now rather than solid-filled) - matching the mark used next to the
// site title. Built as raw SVG (a "div icon") rather than an image
// file, so it stays crisp at any zoom level. The fill/stroke color
// varies by category (see PIN_ICONS below), so this is a function
// rather than a fixed string.
function buildPinSvg(color) {
  return `
    <svg width="32" height="30" viewBox="-1 -1 18 17" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C4.138 0 1 3.114 1 6.964a6.927 6.927 0 002.085 4.957l4.42 3.892a.75.75 0 00.99 0l4.42-3.892A6.927 6.927 0 0015 6.964C15 3.114 11.862 0 8 0z"
            fill="none" stroke="${color}" stroke-width="1.1" stroke-linejoin="round"/>
      <g transform="translate(2.8 3.0) scale(0.4)">
        <ellipse cx="9" cy="7" rx="3.1" ry="6.8" transform="rotate(-18 9 7)" fill="${color}"/>
        <ellipse cx="17" cy="7" rx="3.1" ry="6.8" transform="rotate(18 17 7)" fill="${color}"/>
        <circle cx="13" cy="15.5" r="5.6" fill="${color}"/>
      </g>
    </svg>
  `;
}

function buildPinIcon(fillColor) {
  return L.divIcon({
    html: buildPinSvg(fillColor),
    className: "rabbit-pin-icon", // replaces Leaflet's default icon styling (no box/border)
    iconSize: [32, 30],
    iconAnchor: [16, 28], // the pin's pointed tip marks the exact location
    popupAnchor: [0, -26],
  });
}

// Three pin colors, one per category. Built once (not on every render).
const PIN_ICONS = {
  standard: buildPinIcon("#006662"),   // green - default
  extended: buildPinIcon("#C97B4A"),   // terracotta - late evening or weekend emergency
  always: buildPinIcon("#A83B32"),     // red - open 24/7
};

// A day closing after this time (in minutes since midnight) counts as
// "late evening". Exactly 19:00 stays green/standard - only closing
// times strictly later than that trigger the terracotta pin.
// Adjustable - this is a judgment call, not a fixed rule.
const LATE_EVENING_CUTOFF_MINUTES = 19 * 60; // 19:00

function closesLateOnAnyDay(clinic) {
  if (clinic.hours_needs_review || !clinic.weekly_hours) return false;
  const regularDays = WEEKDAY_ORDER.map((day) => clinic.weekly_hours[day]).filter(Boolean);
  return regularDays.some((entry) => {
    if (entry.closed) return false;
    const closingTimes = [entry.end1, entry.end2].filter(Boolean);
    return closingTimes.some((time) => {
      const [hour, minute] = time.split(":").map((n) => parseInt(n, 10) || 0);
      return hour * 60 + minute > LATE_EVENING_CUTOFF_MINUTES;
    });
  });
}

function getPinIcon(clinic) {
  if (clinic.is_24_7) return PIN_ICONS.always;
  if (hasWeekendEmergencyNote(clinic) || closesLateOnAnyDay(clinic)) return PIN_ICONS.extended;
  return PIN_ICONS.standard;
}

// Roughly the center of the Czech Republic, used as the map's starting view.
const CZECH_REPUBLIC_CENTER = [49.8, 15.5];
const DEFAULT_ZOOM = 7;

export function ClinicMap({ clinics, onMarkerClick }) {
  return (
    <MapContainer
      center={CZECH_REPUBLIC_CENTER}
      zoom={DEFAULT_ZOOM}
      className="map-container"
      attributionControl={false}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />

      {/* The actual map imagery, from OpenStreetMap (free, no API key).
          Attribution is shown in the hamburger menu instead of Leaflet's
          default on-map control, which was getting hidden behind the
          menu dropdown anyway. */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {clinics.map((clinic) => (
        <Marker
          key={clinic.id}
          position={[clinic.lat, clinic.lng]}
          icon={getPinIcon(clinic)}
          eventHandlers={{ click: () => onMarkerClick(clinic) }}
        />
      ))}
    </MapContainer>
  );
}
