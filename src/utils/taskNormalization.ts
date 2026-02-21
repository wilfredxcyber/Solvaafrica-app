export function normalizeUrl(baseUrl: string, url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!baseUrl) return url;
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function parseMoneyString(v?: string | number | null) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function parseCommaList(value?: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

// "1. abc 2. def"  OR  "1) abc 2) def"
export function parseNumberedList(value?: string | null) {
  if (!value) return [];
  const cleaned = value.replace(/\s+/g, " ").trim();

  const parts = cleaned.split(/\s(?=\d+[\.\)])|(?=\d+[\.\)])/g);

  const normalized = parts
    .map((p) => p.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter(Boolean);

  // fallback if backend didn’t use numbers
  if (normalized.length <= 1) {
    const byComma = parseCommaList(value);
    return byComma.length ? byComma : normalized;
  }

  return normalized;
}

export function calcSpotsLeft(totalSpots?: number, usedSpots?: number) {
  const left = Math.max(0, (totalSpots ?? 0) - (usedSpots ?? 0));
  return left >= 100 ? "100+  spot left" : `${left} spot left`;
}

export function calcTimeLeft(endDateISO?: string) {
  if (!endDateISO) return "";
  const end = new Date(endDateISO).getTime();
  const now = Date.now();
  const diffMs = end - now;

  if (!Number.isFinite(end)) return "";
  if (diffMs <= 0) return "Expired";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours} hours left`;

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return `${diffDays} days left`;
}

export function isValidUrl(value: string) {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
