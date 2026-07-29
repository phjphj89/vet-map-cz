import { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { ClinicCard } from "./ClinicCard";

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

export function ClinicList({ clinics }) {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState("all");

  const regionOptions = useMemo(() => buildRegionOptions(clinics), [clinics]);

  const filteredClinics = useMemo(
    () => clinics.filter((clinic) => matchesRegion(clinic, selectedRegion)),
    [clinics, selectedRegion]
  );

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
        <span className="result-count">
          {filteredClinics.length} {t.clinicsFound}
        </span>
      </div>

      {filteredClinics.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} />
      ))}
    </div>
  );
}
