import { createContext, useContext, useState } from "react";
import { translations } from "./translations";

// createContext makes a "channel" that components can read from,
// without it being passed down as a prop through every parent.
const LanguageContext = createContext(null);

// This component wraps the whole app (see main.jsx) and holds the
// actual language state. Anything nested inside it can read/change
// the language via the useLanguage() hook below.
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("cs"); // Czech is the default

  const value = {
    language,
    setLanguage,
    t: translations[language], // shortcut: t.someKey gives the translated string
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// A small "hook" (a reusable piece of React logic) that any component
// can call to get { language, setLanguage, t } without needing to know
// how Context works internally.
export function useLanguage() {
  return useContext(LanguageContext);
}
