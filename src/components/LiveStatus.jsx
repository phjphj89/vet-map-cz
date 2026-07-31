import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { getLiveStatus } from "../utils/liveStatus";

export function LiveStatus({ clinic }) {
  const { t } = useLanguage();

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

  return (
    <span className={`live-status ${className}`}>
      <span className="live-status-dot" />
      {label}
    </span>
  );
}
