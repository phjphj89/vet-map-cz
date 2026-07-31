export function CzechFlagIcon({ size = 20 }) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 30 20" aria-hidden="true">
      <rect width="30" height="10" fill="#FFFFFF" />
      <rect y="10" width="30" height="10" fill="#D7141A" />
      <polygon points="0,0 15,10 0,20" fill="#11457E" />
    </svg>
  );
}

export function UKFlagIcon({ size = 20 }) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 60 30" aria-hidden="true">
      <rect width="60" height="30" fill="#00247D" />
      <path d="M0 0L60 30M60 0L0 30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0 0L60 30M60 0L0 30" stroke="#CF142B" strokeWidth="2" />
      <path d="M30 0V30M0 15H60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30 0V30M0 15H60" stroke="#CF142B" strokeWidth="6" />
    </svg>
  );
}
