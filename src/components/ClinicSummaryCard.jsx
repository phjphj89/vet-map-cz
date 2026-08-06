import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { Badge } from "./Badge";
import { StarIcon } from "./StarIcon";
import { LiveStatus } from "./LiveStatus";
import { ClockIcon, CalendarIcon, MoonIcon, WeekendEmergencyIcon, PhoneAlertIcon, PhoneIcon, BedIcon } from "./StatusIcons";

// Picks the single most relevant badge for the DESKTOP summary card -
// the mobile layout below shows all applicable badges stacked, but
// desktop keeps just one, to stay scannable in its single-line row.
function getPriorityBadge(clinic, t) {
  if (clinic.is_24_7 === true) return { text: t.badge247, variant: "emergency", icon: ClockIcon };
  if (clinic.open_weekends_bookable === true && clinic.has_weekend_emergency === true) {
    return { text: t.badgeOpenWeekendsAndEmergency, variant: "emergency", icon: WeekendEmergencyIcon };
  }
  if (clinic.open_weekends_bookable === true) return { text: t.badgeOpenWeekends, variant: "weekend", icon: CalendarIcon };
  if (clinic.has_weekend_emergency === true) return { text: t.badgeWeekendEmergencyOnly, variant: "weekend-emergency", icon: WeekendEmergencyIcon };
  if (clinic.after_hours_emergency === true) return { text: t.badgeAfterHoursEmergency, variant: "weekend-emergency", icon: MoonIcon };
  if (clinic.emergency_on_phone === true) return { text: t.badgeEmergencyOnPhone, variant: "weekend-emergency", icon: PhoneAlertIcon };
  if (clinic.hospitalization === true) return { text: t.filterHospitalization, variant: "hospitalization", icon: BedIcon };
  return null;
}

// All applicable badges, independent (not just one priority pick) -
// used for the mobile stack and reused on the detail page.
function AllBadges({ clinic, t }) {
  return (
    <>
      {clinic.is_24_7 === true && <Badge text={t.badge247} variant="emergency" icon={ClockIcon} />}
      {clinic.open_weekends_bookable === true && <Badge text={t.badgeOpenWeekends} variant="weekend" icon={CalendarIcon} />}
      {clinic.has_weekend_emergency === true && <Badge text={t.badgeWeekendEmergencyOnly} variant="weekend-emergency" icon={WeekendEmergencyIcon} />}
      {clinic.after_hours_emergency === true && <Badge text={t.badgeAfterHoursEmergency} variant="weekend-emergency" icon={MoonIcon} />}
      {clinic.emergency_on_phone === true && <Badge text={t.badgeEmergencyOnPhone} variant="weekend-emergency" icon={PhoneAlertIcon} />}
      {clinic.hospitalization === true && <Badge text={t.filterHospitalization} variant="hospitalization" icon={BedIcon} />}
    </>
  );
}

// Shared rating/review-count/distance values, rendered twice below
// (once for the desktop corner layout, once for the mobile column) -
// CSS shows only one at a time per screen size.
function RatingBlock({ clinic, distanceKm }) {
  const { t } = useLanguage();
  return (
    <>
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
    </>
  );
}

export function ClinicSummaryCard({ clinic, distanceKm }) {
  const { t } = useLanguage();
  const priorityBadge = getPriorityBadge(clinic, t);

  return (
    <div className="clinic-summary-card">
      <div className="summary-card-header">
        <div>
          <h3>
            <Link to={`/clinic/${clinic.id}`} className="clinic-name-link">{clinic.name}</Link>
          </h3>
          <p className="clinic-address">{clinic.address}</p>
        </div>
        <div className="summary-card-header-right">
          <RatingBlock clinic={clinic} distanceKm={distanceKm} />
        </div>
      </div>

      {/* Desktop: single-line row with just the top-priority badge */}
      <div className="summary-badge-row-desktop">
        <LiveStatus clinic={clinic} />
        {priorityBadge && (
          <Badge text={priorityBadge.text} variant={priorityBadge.variant} icon={priorityBadge.icon} />
        )}
      </div>

      {/* Mobile only: badges stacked on the left, rating/reviews/distance stacked on the right, side by side */}
      <div className="summary-mobile-info-row">
        <div className="summary-mobile-badges-stack">
          <LiveStatus clinic={clinic} />
          <AllBadges clinic={clinic} t={t} />
        </div>
        <div className="summary-mobile-rating-stack">
          <RatingBlock clinic={clinic} distanceKm={distanceKm} />
        </div>
      </div>

      {clinic.recommended_vet && (
        <p className="summary-recommended">
          <span className="summary-recommended-label">{t.recommendedLabel}:</span>{" "}
          <span className="summary-recommended-name">{clinic.recommended_vet}</span>
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
