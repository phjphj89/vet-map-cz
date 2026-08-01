// TEMPORARY: a fixed reference point (Prague), used to preview the
// distance feature before the real "Allow location" flow is
// reintroduced somewhere in the UI. Swap this back to the
// useUserLocation() hook's real coords once that's ready - the rest
// of the distance/sorting code doesn't need to change either way,
// since it just expects a {lat, lng} object. Kept in one shared file
// so every page that needs it stays in sync.
export const TEMPORARY_FIXED_LOCATION = { lat: 50.0834140, lng: 14.4348084 };
