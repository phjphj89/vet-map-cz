import { useLanguage } from "./i18n/LanguageContext";
import { ClinicMap } from "./components/ClinicMap";
import { ClinicList } from "./components/ClinicList";
import { RabbitEarsIcon } from "./components/RabbitEarsIcon";
import clinicsData from "./data/clinics.json";
import "./App.css";

function App() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <RabbitEarsIcon />
          <h1>{t.siteTitle}</h1>
        </div>
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
      </header>

      <div className="main-layout">
        <div className="map-column">
          <ClinicMap clinics={clinicsData} />
        </div>
        <div className="list-column">
          <ClinicList clinics={clinicsData} />
        </div>
      </div>
    </div>
  );
}

export default App;
