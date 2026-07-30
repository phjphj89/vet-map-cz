import { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { ClinicCard } from "./ClinicCard";
import { BloodDonorButton } from "./BloodDonorButton";
import { ViewModeToggle } from "./ViewModeToggle";
import { calculateDistanceKm } from "../utils/distance";
import { isOpenOnWeekends, hasWeekendEmergencyNote } from "../utils/clinicChecks";

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
function matchesSpecialFilters(clinic, show247, showOpenWeekends, showWeekendEmergency, showHospitalization) {
  if (!show247 && !showOpenWeekends && !showWeekendEmergency && !showHospitalization) return true;
  const passes247 = show247 && clinic.is_24_7 === true;
  const passesOpenWeekends = showOpenWeekends && isOpenOnWeekends(clinic);
  const passesWeekendEmergency = showWeekendEmergency && hasWeekendEmergencyNote(clinic);
  const passesHospitalization = showHospitalization && clinic.hospitalization === true;
  return passes247 || passesOpenWeekends || passesWeekendEmergency || passesHospitalization;
}

export function ClinicList({ clinics, viewMode, setViewMode, userLocation }) {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [show247, setShow247] = useState(false);
  const [showOpenWeekends, setShowOpenWeekends] = useState(false);
  const [showWeekendEmergency, setShowWeekendEmergency] = useState(false);
  const [showHospitalization, setShowHospitalization] = useState(false);

  const regionOptions = useMemo(() => buildRegionOptions(clinics), [clinics]);

  const filteredClinics = useMemo(() => {
    const filtered = clinics.filter(
      (clinic) =>
        matchesRegion(clinic, selectedRegion) &&
        matchesSpecialFilters(clinic, show247, showOpenWeekends, showWeekendEmergency, showHospitalization)
    );

    if (!userLocation) return filtered;

    // With a known location, sort nearest-first. Distance is computed
    // here (not stored on the clinic) since it depends on where the
    // visitor currently is, not on the clinic itself.
    return [...filtered].sort((a, b) => {
      const distanceA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distanceB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distanceA - distanceB;
    });
  }, [clinics, selectedRegion, show247, showOpenWeekends, showWeekendEmergency, showHospitalization, userLocation]);

  return (
    <div className="clinic-list">
      <div className="filter-row">
        <label htmlFor="region-filter">{t.filterByRegion}</label>
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
        </div>
        <span className="result-count">
          {filteredClinics.length} {t.clinicsFound}
        </span>
        <div className="filter-row-actions">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          <BloodDonorButton />
        </div>
      </div>

      {filteredClinics.map((clinic) => (
        <ClinicCard
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
  );
}
