import { useState } from "react";
import { useLanguage } from "./i18n/LanguageContext";
import { ClinicMap } from "./components/ClinicMap";
import { ClinicList } from "./components/ClinicList";
import { ClinicCard } from "./components/ClinicCard";
import { RabbitEarsIcon } from "./components/RabbitEarsIcon";
import { HamburgerMenu } from "./components/HamburgerMenu";
import { ViewModeToggle } from "./components/ViewModeToggle";
import { useUserLocation } from "./hooks/useUserLocation";
import { calculateDistanceKm } from "./utils/distance";
import clinicsData from "./data/clinics.json";
import "./App.css";

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const selectedClinic = clinicsData.find((c) => c.id === selectedClinicId);
  const { status: locationStatus, coords: userLocation, requestLocation } = useUserLocation();

  const selectedClinicDistanceKm =
    selectedClinic && userLocation
      ? calculateDistanceKm(userLocation.lat, userLocation.lng, selectedClinic.lat, selectedClinic.lng)
      : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <RabbitEarsIcon />
          <h1>{t.siteTitle}</h1>
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
