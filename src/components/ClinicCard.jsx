import { useLanguage } from "../i18n/LanguageContext";
import { Badge } from "./Badge";
import { OpeningHoursTable } from "./OpeningHoursTable";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";
import { StarIcon } from "./StarIcon";

export function ClinicCard({ clinic, distanceKm }) {
  const { language, t } = useLanguage();

  // Pick the field for the current language, e.g. notes_cs vs notes_en.
  const notes = clinic[`notes_${language}`];
  const emergency = clinic[`emergency_${language}`];

  return (
    <div className="clinic-card" id={`clinic-${clinic.id}`}>
      <div className="clinic-card-header">
        <h3>{clinic.name}</h3>
        <div className="clinic-header-right">
          <div className="badge-row">
            {clinic.top_pick && <Badge text={t.badgeTopPick} variant="top-pick" />}
            {clinic.is_24_7 === true && <Badge text={t.badge247} variant="emergency" />}
            {clinic.is_24_7 !== true && clinic.has_weekend_emergency === true && (
              <Badge text={t.badgeWeekendEmergency} variant="weekend" />
            )}
          </div>
          {clinic.google_rating != null && (
            <div className="clinic-rating">
              <span className="clinic-rating-star"><StarIcon /></span>
              {clinic.google_rating.toFixed(1)}
              {clinic.google_review_count != null && (
                <span className="clinic-rating-count">({clinic.google_review_count})</span>
              )}
            </div>
          )}
          {distanceKm != null && (
            <div className="clinic-distance">{distanceKm.toFixed(1)} km</div>
          )}
        </div>
      </div>

      <p className="clinic-address">{clinic.address}</p>

      <div className="clinic-card-body">
        <div className="clinic-left-column">
          <dl className="clinic-facts">
            <dt>{t.phone}</dt>
            <dd className="clinic-phone">{clinic.phone || t.notAvailable}</dd>

            <dt>{t.website}</dt>
            <dd>
              {clinic.website ? (
                <a href={clinic.website} target="_blank" rel="noopener noreferrer">
                  {clinic.website}
                </a>
              ) : (
                t.notAvailable
              )}
            </dd>

            {clinic.recommended_vet && (
              <>
                <dt>{t.recommendedVet}</dt>
                <dd>{clinic.recommended_vet}</dd>
              </>
            )}
          </dl>
        </div>

        <div className="clinic-hours-column">
          <div className="clinic-hours-label">{t.hours}</div>
          <OpeningHoursTable clinic={clinic} />
        </div>
      </div>

      {(emergency || notes) && (
        <dl className="clinic-facts expanded-facts">
          {emergency && (
            <>
              <dt>{t.emergency}</dt>
              <dd>{emergency}</dd>
            </>
          )}
          {notes && (
            <>
              <dt>{t.notes}</dt>
              <dd>{notes}</dd>
            </>
          )}
        </dl>
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
