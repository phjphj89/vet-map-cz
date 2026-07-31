const DAY_CODES_BY_JS_WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Parses "9", "09:00", "9:5", "13:30" etc. into minutes-since-midnight.
// Returns null if the string doesn't look like a time at all.
function parseTimeToMinutes(str) {
  if (!str) return null;
  const match = str.trim().match(/^(\d{1,2}):?(\d{0,2})$/);
  if (!match) return null;
  const hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  return hour * 60 + minute;
}

// Returns "open" | "closed" | "emergency" | null (null = can't determine,
// e.g. hours still flagged for manual review).
export function getLiveStatus(clinic) {
  if (clinic.is_24_7) return "open";
  if (clinic.hours_needs_review || !clinic.weekly_hours) return null;

  const now = new Date();
  const todayCode = DAY_CODES_BY_JS_WEEKDAY[now.getDay()];
  const entry = clinic.weekly_hours[todayCode];
  if (!entry) return null;

  const hasNote = Boolean(entry.note_en || entry.note_cs);

  if (entry.closed) {
    // Closed for regular business, but a note (e.g. "call for
    // emergencies") means someone may still be reachable.
    return hasNote ? "emergency" : "closed";
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const ranges = [
    [entry.start1, entry.end1],
    [entry.start2, entry.end2],
  ];

  for (const [start, end] of ranges) {
    const startMinutes = parseTimeToMinutes(start);
    const endMinutes = parseTimeToMinutes(end);
    if (startMinutes != null && endMinutes != null && nowMinutes >= startMinutes && nowMinutes < endMinutes) {
      return "open";
    }
  }

  // Has regular hours today, but right now falls outside all of them.
  return "closed";
}
