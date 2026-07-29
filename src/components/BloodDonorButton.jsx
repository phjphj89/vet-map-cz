import { useLanguage } from "../i18n/LanguageContext";

// Links to Kapka pro ušáčka (kapkaprousacka.cz), the real Czech
// registry of rabbit blood donors.
const BLOOD_DONOR_REGISTRY_URL = "https://www.kapkaprousacka.cz/";

export function BloodDonorButton() {
  const { t } = useLanguage();
  return (
    <a
      href={BLOOD_DONOR_REGISTRY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="blood-donor-button"
    >
      {t.bloodDonorButton}
    </a>
  );
}
