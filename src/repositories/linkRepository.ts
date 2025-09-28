// src/repositories/linkRepository.ts
import { PrismaClient, Link, Click } from "@prisma/client";

const prisma = new PrismaClient();

export class LinkRepository {
  async create(data: {
    original: string;
    shortCode: string;
    userId?: number;
    customAlias?: string | null;
    expiresAt?: Date | null;
  }): Promise<Link> {
    return prisma.link.create({
      data: {
        original: data.original,
        shortCode: data.shortCode,
        customAlias: data.customAlias,
        userId: data.userId,
        expiresAt: data.expiresAt,
        clicksCount: 0,
      },
    });
  }

  async findByShortCode(shortCode: string): Promise<Link | null> {
    return prisma.link.findUnique({
      where: { shortCode: shortCode },
    });
  }

  async findByCustomAlias(customAlias: string): Promise<Link | null> {
    return prisma.link.findUnique({
      where: { customAlias: customAlias },
    });
  }

  async findById(id: number) {
    const link = await prisma.link.findUnique({
      where: { id },
    });
    return link;
  }

  async incrementClicks(linkId: number): Promise<Link> {
    try {
      const updatedLink = await prisma.link.update({
        where: { id: linkId },
        data: {
          clicksCount: {
            increment: 1,
          },
        },
      });
      return updatedLink;
    } catch (error: any) {
      throw error;
    }
  }

  async createClick(data: {
    linkId: number;
    ip: string;
    userAgent?: string | null;
    browser?: string | null;
    os?: string | null;
    device?: string | null;
    country?: string | null;
    city?: string | null;
    referrer?: string | null; // ✅ tambahin
  }): Promise<Click> {
    try {
      const newClick = await prisma.click.create({
        data: {
          linkId: data.linkId,
          ipAddress: data.ip,
          userAgent: data.userAgent,
          browser: data.browser,
          os: data.os,
          device: data.device,
          country: data.country,
          city: data.city,
          referrer: data.referrer, // ✅ simpan ke DB
          clickedAt: new Date(),
        },
      });

      return newClick;
    } catch (error: any) {
      throw error;
    }
  }

  async getClicksByLinkId(linkId: number): Promise<Click[]> {
    const clicks = await prisma.click.findMany({
      where: { linkId: linkId },
      orderBy: { clickedAt: "desc" },
    });
    return clicks;
  }

  async getLinksByUserId(userId: number): Promise<Link[]> {
    return prisma.link.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(
    linkId: number,
    data: {
      customAlias?: string | null;
      shortCode?: string;
      expiresAt?: Date | null;
      userId?: number | null;
    }
  ): Promise<Link> {
    const updateData: {
      customAlias?: string | null;
      shortCode?: string;
      expiresAt?: Date | null;
      userId?: number | null;
    } = {};

    if (data.customAlias !== undefined)
      updateData.customAlias = data.customAlias;
    if (data.shortCode !== undefined) updateData.shortCode = data.shortCode;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;
    if (data.userId !== undefined) updateData.userId = data.userId;

    try {
      return await prisma.link.update({
        where: { id: linkId },
        data: updateData,
      });
    } catch (err: any) {
      // Tangani error unik dari Prisma
      if (err.code === "P2002") {
        throw new Error("Alias already in use");
      }
      if (err.code === "P2025") {
        throw new Error("Link not found");
      }

      throw err; // lempar error lain ke service
    }
  }

  async delete(linkId: number): Promise<void> {
    await prisma.click.deleteMany({
      where: { linkId: linkId },
    });
    await prisma.link.delete({
      where: { id: linkId },
    });
  }
}
