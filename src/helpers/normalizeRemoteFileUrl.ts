const trimEncodedTrailingSpace = (value: string) => value.replace(/(?:%20)+$/gi, "");

/**
 * Some URLs end up with "double-encoded" sequences like:
 *   documents%252Ffile.pdf
 * where %25 is the encoded "%" character.
 *
 * If decodeURIComponent fails due to any malformed "%" sequence,
 * we must still avoid re-encoding "%" again (which causes %252F).
 */
const unwrapPercentEncodingSafely = (value: string, maxPasses: number = 3) => {
  let current = value;

  // Unwrap %25 -> % repeatedly WITHOUT throwing
  for (let i = 0; i < maxPasses; i += 1) {
    const next = current.replace(/%25/gi, "%");
    if (next === current) break;
    current = next;
  }

  return current;
};

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    // If it's malformed, return as-is (but at least we won't double-encode later)
    return value;
  }
};

const decodeRepeatedlySafe = (value: string, maxPasses: number = 3) => {
  let current = value;

  for (let i = 0; i < maxPasses; i += 1) {
    const next = safeDecodeURIComponent(current);
    if (next === current) break;
    current = next;
  }

  return current;
};

export const normalizeRemoteFileUrl = (rawUrl?: string | null) => {
  const input = String(rawUrl ?? "").trim();
  if (!input) return "";

  try {
    const maybeEncodedInput = input.replace(/\s+\?/g, "?");

    // If it's not an absolute URL, try decoding it into one.
    const parsedInput = maybeEncodedInput.startsWith("http")
      ? maybeEncodedInput
      : decodeRepeatedlySafe(maybeEncodedInput);

    const parsed = new URL(parsedInput);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("firebasestorage.googleapis.com")) {
      const objectMarker = "/o/";
      const markerIndex = parsed.pathname.indexOf(objectMarker);

      if (markerIndex >= 0) {
        const prefix = parsed.pathname.slice(0, markerIndex + objectMarker.length);
        const rawObjectPath = parsed.pathname.slice(markerIndex + objectMarker.length);

        // ✅ Step 1: unwrap %25 safely (prevents %252F problems)
        const unwrapped = unwrapPercentEncodingSafely(rawObjectPath);

        // ✅ Step 2: decode repeatedly but safely (won't break on malformed %)
        const decodedObjectPath = decodeRepeatedlySafe(unwrapped);

        // ✅ Step 3: clean and re-encode ONCE
        const cleanedObjectPath = trimEncodedTrailingSpace(decodedObjectPath).trim();
        parsed.pathname = `${prefix}${encodeURIComponent(cleanedObjectPath)}`;

        // Ensure alt=media for direct file access (optional but recommended)
        if (parsed.searchParams.get("alt") !== "media") {
          parsed.searchParams.set("alt", "media");
        }
      }
    }

    return parsed.toString();
  } catch {
    return input.replace(/\s+\?/g, "?");
  }
};