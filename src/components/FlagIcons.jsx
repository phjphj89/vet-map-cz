import { useId } from "react";

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

// A truly circular version of the flag above (used for the "We speak
// English" tag) - clips the flag with an SVG clipPath instead of CSS
// overflow/border-radius, which can fail to clip reliably (a known
// Safari quirk) especially with many copies on one page. useId() keeps
// the clipPath's id unique per instance, since plain HTML ids would
// collide with dozens of these on the clinic list at once.
export function UKFlagCircleIcon({ size = 20 }) {
  const clipId = `uk-flag-circle-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* Same flag artwork as UKFlagIcon, scaled up and centered to
            fill (crop into) the circle rather than fit inside it. */}
        <g transform="translate(-20, 0) scale(1.33333)">
          <rect width="60" height="30" fill="#00247D" />
          <path d="M0 0L60 30M60 0L0 30" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M0 0L60 30M60 0L0 30" stroke="#CF142B" strokeWidth="2" />
          <path d="M30 0V30M0 15H60" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M30 0V30M0 15H60" stroke="#CF142B" strokeWidth="6" />
        </g>
      </g>
    </svg>
  );
}
