import geoip from "geoip-lite";

export function lookupGeo(ip: string | null) {
  if (!ip) return { city: null, country: null };
  const geo = geoip.lookup(ip);
  return {
    city: geo?.city || null,
    country: geo?.country || null,
  };
}
