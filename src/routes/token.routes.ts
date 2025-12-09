import { Router, Request, Response } from "express";
import { generateToken } from "../auth";

const router = Router();

// POST /token
router.post("/", (req: Request, res: Response) => {
  const { pennkey } = req.body ?? {};

  // Validate request body
  if (!pennkey || typeof pennkey !== "string") {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Missing or invalid 'pennkey' in request body",
    });
  }

  // Generate JWT token
  const token = generateToken(pennkey);

  // Spec usually expects 201 CREATED for creation
  return res.status(201).json({ token });
});

export default router;