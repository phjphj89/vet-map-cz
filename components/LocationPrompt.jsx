import { useLanguage } from "../i18n/LanguageContext";

export function LocationPrompt({ status, onRequestLocation }) {
  const { t } = useLanguage();

  if (status === "granted") return null;

  return (
    <div className="location-prompt">
      {status === "denied" ? (
        <p>{t.locationDenied}</p>
      ) : status === "unsupported" ? (
        <p>{t.locationUnsupported}</p>
      ) : (
        <>
          <p>{t.locationPromptText}</p>
          <button onClick={onRequestLocation} disabled={status === "requesting"}>
            {t.locationButton}
          </button>
        </>
      )}
    </div>
  );
}
