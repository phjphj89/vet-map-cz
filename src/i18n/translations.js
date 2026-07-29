// All interface text lives here, in two languages.
// To add a new UI string: add a key to BOTH the en and cs objects below.
// To use it in a component: const { t } = useLanguage(); then t.someKey

export const translations = {
  en: {
    siteTitle: "Rabbit-Friendly Vets - Czech Republic",
    allRegions: "All regions",
    filterByRegion: "Filter by region",
    address: "Address",
    phone: "Phone",
    website: "Website",
    hours: "Hours",
    recommendedVet: "Recommended vet",
    notes: "Notes",
    emergency: "Emergency care",
    notAvailable: "Not available",
    showMore: "Show more",
    showLess: "Show less",
    badgeTopPick: "Top pick",
    badge247: "Open 24/7",
    badgeWeekendEmergency: "Weekend emergency service",
    clinicsFound: "clinics found",
    closed: "Closed",
  },
  cs: {
    siteTitle: "Veterináři pro králíky – Česká republika",
    allRegions: "Všechny kraje",
    filterByRegion: "Filtrovat podle kraje",
    address: "Adresa",
    phone: "Telefon",
    website: "Web",
    hours: "Otevírací doba",
    recommendedVet: "Doporučený veterinář",
    notes: "Poznámky",
    emergency: "Pohotovost",
    notAvailable: "Není k dispozici",
    showMore: "Zobrazit více",
    showLess: "Zobrazit méně",
    badgeTopPick: "Doporučeno",
    badge247: "Nonstop provoz",
    badgeWeekendEmergency: "Víkendová pohotovost",
    clinicsFound: "klinik nalezeno",
    closed: "Zavřeno",
  },
};

// Weekday abbreviations as they appear in the 'hours' field (English,
// from the source data) mapped to Czech. Used to translate strings like
// "Mon-Fri 9:00-18:30" without needing to store two full copies of it.
export const dayAbbreviations = {
  en: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
  cs: { Mon: "Po", Tue: "Út", Wed: "St", Thu: "Čt", Fri: "Pá", Sat: "So", Sun: "Ne" },
};

// Full weekday names, keyed by the English abbreviations used in the
// source data (Mon, Tue, ...). Used to label each row of the new
// day-by-day hours table.
export const weekdayNames = {
  en: { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" },
  cs: { Mon: "Pondělí", Tue: "Úterý", Wed: "Středa", Thu: "Čtvrtek", Fri: "Pátek", Sat: "Sobota", Sun: "Neděle" },
};

export const WEEKDAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Replaces each English day abbreviation in a string with the
// equivalent for the given language.
export function translateHours(hoursText, language) {
  if (!hoursText) return "";
  let result = hoursText;
  for (const [en, translated] of Object.entries(dayAbbreviations[language])) {
    result = result.replaceAll(en, translated);
  }
  return result;
}
