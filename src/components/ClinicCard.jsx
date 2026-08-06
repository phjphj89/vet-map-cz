import { useLanguage } from "../i18n/LanguageContext";
import { Badge } from "./Badge";
import { OpeningHoursTable } from "./OpeningHoursTable";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";
import { StarIcon } from "./StarIcon";
import { LiveStatus } from "./LiveStatus";
import { ClockIcon, CalendarIcon, MoonIcon, WeekendEmergencyIcon, PhoneAlertIcon, PhoneIcon, MapPinIcon, GlobeIcon, BedIcon } from "./StatusIcons";

function AllBadges({ clinic, t }) {
  return (
    <>
      {clinic.top_pick && <Badge text={t.badgeTopPick} variant="top-pick" />}
      {clinic.is_24_7 === true && <Badge text={t.badge247} variant="emergency" icon={ClockIcon} />}
      {clinic.open_weekends_bookable === true && <Badge text={t.badgeOpenWeekends} variant="weekend" icon={CalendarIcon} />}
      {clinic.has_weekend_emergency === true && <Badge text={t.badgeWeekendEmergencyOnly} variant="weekend-emergency" icon={WeekendEmergencyIcon} />}
      {clinic.after_hours_emergency === true && <Badge text={t.badgeAfterHoursEmergency} variant="weekend-emergency" icon={MoonIcon} />}
      {clinic.emergency_on_phone === true && <Badge text={t.badgeEmergencyOnPhone} variant="weekend-emergency" icon={PhoneAlertIcon} />}
      {clinic.hospitalization === true && <Badge text={t.filterHospitalization} variant="hospitalization" icon={BedIcon} />}
    </>
  );
}

export function ClinicCard({ clinic, distanceKm }) {
  const { language, t } = useLanguage();

  // Pick the field for the current language, e.g. notes_cs vs notes_en.
  const notes = clinic[`notes_${language}`];
  const emergency = clinic[`emergency_${language}`];

  // The data keeps recommended_vet as one plain-text field (e.g.
  // "MVDr. Jekl, MVDr. Hauptman") rather than a structured list -
  // splitting it here at display time gives us the boxed-per-vet look
  // without needing to change how the data itself is edited/stored.
  const recommendedVetNames = clinic.recommended_vet
    ? clinic.recommended_vet.split(",").map((name) => name.trim()).filter(Boolean)
    : [];

  const phoneForCall = clinic.call_phone || clinic.phone;

  return (
    <div className="clinic-card">
      <div className="detail-header">
        <div className="detail-header-left">
          <h3>{clinic.name}</h3>
          <p className="clinic-address">{clinic.address}</p>
        </div>
        <div className="detail-header-right">
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

      <div className="detail-badge-row">
        <AllBadges clinic={clinic} t={t} />
        <LiveStatus clinic={clinic} />
      </div>

      {/* Mobile only: badges stacked on the left (all that apply),
          rating/reviews/distance stacked on the right, side by side
          under the address. */}
      <div className="summary-mobile-info-row">
        <div className="summary-mobile-badges-stack">
          <LiveStatus clinic={clinic} />
          <AllBadges clinic={clinic} t={t} />
        </div>
        <div className="summary-mobile-rating-stack">
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

      <p className="detail-english-communication">
        {t.englishCommunication}: {clinic.english_communication ? t.yesLabel : t.noLabel}
      </p>

      <div className="clinic-action-buttons">
        {phoneForCall && (
          <a href={`tel:${phoneForCall}`} className="action-button action-button-primary">
            <PhoneIcon /> {phoneForCall}
          </a>
        )}
        {clinic.google_maps_url && (
          <a href={clinic.google_maps_url} target="_blank" rel="noopener noreferrer" className="action-button">
            <MapPinIcon /> {t.openInMaps}
          </a>
        )}
        {clinic.website && (
          <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="action-button">
            <GlobeIcon /> {t.website}
          </a>
        )}
      </div>

      <h4 className="detail-section-heading">{t.hours}</h4>
      <OpeningHoursTable clinic={clinic} />
      {(emergency || notes) && (
        <div className="detail-hours-note">
          {emergency && <p>{emergency}</p>}
          {notes && <p>{notes}</p>}
        </div>
      )}

      {recommendedVetNames.length > 0 && (
        <>
          <h4 className="detail-section-heading">{t.recommendedVetsHeading}</h4>
          <div className="recommended-vets-grid">
            {recommendedVetNames.map((name) => (
              <div key={name} className="recommended-vet-box">
                {name}
              </div>
            ))}
          </div>
        </>
      )}

      {(clinic.facebook_url || clinic.instagram_url) && (
        <div className="social-links">
          {clinic.facebook_url && (
            <a href={clinic.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
          )}
          {clinic.instagram_url && (
            <a href={clinic.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
