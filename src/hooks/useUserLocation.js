import { useState } from "react";

// Manages requesting the user's location via the browser's built-in
// Geolocation API. Nothing happens automatically - requestLocation()
// must be called from a button click, which triggers the browser's
// own native permission prompt (this component has no way to bypass
// or skip that prompt - it's enforced by the browser itself).
export function useUserLocation() {
  const [status, setStatus] = useState("idle"); // idle | requesting | granted | denied | unsupported
  const [coords, setCoords] = useState(null);

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("granted");
      },
      () => {
        setStatus("denied");
      }
    );
  }

  return { status, coords, requestLocation };
}
