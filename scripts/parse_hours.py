"""
Parses the free-text 'hours' field into a per-day schedule:
  hours_by_day = { "Mon": ["9:00-18:30"], "Tue": [...], ..., "Sun": [...] }
  (missing day = closed)

Only handles the REGULAR grammar:
  - day tokens: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  - day groups: "Mon-Fri" (range) or "Mon,Wed,Fri" (list), separated by ";"
  - time ranges per group: "9-18" or "9:00-18:30", multiple split ranges
    joined by "," or "&", e.g. "9-11:30 & 12:30-18"

If ANY leftover text remains after removing recognized day/time tokens
(free-text caveats, extra locations, parenthetical notes, etc.), the
whole entry is marked hours_parse_ok = False and hours_by_day is left
empty - the app will fall back to showing the original raw text for
that clinic instead of a guessed structure.
"""

import json
import re

DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

TIME = r"\d{1,2}(?::\d{2})?"  # e.g. "9" or "9:00" or "18:30"
TIME_RANGE = rf"{TIME}-{TIME}"  # e.g. "9-18" or "9:00-18:30"
TIME_LIST = rf"{TIME_RANGE}(?:\s*[,&]\s*{TIME_RANGE})*"  # split ranges

DAY_TOKEN = r"(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)"
DAY_RANGE = rf"{DAY_TOKEN}-{DAY_TOKEN}"
DAY_LIST = rf"{DAY_TOKEN}(?:,{DAY_TOKEN})*"
DAY_SPEC = rf"(?:{DAY_RANGE}|{DAY_LIST})"

# One "group": a day spec, a space, then a time list. e.g. "Mon-Fri 9-18,13-15"
GROUP_PATTERN = re.compile(rf"^({DAY_SPEC})\s+({TIME_LIST})$")


def expand_days(day_spec):
    """'Mon-Fri' -> [Mon,Tue,Wed,Thu,Fri]. 'Mon,Wed,Fri' -> [Mon,Wed,Fri]."""
    if "-" in day_spec:
        start, end = day_spec.split("-")
        start_i, end_i = DAY_ORDER.index(start), DAY_ORDER.index(end)
        return DAY_ORDER[start_i:end_i + 1]
    return day_spec.split(",")


# A day-group's value is either a time list, or the literal word "closed"
# (e.g. "Sat-Sun closed") - both are unambiguous, valid information.
TIME_LIST_OR_CLOSED = rf"(?:{TIME_LIST}|closed)"

# Finds one complete "day-spec time-list" chunk, e.g. "Mon,Tue,Thu,Fri 9-11,14:30-17".
CHUNK = re.compile(rf"({DAY_SPEC})\s+({TIME_LIST_OR_CLOSED})")

# What's allowed to sit BETWEEN two chunks: just a separator (";" or ",")
# and whitespace - nothing else. If real text sits between chunks, or
# before the first/after the last, the format is irregular -> bail out.
GAP = re.compile(r"^\s*[;,]?\s*$")


def parse_hours(hours_text):
    """Returns (hours_by_day dict, success bool)."""
    if not hours_text or not hours_text.strip():
        return {}, False

    text = hours_text.strip()

    # "Daily 9-19" means every day has the same hours.
    if text.startswith("Daily "):
        time_list = text[len("Daily "):].strip()
        if not re.fullmatch(TIME_LIST, time_list):
            return {}, False
        time_ranges = [t.strip() for t in re.split(r"[,&]", time_list)]
        return {day: time_ranges for day in DAY_ORDER}, True

    result = {}
    position = 0
    for match in CHUNK.finditer(text):
        if not GAP.match(text[position:match.start()]):
            return {}, False

        day_spec, time_list = match.groups()
        if time_list.strip() == "closed":
            time_ranges = []  # explicitly closed - same display as "not mentioned"
        else:
            time_ranges = [t.strip() for t in re.split(r"[,&]", time_list)]
        for day in expand_days(day_spec):
            result[day] = time_ranges

        position = match.end()

    if not GAP.match(text[position:]):
        return {}, False

    return result, bool(result)


with open("clinics.json", encoding="utf-8") as f:
    clinics = json.load(f)

needs_review = []

for clinic in clinics:
    hours_by_day, ok = parse_hours(clinic.get("hours", ""))
    clinic["hours_by_day"] = hours_by_day
    clinic["hours_parse_ok"] = ok
    if not ok:
        needs_review.append((clinic["id"], clinic["name"], clinic.get("hours", "")))

with open("clinics_with_hours.json", "w", encoding="utf-8") as f:
    json.dump(clinics, f, ensure_ascii=False, indent=2)

print(f"Total clinics: {len(clinics)}")
print(f"Cleanly parsed: {len(clinics) - len(needs_review)}")
print(f"Fell back to raw text (irregular format): {len(needs_review)}")
print()
print("--- Clinics using fallback (raw hours text, not day-by-day) ---")
for clinic_id, name, raw in needs_review:
    print(f"  [{clinic_id:>2}] {name}")
    print(f"       {raw!r}")
