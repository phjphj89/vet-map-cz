// True if the clinic has actual (non-closed) regular hours on
// Saturday OR Sunday (either day counts, not both required), based
// on the structured per-day schedule. Clinics whose hours didn't
// parse cleanly (hours_parse_ok === false) return false here rather
// than guessing from the raw text.
export function isOpenOnWeekends(clinic) {
  if (!clinic.hours_parse_ok || !clinic.hours_by_day) return false;
  const saturday = clinic.hours_by_day.Sat;
  const sunday = clinic.hours_by_day.Sun;
  return Boolean((saturday && saturday.length > 0) || (sunday && sunday.length > 0));
}
