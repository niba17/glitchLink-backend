import type { Link } from "@prisma/client";
import { buildShortUrl } from "src/utils/buildShortUrl";

export const mapLinkToDto = (link: Link, baseUrl: string) => ({
  id: link.id,
  originalUrl: link.original,
  shortCode: link.shortCode,
  customAlias: link.customAlias,
  shortUrl: buildShortUrl(baseUrl, link.shortCode),
  userId: link.userId,
  expiresAt: link.expiresAt,
  createdAt: link.createdAt,
  updatedAt: link.updatedAt,
  clicksCount: link.clicksCount, // 👈 tambahin ini
});
