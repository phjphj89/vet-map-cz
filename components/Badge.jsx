// A single colored label, e.g. "Top pick" or "Open 24/7".
// `variant` picks the color via a CSS class (see App.css) - this leaves
// room to add more badge types later (e.g. "Highest rated") by just
// adding a new variant name and a matching CSS rule.
export function Badge({ text, variant }) {
  return <span className={`badge badge-${variant}`}>{text}</span>;
}
