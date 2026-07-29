import { useLanguage } from "../i18n/LanguageContext";
import { weekdayNames, WEEKDAY_ORDER, translateHours } from "../i18n/translations";
import { formatTimeRange } from "../utils/formatTime";

export function OpeningHoursTable({ clinic }) {
  const { language, t } = useLanguage();

  if (!clinic.hours) {
    return <p className="hours-fallback">{t.notAvailable}</p>;
  }

  // Irregular format (caveats, multiple locations, etc.) - we didn't
  // parse this one, so show the original text rather than guess.
  if (!clinic.hours_parse_ok) {
    return <p className="hours-fallback">{translateHours(clinic.hours, language)}</p>;
  }

  return (
    <table className="hours-table">
      <tbody>
        {WEEKDAY_ORDER.map((dayCode) => {
          const ranges = clinic.hours_by_day[dayCode];
          const isClosed = !ranges || ranges.length === 0;
          return (
            <tr key={dayCode}>
              <td className="hours-day">{weekdayNames[language][dayCode]}</td>
              <td className={isClosed ? "hours-closed" : "hours-time"}>
                {isClosed ? t.closed : ranges.map(formatTimeRange).join(", ")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
