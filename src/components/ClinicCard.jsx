import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { Badge } from "./Badge";
import { OpeningHoursTable } from "./OpeningHoursTable";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";

export function ClinicCard({ clinic }) {
  const { language, t } = useLanguage();

  // useState here just tracks whether the "more details" section is
  // open or closed for THIS card. Each card gets its own independent
  // true/false value - opening one card doesn't affect the others.
  const [expanded, setExpanded] = useState(false);

  // Pick the field for the current language, e.g. notes_cs vs notes_en.
  const notes = clinic[`notes_${language}`];
  const emergency = clinic[`emergency_${language}`];

  const hasExpandableContent = notes || emergency || clinic.recommended_vet;

  return (
    <div className="clinic-card">
      <div className="clinic-card-header">
        <h3>{clinic.name}</h3>
        <div className="badge-row">
          {clinic.top_pick && <Badge text={t.badgeTopPick} variant="top-pick" />}
          {clinic.is_24_7 === true && <Badge text={t.badge247} variant="emergency" />}
          {clinic.is_24_7 !== true && clinic.has_weekend_emergency === true && (
            <Badge text={t.badgeWeekendEmergency} variant="weekend" />
          )}
        </div>
      </div>

      <p className="clinic-address">{clinic.address}</p>

      <div className="clinic-card-body">
        <div className="clinic-left-column">
          <dl className="clinic-facts">
            <dt>{t.phone}</dt>
            <dd>{clinic.phone || t.notAvailable}</dd>

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

            {expanded && clinic.recommended_vet && (
              <>
                <dt>{t.recommendedVet}</dt>
                <dd>{clinic.recommended_vet}</dd>
              </>
            )}
          </dl>

          {hasExpandableContent && (
            <button className="expand-button" onClick={() => setExpanded(!expanded)}>
              {expanded ? t.showLess : t.showMore}
            </button>
          )}
        </div>

        <div className="clinic-hours-column">
          <div className="clinic-hours-label">{t.hours}</div>
          <OpeningHoursTable clinic={clinic} />
        </div>
      </div>

      {expanded && (emergency || notes) && (
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
