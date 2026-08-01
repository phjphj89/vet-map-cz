import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { getLiveStatus, getNextOpening } from "../utils/liveStatus";
import { dayAbbreviations } from "../i18n/translations";
import { formatTime } from "../utils/formatTime";
import { ClockIcon } from "./StatusIcons";

export function LiveStatus({ clinic }) {
  const { t, language } = useLanguage();

  // Forces a re-render once a minute, so the status doesn't go stale
  // if someone leaves the page open across an opening/closing time.
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const status = getLiveStatus(clinic);
  if (!status) return null;

  const STATUS_CONFIG = {
    open: { label: t.statusOpen, className: "status-open" },
    closed: { label: t.statusClosed, className: "status-closed" },
    emergency: { label: t.statusEmergency, className: "status-emergency" },
  };
  const { label, className } = STATUS_CONFIG[status];

  let displayLabel = label;
  if (status === "closed") {
    const next = getNextOpening(clinic);
    if (next) {
      const dayLabel = dayAbbreviations[language][next.dayCode];
      displayLabel = `${label} · ${t.opensAtLabel} ${dayLabel} ${formatTime(next.time)}`;
    }
  }

  return (
    <span className={`live-status ${className}`}>
      <ClockIcon />
      {displayLabel}
    </span>
  );
}
