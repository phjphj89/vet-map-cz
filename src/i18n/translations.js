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
    publicHolidays: "Public holidays",
    menuAboutTitle: "About this site",
    menuAboutText: "This site helps people in the Czech Republic find a vet who treats rabbits. According to FEDIAF (the European Pet Food Industry Federation), small mammals - including rabbits - are the third most commonly kept pet in the Czech Republic, yet many veterinary clinics don't have a vet trained in their care. This is a curated list of clinics that do.",
    menuContactTitle: "Contact",
    menuContactText: "Found a mistake, or know of a rabbit-friendly clinic that should be listed? Get in touch:",
    lastUpdatedLabel: "Data last updated",
    dataAccuracyNote: "Clinic details (hours, contact info) may change. Please confirm directly with the clinic before visiting, especially for emergencies.",
    bloodDonorButton: "Find blood donor - Kapka pro ušáčka",
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
    publicHolidays: "Svátky",
    menuAboutTitle: "O tomto webu",
    menuAboutText: "Tento web pomáhá lidem v České republice najít veterináře, který léčí králíky. Podle FEDIAF (Evropské federace výrobců krmiv pro zvířata v zájmovém chovu) jsou malí savci - včetně králíků - třetím nejčastěji chovaným domácím mazlíčkem v České republice, přesto mnoho veterinárních klinik nemá veterináře vyškoleného v péči o ně. Toto je vybraný seznam klinik, které ano.",
    menuContactTitle: "Kontakt",
    menuContactText: "Našli jste chybu, nebo víte o klinice přátelské ke králíkům, která by zde měla být uvedena? Ozvěte se:",
    lastUpdatedLabel: "Data naposledy aktualizována",
    dataAccuracyNote: "Údaje o klinikách (otevírací doba, kontakty) se mohou měnit. Před návštěvou si je prosím ověřte přímo u kliniky, zejména v případě pohotovosti.",
    bloodDonorButton: "Sehnat dárce krve - Kapka pro ušáčka",
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
