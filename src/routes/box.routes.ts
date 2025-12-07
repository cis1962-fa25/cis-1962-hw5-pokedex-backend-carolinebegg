import { Router } from "express";
import { authenticateToken } from "../auth";
import {
  listBoxEntries,
  createBoxEntry,
  getBoxEntry,
  updateBoxEntry,
  deleteBoxEntry,
  clearBoxEntries,
} from "../controllers/box.controller";

const router = Router();

// all /box routes require auth
router.use(authenticateToken);

router.get("/", listBoxEntries);
router.post("/", createBoxEntry);
router.get("/:id", getBoxEntry);
router.put("/:id", updateBoxEntry);
router.delete("/:id", deleteBoxEntry);
router.delete("/", clearBoxEntries);

export default router;