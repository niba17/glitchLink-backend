import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatDateTime(
  date: Date | null,
  timeZone = "Asia/Jakarta"
): string | null {
  if (!date) return null;
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd HH:mm:ss");
}
