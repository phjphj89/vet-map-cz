import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClinicMap } from "./ClinicMap";
import { ClinicList } from "./ClinicList";
import { ViewModeToggle } from "./ViewModeToggle";
import { TEMPORARY_FIXED_LOCATION } from "../utils/tempLocation";
import clinicsData from "../data/clinics.json";

export function HomePage() {
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const userLocation = TEMPORARY_FIXED_LOCATION;
  const navigate = useNavigate();

  // Clicking a pin (in either view) goes straight to that clinic's
  // full detail page, rather than scrolling to a card or opening an
  // inline panel - simpler and consistent now that the list itself
  // only shows a lean summary card.
  const goToClinic = (clinic) => navigate(`/clinic/${clinic.id}`);

  return viewMode === "list" ? (
    <div className="stacked-layout">
      <div className="map-top-section">
        <ClinicMap clinics={clinicsData} onMarkerClick={goToClinic} />
      </div>
      <ClinicList
        clinics={clinicsData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        userLocation={userLocation}
      />
    </div>
  ) : (
    <div className="map-only-layout">
      <ClinicMap clinics={clinicsData} onMarkerClick={goToClinic} />
      <div className="map-floating-toggle">
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  );
}
