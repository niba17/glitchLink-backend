import DeviceDetector from "device-detector-js";

export function parseDevice(userAgent: string) {
  const detector = new DeviceDetector();
  const parsed = detector.parse(userAgent);

  return {
    browser: parsed.client?.name || null,
    os: parsed.os?.name || null,
    device: parsed.device?.type || null, // mobile, tablet, console, smarttv, wearable, etc.
  };
}
