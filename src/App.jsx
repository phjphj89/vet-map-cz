import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLanguage } from "./i18n/LanguageContext";
import { RabbitEarsIcon } from "./components/RabbitEarsIcon";
import { HamburgerMenu } from "./components/HamburgerMenu";
import { HomePage } from "./components/HomePage";
import { FriendsPage } from "./components/FriendsPage";
import { ClinicDetailPage } from "./components/ClinicDetailPage";
import { CzechFlagIcon, UKFlagIcon } from "./components/FlagIcons";
import { BackToTopButton } from "./components/BackToTopButton";
import "./App.css";

function App() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="app-title">
            <RabbitEarsIcon color="var(--color-accent)" />
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
                aria-label="Čeština"
              >
                <CzechFlagIcon />
              </button>
              <button
                className={language === "en" ? "active" : ""}
                onClick={() => setLanguage("en")}
                aria-label="English"
              >
                <UKFlagIcon />
              </button>
            </div>
            <HamburgerMenu />
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/clinic/:id" element={<ClinicDetailPage />} />
        </Routes>

        <BackToTopButton />
      </div>
    </BrowserRouter>
  );
}

export default App;
