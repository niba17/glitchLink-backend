// backend/src/utils/getClickDataFromRequest.ts
import { parseDevice } from "./deviceParser";
import { lookupGeo } from "./geoIp";
import { getClientIp } from "./getClientIp";
import type { ClickData } from "../types/click";

export function getClickDataFromRequest(req: any): ClickData {
  const userAgent = req.headers["user-agent"] || "";
  const ip = getClientIp(req) || "unknown";

  const { browser, os, device } = parseDevice(userAgent);
  const { city, country } = lookupGeo(ip);

  // pastikan referrer tidak null
  const rawRef =
    (req.headers["referer"] as string | undefined) ||
    (req.headers["referrer"] as string | undefined);

  const referrer = rawRef && rawRef.trim().length > 0 ? rawRef : "direct";

  return {
    ip,
    userAgent,
    browser,
    os,
    device,
    city,
    country,
    referrer,
  };
}
