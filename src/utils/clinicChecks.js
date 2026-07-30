// True if the clinic has actual (non-closed) regular hours on
// Saturday OR Sunday (either day counts, not both required), based
// on the new weekly_hours structure. Clinics still flagged for
// manual review (hours_needs_review) return false rather than
// guessing from the old raw text.
export function isOpenOnWeekends(clinic) {
  if (clinic.hours_needs_review || !clinic.weekly_hours) return false;
  const saturday = clinic.weekly_hours.Sat;
  const sunday = clinic.weekly_hours.Sun;
  return Boolean((saturday && !saturday.closed) || (sunday && !sunday.closed));
}

// True if Saturday OR Sunday is marked closed (no regular hours) but
// has a note explaining emergency-only availability (e.g. "For
// emergencies, call..."). This is the day-level source of truth for
// weekend emergency care - it replaces the older has_weekend_emergency
// flag, which was a one-time parse of free text and can go stale once
// a clinic's hours are re-entered through the day-by-day editor.
export function hasWeekendEmergencyNote(clinic) {
  if (clinic.hours_needs_review || !clinic.weekly_hours) return false;
  const saturday = clinic.weekly_hours.Sat;
  const sunday = clinic.weekly_hours.Sun;
  const dayHasNote = (entry) => entry && entry.closed && (entry.note_en || entry.note_cs);
  return Boolean(dayHasNote(saturday) || dayHasNote(sunday));
}
