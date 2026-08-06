import { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { ClinicSummaryCard } from "./ClinicSummaryCard";
import { BloodDonorButton } from "./BloodDonorButton";
import { calculateDistanceKm } from "../utils/distance";
import { getLiveStatus } from "../utils/liveStatus";

const DISTANCE_OPTIONS = ["any", 5, 10, 25, 50];

// Builds the filter dropdown options: Prague, Brno, Ostrava first
// (since they're cities, not kraje), then the remaining kraje
// alphabetically. "Hlavní město Praha" (Prague's own kraj value)
// is folded into the "Praha" option rather than listed twice.
function buildRegionOptions(clinics) {
  const kraje = new Set();
  for (const clinic of clinics) {
    if (clinic.kraj && clinic.kraj !== "Hlavní město Praha") {
      kraje.add(clinic.kraj);
    }
  }
  return ["all", "praha", "brno", "ostrava", ...[...kraje].sort()];
}

// Decides whether a single clinic belongs to the currently selected
// filter option.
function matchesRegion(clinic, region) {
  if (region === "all") return true;
  if (region === "praha") return clinic.is_prague;
  if (region === "brno") return clinic.is_brno;
  if (region === "ostrava") return clinic.is_ostrava;
  // Otherwise it's a specific kraj name. Exclude Brno/Ostrava clinics
  // from their parent kraj so they don't show up under two filters.
  return clinic.kraj === region && !clinic.is_brno && !clinic.is_ostrava;
}

// If none of the special filters are checked, every clinic passes
// (no restriction). Otherwise a clinic passes if it matches AT LEAST
// ONE checked filter (broadens results, standard checkbox behavior).
function matchesSpecialFilters(clinic, show247, showOpenWeekends, showWeekendEmergency, showHospitalization, showOpenNow) {
  if (!show247 && !showOpenWeekends && !showWeekendEmergency && !showHospitalization && !showOpenNow) return true;
  const passes247 = show247 && clinic.is_24_7 === true;
  const passesOpenWeekends = showOpenWeekends && clinic.open_weekends_bookable === true;
  const passesWeekendEmergency = showWeekendEmergency && clinic.has_weekend_emergency === true;
  const passesHospitalization = showHospitalization && clinic.hospitalization === true;
  const passesOpenNow = showOpenNow && getLiveStatus(clinic) === "open";
  return passes247 || passesOpenWeekends || passesWeekendEmergency || passesHospitalization || passesOpenNow;
}

export function ClinicList({ clinics, userLocation }) {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedDistance, setSelectedDistance] = useState("any");
  const [show247, setShow247] = useState(false);
  const [showOpenWeekends, setShowOpenWeekends] = useState(false);
  const [showWeekendEmergency, setShowWeekendEmergency] = useState(false);
  const [showHospitalization, setShowHospitalization] = useState(false);
  const [showOpenNow, setShowOpenNow] = useState(false);

  const regionOptions = useMemo(() => buildRegionOptions(clinics), [clinics]);

  const filteredClinics = useMemo(() => {
    const filtered = clinics.filter((clinic) => {
      if (!matchesRegion(clinic, selectedRegion)) return false;
      if (!matchesSpecialFilters(clinic, show247, showOpenWeekends, showWeekendEmergency, showHospitalization, showOpenNow)) return false;
      if (selectedDistance !== "any" && userLocation) {
        const distance = calculateDistanceKm(userLocation.lat, userLocation.lng, clinic.lat, clinic.lng);
        if (distance > selectedDistance) return false;
      }
      return true;
    });

    // Nearest-first by default whenever a location is available.
    if (!userLocation) return filtered;
    return [...filtered].sort((a, b) => {
      const distanceA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distanceB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distanceA - distanceB;
    });
  }, [clinics, selectedRegion, selectedDistance, show247, showOpenWeekends, showWeekendEmergency, showHospitalization, showOpenNow, userLocation]);

  return (
    <div className="clinic-list">
      <div className="filter-row">
        <label htmlFor="region-filter" className="distance-filters-label">{t.filterByRegion}</label>
        <select
          id="region-filter"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regionOptions.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? t.allRegions : option === "praha" ? "Praha" : option === "brno" ? "Brno" : option === "ostrava" ? "Ostrava" : option}
            </option>
          ))}
        </select>

        <div className="distance-filters">
          <span className="distance-filters-label">{t.distanceLabel}</span>
          {DISTANCE_OPTIONS.map((option) => (
            <button
              key={option}
              className={`distance-filter-button ${selectedDistance === option ? "active" : ""}`}
              onClick={() => setSelectedDistance(option)}
            >
              {option === "any" ? t.distanceAny : `${option} km`}
            </button>
          ))}
        </div>

        <div className="special-filters">
          <button
            className={`special-filter-button filter-247 ${show247 ? "active" : ""}`}
            onClick={() => setShow247(!show247)}
          >
            {t.badge247}
          </button>
          <button
            className={`special-filter-button filter-weekend ${showOpenWeekends ? "active" : ""}`}
            onClick={() => setShowOpenWeekends(!showOpenWeekends)}
          >
            {t.badgeOpenWeekends}
          </button>
          <button
            className={`special-filter-button filter-weekend-emergency ${showWeekendEmergency ? "active" : ""}`}
            onClick={() => setShowWeekendEmergency(!showWeekendEmergency)}
          >
            {t.badgeWeekendEmergencyOnly}
          </button>
          <button
            className={`special-filter-button filter-hospitalization ${showHospitalization ? "active" : ""}`}
            onClick={() => setShowHospitalization(!showHospitalization)}
          >
            {t.filterHospitalization}
          </button>
          <button
            className={`special-filter-button filter-open-now ${showOpenNow ? "active" : ""}`}
            onClick={() => setShowOpenNow(!showOpenNow)}
          >
            {t.openNowFilter}
          </button>
        </div>
        <span className="result-count">
          {filteredClinics.length} {t.clinicsFound}
        </span>
        <div className="filter-row-actions">
          <BloodDonorButton />
        </div>
      </div>

      <div className="clinic-cards-grid">
        {filteredClinics.map((clinic) => (
          <ClinicSummaryCard
            key={clinic.id}
            clinic={clinic}
            distanceKm={
              userLocation
                ? calculateDistanceKm(userLocation.lat, userLocation.lng, clinic.lat, clinic.lng)
                : null
            }
          />
        ))}
      </div>
    </div>
  );
}
