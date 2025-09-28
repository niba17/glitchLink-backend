export function getClientIp(req: any): string | null {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    null
  );
}
