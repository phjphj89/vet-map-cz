import { useLanguage } from "../i18n/LanguageContext";
import { Badge } from "./Badge";
import { OpeningHoursTable } from "./OpeningHoursTable";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";
import { StarIcon } from "./StarIcon";
import { LiveStatus } from "./LiveStatus";
import { isOpenOnWeekends, hasWeekendEmergencyNote } from "../utils/clinicChecks";

export function ClinicCard({ clinic, distanceKm }) {
  const { language, t } = useLanguage();

  // Pick the field for the current language, e.g. notes_cs vs notes_en.
  const notes = clinic[`notes_${language}`];
  const emergency = clinic[`emergency_${language}`];

  return (
    <div className="clinic-card">
      <div className="clinic-card-header">
        <div className="clinic-header-left">
          <h3>{clinic.name}</h3>
          <p className="clinic-address">{clinic.address}</p>
        </div>
        <div className="clinic-header-right">
          <div className="badge-row">
            {clinic.top_pick && <Badge text={t.badgeTopPick} variant="top-pick" />}
            {clinic.is_24_7 === true ? (
              <Badge text={t.badge247} variant="emergency" />
            ) : isOpenOnWeekends(clinic) && hasWeekendEmergencyNote(clinic) ? (
              <Badge text={t.badgeOpenWeekendsAndEmergency} variant="emergency" />
            ) : isOpenOnWeekends(clinic) ? (
              <Badge text={t.badgeOpenWeekends} variant="weekend" />
            ) : hasWeekendEmergencyNote(clinic) ? (
              <Badge text={t.badgeWeekendEmergencyOnly} variant="weekend-emergency" />
            ) : null}
            {clinic.hospitalization === true && (
              <Badge text={t.filterHospitalization} variant="hospitalization" />
            )}
          </div>
          {clinic.google_rating != null && (
            <div className="clinic-rating">
              <span className="clinic-rating-star"><StarIcon /></span>
              {Number(clinic.google_rating).toFixed(1)}
              {clinic.google_review_count != null && (
                <span className="clinic-rating-count">({clinic.google_review_count})</span>
              )}
            </div>
          )}
          {distanceKm != null && (
            <div className="clinic-distance">
              {Number(distanceKm) < 20 ? Number(distanceKm).toFixed(1) : Math.round(Number(distanceKm))} km
            </div>
          )}
        </div>
      </div>

      <div className="clinic-action-buttons">
        {clinic.phone && (
          <a href={`tel:${clinic.phone}`} className="action-button action-button-primary">
            {t.callButton}
          </a>
        )}
        {clinic.google_maps_url && (
          <a href={clinic.google_maps_url} target="_blank" rel="noopener noreferrer" className="action-button">
            {t.openInMaps}
          </a>
        )}
        {clinic.website && (
          <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="action-button">
            {t.website}
          </a>
        )}
      </div>

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

            <dt>{t.englishCommunication}</dt>
            <dd>{clinic.english_communication ? t.yesLabel : t.noLabel}</dd>
          </dl>
        </div>

        <div className="clinic-hours-column">
          <div className="clinic-hours-label-row">
            <span className="clinic-hours-label">{t.hours}</span>
            <LiveStatus clinic={clinic} />
          </div>
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
