import { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { ClinicSummaryCard } from "./ClinicSummaryCard";
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

// Builds a comparator for the chosen sort option. "rating" and
// "reviewCount" sort highest-first, with clinics that don't have a
// value yet pushed to the end rather than jumbled in with real values.
function buildComparator(sortBy, userLocation) {
  if (sortBy === "distance" && userLocation) {
    return (a, b) => {
      const distanceA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distanceB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distanceA - distanceB;
    };
  }
  if (sortBy === "rating") {
    return (a, b) => (b.google_rating ?? -Infinity) - (a.google_rating ?? -Infinity);
  }
  if (sortBy === "reviewCount") {
    return (a, b) => (b.google_review_count ?? -Infinity) - (a.google_review_count ?? -Infinity);
  }
  return null; // "none" - keep original order
}

export function ClinicList({ clinics, viewMode, setViewMode, userLocation }) {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [show247, setShow247] = useState(false);
  const [showOpenWeekends, setShowOpenWeekends] = useState(false);
  const [showWeekendEmergency, setShowWeekendEmergency] = useState(false);
  const [showHospitalization, setShowHospitalization] = useState(false);
  const [sortBy, setSortBy] = useState("distance");

  const regionOptions = useMemo(() => buildRegionOptions(clinics), [clinics]);

  const filteredClinics = useMemo(() => {
    const filtered = clinics.filter(
      (clinic) =>
        matchesRegion(clinic, selectedRegion) &&
        matchesSpecialFilters(clinic, show247, showOpenWeekends, showWeekendEmergency, showHospitalization)
    );

    const comparator = buildComparator(sortBy, userLocation);
    return comparator ? [...filtered].sort(comparator) : filtered;
  }, [clinics, selectedRegion, show247, showOpenWeekends, showWeekendEmergency, showHospitalization, sortBy, userLocation]);

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
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="none">{t.sortNone}</option>
          <option value="distance">{t.sortDistance}</option>
          <option value="rating">{t.sortRating}</option>
          <option value="reviewCount">{t.sortReviewCount}</option>
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
  );
}
