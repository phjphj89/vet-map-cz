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
