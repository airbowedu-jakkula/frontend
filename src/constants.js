export const CATEGORY_GROUPS = [
  "B1/B2",
  "F1/F2",
  "H1B/H4",
  "L1/L2",
  "J1/J2",
  "C1/D",
  "M1/M2",
  "O1/O2/O3",
  "P1/P2/P3",
  "E1/E2/E3",
  "K1/K2",
  "R1/R2",
  "I",
];

export const NEWS_CATEGORIES = ["General", ...CATEGORY_GROUPS];

export function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type) => parts.find((p) => p.type === type)?.value || "";
    return `${getPart("day")} ${getPart("month")} ${getPart("year")}, ${getPart("hour")}:${getPart("minute")} ${getPart("dayPeriod").toUpperCase()} IST`;
  } catch (e) {
    return d.toLocaleString() + " IST";
  }
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type) => parts.find((p) => p.type === type)?.value || "";
    return `${getPart("day")} ${getPart("month")} ${getPart("year")}`;
  } catch (e) {
    return d.toLocaleDateString();
  }
}

