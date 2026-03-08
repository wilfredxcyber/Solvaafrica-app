import { API_BASE_URL } from "../api/apiClient";

type TaskRecord = Record<string, unknown>;

const TEXT_IMAGE_KEYS = [
  "url",
  "secure_url",
  "uri",
  "path",
  "src",
  "publicUrl",
  "downloadUrl",
  "assetUrl",
  "asset_url",
  "imageUrl",
];

const NESTED_IMAGE_KEYS = [
  "file",
  "image",
  "images",
  "banner",
  "bannerImage",
  "thumbnail",
  "logo",
  "avatar",
  "photo",
  "media",
  "assets",
];

function asRecord(value: unknown): TaskRecord | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as TaskRecord;
  }

  return undefined;
}

export function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

export function normalizeUrl(baseUrl: string, url?: string | null) {
  const trimmedUrl = typeof url === "string" ? url.trim() : "";

  if (!trimmedUrl) return undefined;
  if (/^(https?:|file:|data:)/i.test(trimmedUrl)) return trimmedUrl;
  if (trimmedUrl.startsWith("//")) return `https:${trimmedUrl}`;
  if (!baseUrl) return trimmedUrl;

  const sanitizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const sanitizedPath = trimmedUrl.startsWith("/")
    ? trimmedUrl
    : `/${trimmedUrl.replace(/^\/+/, "")}`;

  return `${sanitizedBaseUrl}${sanitizedPath}`;
}

export function parseMoneyString(v?: string | number | null) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
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

  // fallback if backend didn't use numbers
  if (normalized.length <= 1) {
    const byComma = parseCommaList(value);
    return byComma.length ? byComma : normalized;
  }

  return normalized;
}

export function toTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        const itemRecord = asRecord(item);
        if (!itemRecord) return undefined;

        return pickFirstString(
          itemRecord.title,
          itemRecord.name,
          itemRecord.text,
          itemRecord.description,
          itemRecord.content,
        );
      })
      .filter((item): item is string => Boolean(item));
  }

  if (typeof value === "string") {
    const numberedList = parseNumberedList(value);
    if (numberedList.length > 1) return numberedList;

    return value
      .split(/\r?\n|[;\u2022]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function resolveImageUri(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string") {
      const normalized = normalizeUrl(API_BASE_URL, value);
      if (normalized) return normalized;
      continue;
    }

    if (Array.isArray(value)) {
      const arrayUri = resolveImageUri(...value);
      if (arrayUri) return arrayUri;
      continue;
    }

    const record = asRecord(value);
    if (!record) continue;

    const directUri = pickFirstString(...TEXT_IMAGE_KEYS.map((key) => record[key]));
    if (directUri) {
      const normalized = normalizeUrl(API_BASE_URL, directUri);
      if (normalized) return normalized;
    }

    const nestedUri = resolveImageUri(...NESTED_IMAGE_KEYS.map((key) => record[key]));
    if (nestedUri) return nestedUri;
  }

  return undefined;
}

function pickFirstNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function getTaskSources(task: TaskRecord) {
  return [
    task,
    asRecord(task.task),
    asRecord(task.campaign),
    asRecord(task.brand),
    asRecord(task.company),
    asRecord(task.sponsor),
    asRecord(task.organization),
    asRecord(task.advertiser),
  ].filter((value): value is TaskRecord => Boolean(value));
}

function pickStringFromSources(sources: TaskRecord[], keys: string[]) {
  return pickFirstString(...sources.flatMap((source) => keys.map((key) => source[key])));
}

function pickImageFromSources(sources: TaskRecord[], keys: string[]) {
  return resolveImageUri(...sources.flatMap((source) => keys.map((key) => source[key])));
}

function pickListFromSources(sources: TaskRecord[], keys: string[]) {
  for (const source of sources) {
    for (const key of keys) {
      const values = toTextList(source[key]);
      if (values.length) return values;
    }
  }

  return [];
}

export function normalizeTaskRecord(task: TaskRecord) {
  const sources = getTaskSources(task);

  return {
    id: pickStringFromSources(sources, ["id", "_id", "taskId"]),
    title: pickStringFromSources(sources, ["title", "campaignTitle", "name"]),
    brandName: pickStringFromSources(sources, [
      "sponsorName",
      "brandName",
      "companyName",
      "name",
      "displayName",
    ]),
    campaignType: pickStringFromSources(sources, [
      "type",
      "campaignType",
      "taskType",
      "category",
      "campaignCategory",
    ]),
    overview: pickStringFromSources(sources, [
      "overview",
      "description",
      "taskOverview",
      "summary",
      "campaignBrief",
      "brief",
    ]),
    bannerImage: pickImageFromSources(sources, [
      "bannerImage",
      "banner",
      "image",
      "coverImage",
      "cover",
      "thumbnail",
      "media",
      "assets",
    ]),
    sponsorLogo: pickImageFromSources(sources, [
      "sponsorLogo",
      "companyLogo",
      "brandLogo",
      "logo",
      "avatar",
      "image",
    ]),
    endDate: pickStringFromSources(sources, ["endDate", "deadline", "expiresAt", "closingDate"]),
    totalPool: parseMoneyString(
      pickStringFromSources(sources, ["totalPool", "reward", "prizePool", "amount"]) ??
        pickFirstNumber(...sources.map((source) => source.totalPool)),
    ),
    totalSpots: pickFirstNumber(...sources.map((source) => source.totalSpots ?? source.spots)),
    usedSpots: pickFirstNumber(
      ...sources.map((source) => source.usedSpots ?? source.filledSpots ?? source.claimedSpots),
    ),
    mustInclude: pickListFromSources(sources, [
      "mustInclude",
      "contentRequirements",
      "requirements",
      "deliverables",
    ]),
    guidelines: pickListFromSources(sources, [
      "contentGuidelines",
      "guidelines",
      "instructions",
      "rules",
    ]),
    selectionCriteria: pickListFromSources(sources, [
      "selectionCriteria",
      "criteria",
      "reviewCriteria",
    ]),
    submissionSteps: pickListFromSources(sources, [
      "howToSubmit",
      "submissionSteps",
      "submitInstructions",
    ]),
  };
}

export function calcSpotsLeft(totalSpots?: number, usedSpots?: number) {
  const left = Math.max(0, (totalSpots ?? 0) - (usedSpots ?? 0));
  return left >= 100
    ? "100+ spots left"
    : `${left} ${left === 1 ? "spot" : "spots"} left`;
}

export function calcTimeLeft(endDateISO?: string) {
  if (!endDateISO) return "";
  const end = new Date(endDateISO).getTime();
  const now = Date.now();
  const diffMs = end - now;

  if (!Number.isFinite(end)) return "";
  if (diffMs <= 0) return "Expired";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${Math.max(diffHours, 1)} hours left`;

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
