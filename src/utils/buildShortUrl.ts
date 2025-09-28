// src/utils/buildShortUrl.ts

export function buildShortUrl(baseUrl: string, shortCode: string): string {
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}/${shortCode}`;
}
