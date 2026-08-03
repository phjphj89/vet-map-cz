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

// True if Saturday OR Sunday has structured emergency hours entered
// (the new source of truth), or - for clinics not yet migrated to
// that - a note on a closed day describing emergency availability.
// This is what drives the "Weekend Emergency" badge/filter/pin.
export function hasWeekendEmergencyNote(clinic) {
  if (clinic.hours_needs_review || !clinic.weekly_hours) return false;
  const saturday = clinic.weekly_hours.Sat;
  const sunday = clinic.weekly_hours.Sun;
  const dayHasEmergencyHours = (entry) => entry && entry.emergency_start1;
  const dayHasNote = (entry) => entry && entry.closed && (entry.note_en || entry.note_cs);
  return Boolean(
    dayHasEmergencyHours(saturday) || dayHasEmergencyHours(sunday) ||
    dayHasNote(saturday) || dayHasNote(sunday)
  );
}
