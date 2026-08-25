import { useLanguage } from "../i18n/LanguageContext";
import { siteConfig } from "../data/siteConfig";
import { InstagramIcon } from "./SocialIcons";

// Shared across every page (rendered once in App.jsx, outside <Routes>),
// so it appears on the home page, the Friends & Partners page, and every
// clinic detail page without needing to be added separately to each.
export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p className="footer-copyright">
        © {year} HopVet. {t.footerRights}
      </p>
      {siteConfig.instagramUrl && (
        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-instagram-link"
          aria-label="Instagram"
        >
          <InstagramIcon size={18} />
        </a>
      )}
      <p className="footer-credit">
        {t.footerCreatedBy}: JP, JNN, MP
      </p>
    </footer>
  );
}
