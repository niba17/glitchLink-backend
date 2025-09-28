import { Router } from "express";
import { LinkController } from "../controllers/linkController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const linkController = new LinkController();

// Endpoint opsional (boleh anonymous)
router.post(
  "/",
  authMiddleware({ optional: true }),
  linkController.createShortLink
);

// Endpoint wajib login
router.put("/import", authMiddleware(), linkController.importGuestLink);
router.put("/:linkId", authMiddleware(), linkController.updateLink);
router.get("/:linkId/qrcode", authMiddleware(), linkController.generateQRCode);
router.get("/", authMiddleware(), linkController.getUserLinks);
router.get(
  "/:linkId/analytics",
  authMiddleware(),
  linkController.getLinkAnalytics
);
router.get("/analytics", authMiddleware(), linkController.getAllLinkAnalytics);
router.delete("/:linkId", authMiddleware(), linkController.deleteLink);
router.get(
  "/generate-code",
  authMiddleware({ optional: true }),
  linkController.generateCode
);

router.get("/validate/:shortCode", linkController.validateShortCode);

// Endpoint publik redirect tanpa auth
// router.get("/:shortCode", linkController.redirectToOriginalUrl);

export default router;
