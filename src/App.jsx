import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLanguage } from "./i18n/LanguageContext";
import { RabbitEarsIcon } from "./components/RabbitEarsIcon";
import { HamburgerMenu } from "./components/HamburgerMenu";
import { HomePage } from "./components/HomePage";
import { FriendsPage } from "./components/FriendsPage";
import "./App.css";

function App() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <BrowserRouter>
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
                CZE
              </button>
              <button
                className={language === "en" ? "active" : ""}
                onClick={() => setLanguage("en")}
              >
                ENG
              </button>
            </div>
            <HamburgerMenu />
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
