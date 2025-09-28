import { Request, Response, NextFunction } from "express";
import { LinkService } from "../services/linkService";
import {
  createShortLinkSchema,
  updateLinkSchema,
  importGuestLinkSchema,
} from "../DTOs/linkDTO";
import { z, ZodError } from "zod";

export class LinkController {
  private linkService = new LinkService();

  generateCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = await this.linkService.generateAvailableCode();

      return res.status(201).json({
        status: "success",
        message: "Short code generated successfully",
        data: { code },
      });
    } catch (error) {
      next(error);
    }
  };

  createShortLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      const validatedData = createShortLinkSchema.parse(req.body);
      const newLink = await this.linkService.createShortLink(
        validatedData,
        userId
      );

      res.status(201).json({
        status: "success",
        message: "Short link created successfully",
        data: newLink,
      });
    } catch (error) {
      next(error);
    }
  };

  updateLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      const linkId = Number(req.params.linkId);
      const validatedData = updateLinkSchema.parse(req.body);
      const updatedLink = await this.linkService.updateLink(
        linkId,
        userId,
        validatedData
      );

      res.status(200).json({
        status: "success",
        message: "Link updated successfully",
        data: updatedLink,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      const linkId = Number(req.params.linkId);
      await this.linkService.deleteLink(linkId, userId);

      res
        .status(200)
        .json({ status: "success", message: "Link deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  generateQRCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      const linkId = Number(req.params.linkId);
      const qrCodeDataUrl = await this.linkService.generateQRCodeForLink(
        linkId,
        userId
      );

      res.status(200).json({
        status: "success",
        message: "QR Code generated successfully",
        data: qrCodeDataUrl,
      });
    } catch (error) {
      next(error);
    }
  };

  validateShortCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const link = await this.linkService.findByShortCode(req.params.shortCode);

      if (!link) {
        return res.status(404).json({
          status: "error",
          valid: false,
          message: "Link not found",
        });
      }

      if (link.expiresAt && new Date() > link.expiresAt) {
        return res.status(400).json({
          status: "error",
          valid: false,
          message: "Link expired",
        });
      }

      return res.json({
        status: "success",
        valid: true,
        message: "Link active",
      });
    } catch (error) {
      next(error);
    }
  };

  redirectToOriginalUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const originalUrl = await this.linkService.getOriginalUrl(
        req.params.shortCode,
        req
      );
      res.redirect(originalUrl);
    } catch (error) {
      next(error);
    }
  };

  getUserLinks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      const userLinks = await this.linkService.getUserLinks(userId);

      res.status(200).json({
        status: "success",
        message: "Links retrieved successfully",
        data: userLinks,
      });
    } catch (error) {
      next(error);
    }
  };

  getLinkAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      const linkId = Number(req.params.linkId);
      const analyticsData = await this.linkService.getLinkAnalytics(
        linkId,
        userId
      );

      res.status(200).json({
        status: "success",
        message: "Link analytics retrieved successfully",
        data: analyticsData,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllLinkAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      const analyticsData = await this.linkService.getAllLinkAnalytics(userId);

      res.status(200).json({
        status: "success",
        message: "All link analytics retrieved successfully",
        data: analyticsData,
      });
    } catch (error) {
      next(error);
    }
  };

  importGuestLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = Number(req.user?.id);
      if (!userId || isNaN(userId)) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return; // <-- optional, hanya untuk menghentikan eksekusi
      }

      const validatedData = importGuestLinkSchema.parse(req.body);

      // Panggil service, hanya mengembalikan mapped link
      const importedLink = await this.linkService.importGuestLink(
        validatedData.linkId,
        userId,
        validatedData.customAlias ?? undefined
      );

      res.status(200).json({
        status: "success",
        message: "Guest link imported successfully",
        data: importedLink,
      });

      // jangan pakai `return res.status(...).json(...)`
    } catch (error) {
      next(error);
    }
  };
}
