import { useLanguage } from "../i18n/LanguageContext";
import { weekdayNames, WEEKDAY_ORDER, translateHours } from "../i18n/translations";
import { formatTime } from "../utils/formatTime";

const DAY_CODES_BY_JS_WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getTodayDayCode() {
  return DAY_CODES_BY_JS_WEEKDAY[new Date().getDay()];
}

// Builds the display text for the regular-hours column, e.g.
// "9:00 - 12:00, 13:00 - 18:00" or "Closed".
function formatRegularHours(entry, closedLabel) {
  const ranges = [];
  if (entry.start1 && entry.end1) {
    ranges.push(`${formatTime(entry.start1)} - ${formatTime(entry.end1)}`);
  }
  if (entry.start2 && entry.end2) {
    ranges.push(`${formatTime(entry.start2)} - ${formatTime(entry.end2)}`);
  }
  return entry.closed ? closedLabel : ranges.join(", ");
}

// Builds the display text for the emergency-hours column. Returns an
// empty string if no emergency hours are set for that day - the
// caller shows a muted dash in that case.
function formatEmergencyHours(entry) {
  const ranges = [];
  if (entry.emergency_start1 && entry.emergency_end1) {
    ranges.push(`${formatTime(entry.emergency_start1)} - ${formatTime(entry.emergency_end1)}`);
  }
  if (entry.emergency_start2 && entry.emergency_end2) {
    ranges.push(`${formatTime(entry.emergency_start2)} - ${formatTime(entry.emergency_end2)}`);
  }
  return ranges.join(", ");
}

function DayRow({ dayCode, label, entry, language, t, isToday }) {
  const note = entry[`note_${language}`];
  const regularText = formatRegularHours(entry, t.closed);
  const emergencyText = formatEmergencyHours(entry);

  return (
    <tr className={isToday ? "hours-today" : ""}>
      <td className="hours-day">{label}</td>
      <td className={entry.closed && !note ? "hours-closed" : "hours-time"}>
        {regularText}
        {note && <span className="hours-note"> ({note})</span>}
      </td>
      <td className={emergencyText ? "hours-time" : "hours-empty"}>
        {emergencyText || "—"}
      </td>
    </tr>
  );
}

export function OpeningHoursTable({ clinic }) {
  const { language, t } = useLanguage();
  const todayCode = getTodayDayCode();

  // Irregular schedule that hasn't been manually re-entered yet in the
  // new day-by-day format - show the original text rather than a
  // table that would incorrectly show every day as closed.
  if (clinic.hours_needs_review) {
    if (!clinic.hours) {
      return <p className="hours-fallback">{t.notAvailable}</p>;
    }
    return <p className="hours-fallback">{translateHours(clinic.hours, language)}</p>;
  }

  if (!clinic.weekly_hours) {
    return <p className="hours-fallback">{t.notAvailable}</p>;
  }

  const holiday = clinic.weekly_hours.Holiday;
  const holidayNote = holiday ? holiday[`note_${language}`] : "";
  const holidayEmergency = holiday ? formatEmergencyHours(holiday) : "";
  const showHolidayRow = holiday && (!holiday.closed || holidayNote || holidayEmergency);

  return (
    <table className="hours-table">
      <thead>
        <tr>
          <th className="hours-col-heading"></th>
          <th className="hours-col-heading">{t.regularHoursHeading}</th>
          <th className="hours-col-heading">{t.emergencyHoursHeading}</th>
        </tr>
      </thead>
      <tbody>
        {WEEKDAY_ORDER.map((dayCode) => (
          <DayRow
            key={dayCode}
            dayCode={dayCode}
            label={weekdayNames[language][dayCode]}
            entry={clinic.weekly_hours[dayCode]}
            language={language}
            t={t}
            isToday={dayCode === todayCode}
          />
        ))}
        {showHolidayRow && (
          <DayRow
            dayCode="Holiday"
            label={t.publicHolidays}
            entry={holiday}
            language={language}
            t={t}
            isToday={false}
          />
        )}
      </tbody>
    </table>
  );
}
