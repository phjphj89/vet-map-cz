import { useNavigate } from "react-router-dom";
import { ClinicMap } from "./ClinicMap";
import { ClinicList } from "./ClinicList";
import { TEMPORARY_FIXED_LOCATION } from "../utils/tempLocation";
import clinicsData from "../data/clinics.json";

// Clinics marked unpublished (e.g. incomplete records still being
// filled in) are hidden from both the map and the list - this filter
// runs once here so both always stay in sync with each other.
const publishedClinics = clinicsData.filter((c) => c.published === true);

export function HomePage() {
  const userLocation = TEMPORARY_FIXED_LOCATION;
  const navigate = useNavigate();

  // Clicking a pin goes straight to that clinic's full detail page,
  // rather than scrolling to a card or opening an inline panel.
  const goToClinic = (clinic) => navigate(`/clinic/${clinic.id}`);

  return (
    <div className="stacked-layout">
      <div className="map-top-section">
        <ClinicMap clinics={publishedClinics} onMarkerClick={goToClinic} />
      </div>
      <ClinicList clinics={publishedClinics} userLocation={userLocation} />
    </div>
  );
}
