// A minimal rabbit-ears silhouette, used sparingly as the site's signature
// mark (next to the title). Color is controlled by the `color` prop so it
// can match the current theme rather than being hardcoded.
export function RabbitEarsIcon({ size = 26, color = "var(--color-accent)" }) {
  return (
    <svg
      width={size}
      height={(size * 22) / 26}
      viewBox="0 0 26 22"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="9" cy="7" rx="3.4" ry="7.5" transform="rotate(-18 9 7)" fill={color} />
      <ellipse cx="17" cy="7" rx="3.4" ry="7.5" transform="rotate(18 17 7)" fill={color} />
      <circle cx="13" cy="16" r="6" fill={color} />
    </svg>
  );
}
