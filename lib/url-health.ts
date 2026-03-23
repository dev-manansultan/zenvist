interface UrlProbeResult {
  reachable: boolean;
  status: number | null;
  finalUrl: string | null;
  error: string | null;
}

export async function probeUrl(url: string, timeoutMs = 8000): Promise<UrlProbeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headResponse = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });

    if (headResponse.status === 405 || headResponse.status === 501) {
      const getResponse = await fetch(url, {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        signal: controller.signal,
      });

      return {
        reachable: getResponse.status < 500,
        status: getResponse.status,
        finalUrl: getResponse.url,
        error: null,
      };
    }

    return {
      reachable: headResponse.status < 500,
      status: headResponse.status,
      finalUrl: headResponse.url,
      error: null,
    };
  } catch (error) {
    return {
      reachable: false,
      status: null,
      finalUrl: null,
      error: error instanceof Error ? error.message : "Failed to reach URL",
    };
  } finally {
    clearTimeout(timer);
  }
}
