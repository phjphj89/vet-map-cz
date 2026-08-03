// Turns a single time (e.g. "9" or "14:30") into "H:MM" - pads missing
// minutes to ":00", but doesn't pad the hour (matches "9:00", not "09:00").
export function formatTime(time) {
  const [hour, minute] = time.split(":");
  const paddedMinute = (minute || "0").padStart(2, "0");
  return `${hour}:${paddedMinute}`;
}

// Turns a raw range like "9-18" or "14:30-17" into "9:00 - 18:00" /
// "14:30 - 17:00" - always showing minutes, with spaces around the dash.
export function formatTimeRange(range) {
  const [start, end] = range.split("-");
  return `${formatTime(start)} - ${formatTime(end)}`;
}
