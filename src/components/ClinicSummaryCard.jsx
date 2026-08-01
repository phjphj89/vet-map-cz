import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Badge } from "./Badge";
import { StarIcon } from "./StarIcon";
import { LiveStatus } from "./LiveStatus";
import { ClockIcon, CalendarIcon, EmergencyLightIcon, PhoneIcon } from "./StatusIcons";
import { isOpenOnWeekends, hasWeekendEmergencyNote } from "../utils/clinicChecks";

// Picks the single most relevant badge for the summary card - the full
// card (detail page) can show everything, but the list view is
// intentionally limited to one, so cards stay scannable.
function getPriorityBadge(clinic, t) {
  if (clinic.is_24_7 === true) return { text: t.badge247, variant: "emergency", icon: ClockIcon };
  if (isOpenOnWeekends(clinic) && hasWeekendEmergencyNote(clinic)) {
    return { text: t.badgeOpenWeekendsAndEmergency, variant: "emergency", icon: EmergencyLightIcon };
  }
  if (isOpenOnWeekends(clinic)) return { text: t.badgeOpenWeekends, variant: "weekend", icon: CalendarIcon };
  if (hasWeekendEmergencyNote(clinic)) return { text: t.badgeWeekendEmergencyOnly, variant: "weekend-emergency", icon: EmergencyLightIcon };
  if (clinic.hospitalization === true) return { text: t.filterHospitalization, variant: "hospitalization" };
  return null;
}

export function ClinicSummaryCard({ clinic, distanceKm }) {
  const { t } = useLanguage();
  const priorityBadge = getPriorityBadge(clinic, t);

  return (
    <div className="clinic-summary-card">
      <div className="summary-card-header">
        <div>
          <h3>{clinic.name}</h3>
          <p className="clinic-address">{clinic.address}</p>
        </div>
        <div className="summary-card-header-right">
          {clinic.google_rating != null && (
            <div className="clinic-rating">
              <span className="clinic-rating-star"><StarIcon /></span>
              {Number(clinic.google_rating).toFixed(1)}
            </div>
          )}
          {clinic.google_review_count != null && (
            <div className="clinic-rating-count">{clinic.google_review_count} {t.reviewsLabel}</div>
          )}
          {distanceKm != null && (
            <div className="clinic-distance">
              {Number(distanceKm) < 20 ? Number(distanceKm).toFixed(1) : Math.round(Number(distanceKm))} km
            </div>
          )}
        </div>
      </div>

      <div className="summary-badge-row">
        <LiveStatus clinic={clinic} />
        {priorityBadge && (
          <Badge text={priorityBadge.text} variant={priorityBadge.variant} icon={priorityBadge.icon} />
        )}
      </div>

      {clinic.recommended_vet && (
        <p className="summary-recommended">
          {t.recommendedLabel}: {clinic.recommended_vet}
        </p>
      )}

      <div className="summary-card-actions">
        {clinic.phone && (
          <a href={`tel:${clinic.phone}`} className="summary-call-button">
            <PhoneIcon /> {t.callButton}
          </a>
        )}
        <Link to={`/clinic/${clinic.id}`} className="summary-details-button">
          {t.detailsButton}
        </Link>
      </div>
    </div>
  );
}
