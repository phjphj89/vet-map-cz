// A single colored label, e.g. "Top pick" or "Open 24/7", with an
// optional icon before the text. `variant` picks the color via a CSS
// class (see App.css) - this leaves room to add more badge types
// later by just adding a new variant name and a matching CSS rule.
export function Badge({ text, variant, icon: Icon }) {
  return (
    <span className={`badge badge-${variant}`}>
      {Icon && <Icon />}
      {text}
    </span>
  );
}
