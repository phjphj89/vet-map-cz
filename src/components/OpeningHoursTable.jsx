import { useLanguage } from "../i18n/LanguageContext";
import { weekdayNames, WEEKDAY_ORDER, translateHours } from "../i18n/translations";
import { formatTime } from "../utils/formatTime";

const DAY_CODES_BY_JS_WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getTodayDayCode() {
  return DAY_CODES_BY_JS_WEEKDAY[new Date().getDay()];
}

// Builds the display text for a single day's entry, e.g.
// "9:00 - 12:00, 13:00 - 18:00" or "Closed" or a mix with a note.
function formatDayEntry(entry, closedLabel) {
  const ranges = [];
  if (entry.start1 && entry.end1) {
    ranges.push(`${formatTime(entry.start1)} - ${formatTime(entry.end1)}`);
  }
  if (entry.start2 && entry.end2) {
    ranges.push(`${formatTime(entry.start2)} - ${formatTime(entry.end2)}`);
  }

  return entry.closed ? closedLabel : ranges.join(", ");
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
  const showHolidayRow = holiday && (!holiday.closed || holidayNote);

  return (
    <table className="hours-table">
      <tbody>
        {WEEKDAY_ORDER.map((dayCode) => {
          const entry = clinic.weekly_hours[dayCode];
          const note = entry[`note_${language}`];
          const timeText = formatDayEntry(entry, t.closed);
          return (
            <tr key={dayCode} className={dayCode === todayCode ? "hours-today" : ""}>
              <td className="hours-day">{weekdayNames[language][dayCode]}</td>
              <td className={entry.closed && !note ? "hours-closed" : "hours-time"}>
                {timeText}
                {note && <span className="hours-note"> ({note})</span>}
              </td>
            </tr>
          );
        })}
        {showHolidayRow && (
          <tr>
            <td className="hours-day">{t.publicHolidays}</td>
            <td className={holiday.closed && !holidayNote ? "hours-closed" : "hours-time"}>
              {holiday.closed && holidayNote ? (
                holidayNote
              ) : (
                <>
                  {formatDayEntry(holiday, t.closed)}
                  {holidayNote && <span className="hours-note"> ({holidayNote})</span>}
                </>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
