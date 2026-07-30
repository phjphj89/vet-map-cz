import { useState } from "react";
import { useLanguage } from "./i18n/LanguageContext";
import { ClinicMap } from "./components/ClinicMap";
import { ClinicList } from "./components/ClinicList";
import { ClinicCard } from "./components/ClinicCard";
import { RabbitEarsIcon } from "./components/RabbitEarsIcon";
import { HamburgerMenu } from "./components/HamburgerMenu";
import { ViewModeToggle } from "./components/ViewModeToggle";
import { calculateDistanceKm } from "./utils/distance";
import clinicsData from "./data/clinics.json";
import "./App.css";

// TEMPORARY: a fixed reference point (Prague), used to preview the
// distance feature before the real "Allow location" flow is
// reintroduced somewhere in the UI. Swap this back to the
// useUserLocation() hook's real coords once that's ready - the rest
// of the distance/sorting code doesn't need to change either way,
// since it just expects a {lat, lng} object.
const TEMPORARY_FIXED_LOCATION = { lat: 50.0834140, lng: 14.4348084 };

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const selectedClinic = clinicsData.find((c) => c.id === selectedClinicId);
  const userLocation = TEMPORARY_FIXED_LOCATION;

  const selectedClinicDistanceKm =
    selectedClinic && userLocation
      ? calculateDistanceKm(userLocation.lat, userLocation.lng, selectedClinic.lat, selectedClinic.lng)
      : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <RabbitEarsIcon color="var(--color-accent-text)" />
          <div className="app-title-text">
            <h1>HopVet</h1>
            <p className="app-tagline">{t.siteTagline}</p>
          </div>
        </div>
        <div className="header-controls">
          <div className="language-toggle">
            <button
              className={language === "cs" ? "active" : ""}
              onClick={() => setLanguage("cs")}
            >
              CS
            </button>
            <button
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>
          <HamburgerMenu />
        </div>
      </header>

      {viewMode === "list" ? (
        <div className="main-layout">
          <div className="map-column">
            <ClinicMap clinics={clinicsData} />
          </div>
          <div className="list-column">
            <ClinicList
              clinics={clinicsData}
              viewMode={viewMode}
              setViewMode={setViewMode}
              userLocation={userLocation}
            />
          </div>
        </div>
      ) : (
        <div className="map-only-layout">
          <ClinicMap
            clinics={clinicsData}
            onMarkerClick={(clinic) => setSelectedClinicId(clinic.id)}
          />
          <div className="map-floating-toggle">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
          {selectedClinic && (
            <div className="map-clinic-panel">
              <button
                className="map-clinic-panel-close"
                onClick={() => setSelectedClinicId(null)}
                aria-label="Close"
              >
                ×
              </button>
              <ClinicCard clinic={selectedClinic} distanceKm={selectedClinicDistanceKm} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
