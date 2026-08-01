import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { ClinicCard } from "./ClinicCard";
import { calculateDistanceKm } from "../utils/distance";
import { TEMPORARY_FIXED_LOCATION } from "../utils/tempLocation";
import clinicsData from "../data/clinics.json";

export function ClinicDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const clinic = clinicsData.find((c) => String(c.id) === id);

  const distanceKm = clinic
    ? calculateDistanceKm(
        TEMPORARY_FIXED_LOCATION.lat,
        TEMPORARY_FIXED_LOCATION.lng,
        clinic.lat,
        clinic.lng
      )
    : null;

  return (
    <div className="clinic-detail-page">
      <Link to="/" className="back-link">← {t.allClinicsLabel}</Link>
      {clinic ? (
        <ClinicCard clinic={clinic} distanceKm={distanceKm} />
      ) : (
        <p className="friends-empty-state">{t.notAvailable}</p>
      )}
    </div>
  );
}
