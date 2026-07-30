import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WEEKDAY_ORDER } from "../i18n/translations";
import { hasWeekendEmergencyNote } from "../utils/clinicChecks";

// A custom map pin: a compact circular badge with a short pointed
// tail (matching the reference design), outlined with a cream border
// (same color as the rabbit silhouette), with a centered rabbit
// head+ears mark inside - matching the mark used next to the site
// title. Built as raw SVG (a "div icon") rather than an image file,
// so it stays crisp at any zoom level. The fill color varies by
// category (see PIN_COLORS below), so this is a function rather than
// a fixed string.
//
// The whole balloon-with-tail shape is ONE continuous curve (not a
// circle plus a separate triangle) - this avoids any risk of a
// visible seam where two separate shapes would otherwise overlap.
function buildPinSvg(fillColor) {
  return `
    <svg width="36" height="40" viewBox="-2 -2 36 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16,2 C23.7,2 30,8.3 30,16 C30,23 24,29 16,36 C8,29 2,23 2,16 C2,8.3 8.3,2 16,2 Z"
            fill="${fillColor}" stroke="#F7FAF8" stroke-width="2" stroke-linejoin="round"/>
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
  if (clinic.hours_needs_review || !clinic.weekly_hours) return false;
  const regularDays = WEEKDAY_ORDER.map((day) => clinic.weekly_hours[day]).filter(Boolean);
  return regularDays.some((entry) => {
    if (entry.closed) return false;
    const closingTimes = [entry.end1, entry.end2].filter(Boolean);
    return closingTimes.some((time) => parseInt(time.split(":")[0], 10) >= LATE_EVENING_CUTOFF_HOUR);
  });
}

function getPinIcon(clinic) {
  if (clinic.is_24_7) return PIN_ICONS.always;
  if (hasWeekendEmergencyNote(clinic) || closesLateOnAnyDay(clinic)) return PIN_ICONS.extended;
  return PIN_ICONS.standard;
}

// Scrolls the matching clinic card into view when its map pin is
// clicked. If the card isn't currently on the page (e.g. hidden by
// the kraj filter), this simply does nothing.
//
// The header is fixed and the filter row is sticky, both sitting on
// top of the scrolled content - a plain scrollIntoView() would align
// the card's top edge with the very top of the viewport, hiding it
// behind them. Instead, this measures their ACTUAL rendered height
// (not a guessed pixel value) and scrolls just past both. On mobile,
// where header/filter-row scroll away normally (not fixed/sticky),
// their computed position is "static", so no extra offset is added.
function scrollToClinicCard(clinicId) {
  const cardElement = document.getElementById(`clinic-${clinicId}`);
  if (!cardElement) return;

  const header = document.querySelector(".app-header");
  const filterRow = document.querySelector(".filter-row");

  let offset = 16; // small breathing margin
  if (header && getComputedStyle(header).position === "fixed") {
    offset += header.offsetHeight;
  }
  if (filterRow && getComputedStyle(filterRow).position === "sticky") {
    offset += filterRow.offsetHeight;
  }

  const cardTop = cardElement.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: cardTop - offset, behavior: "smooth" });
}

// Roughly the center of the Czech Republic, used as the map's starting view.
const CZECH_REPUBLIC_CENTER = [49.8, 15.5];
const DEFAULT_ZOOM = 7;

export function ClinicMap({ clinics, onMarkerClick }) {

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
        />
      ))}
    </MapContainer>
  );
}
