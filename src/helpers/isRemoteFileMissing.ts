export const isRemoteFileMissing = async (uri: string) => {
  try {
    const parsed = new URL(uri);
    const isHttp = parsed.protocol === "http:" || parsed.protocol === "https:";

    if (!isHttp) {
      return false;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
      const res = await fetch(uri, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        signal: controller.signal,
      });

      return res.status === 404;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return false;
  }
};
