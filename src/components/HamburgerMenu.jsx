import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { siteConfig } from "../data/siteConfig";
import { InstagramIcon } from "./SocialIcons";

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function HamburgerMenu() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  // "[email]" (the default placeholder) has no @ in it, so it's shown
  // as plain text rather than a clickable mailto link until a real
  // address is set in siteConfig.js.
  const hasRealEmail = siteConfig.contactEmail.includes("@");

  return (
    <div className="hamburger-menu">
      <button
        className="hamburger-button"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        aria-expanded={open}
      >
        <HamburgerIcon />
      </button>

      {open && (
        <>
          {/* Clicking anywhere outside the panel closes it. */}
          <div className="menu-backdrop" onClick={() => setOpen(false)} />

          <div className="menu-panel">
            <section>
              <h3>{t.menuAboutTitle}</h3>
              <p>{t.menuAboutText}</p>
            </section>

            <section>
              <h3>{t.menuContactTitle}</h3>
              <p>{t.menuContactText}</p>
              {hasRealEmail ? (
                <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
              ) : (
                <span className="menu-placeholder">{siteConfig.contactEmail}</span>
              )}
            </section>

            <section className="menu-meta">
              <p className="menu-last-updated">
                {t.lastUpdatedLabel}: {siteConfig.lastUpdated}
              </p>
              <p className="menu-accuracy-note">{t.dataAccuracyNote}</p>
              {siteConfig.instagramUrl && (
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-instagram-link"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
