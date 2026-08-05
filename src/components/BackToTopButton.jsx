import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const SHOW_AFTER_SCROLL_PX = 300;

export function BackToTopButton() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set the correct initial state on mount (e.g. if already scrolled)
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="back-to-top-button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t.backToTopLabel}
    >
      <span aria-hidden="true">↑</span> {t.backToTopLabel}
    </button>
  );
}
