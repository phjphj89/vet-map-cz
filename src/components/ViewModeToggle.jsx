import { useLanguage } from "../i18n/LanguageContext";
import { ListIcon, MapIcon } from "./ViewModeIcons";

export function ViewModeToggle({ viewMode, setViewMode }) {
  const { t } = useLanguage();

  return (
    <div className="view-mode-toggle">
      <button
        className={viewMode === "list" ? "active" : ""}
        onClick={() => setViewMode("list")}
      >
        <ListIcon />
        {t.viewList}
      </button>
      <button
        className={viewMode === "map" ? "active" : ""}
        onClick={() => setViewMode("map")}
      >
        <MapIcon />
        {t.viewMap}
      </button>
    </div>
  );
}
