import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  pennkey: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
        pennkey?: string;
        tokenPayload?: TokenPayload;
    }
  }
}

function getJwtSecret(): string {
    const secret = process.env.JWT_TOKEN_SECRET;
    if (!secret) {
        throw new Error("JWT_TOKEN_SECRET is not defined in environment variables");
    }
    return secret;
}

export function generateToken(pennkey: string): string {
    return jwt.sign({ pennkey }, getJwtSecret(), { expiresIn: '24h' });
}

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers['authorization'];

    // Check if the authorization header is present
    if (!authHeader) {
        return res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Authorization header missing",
        });
    }

    const [scheme, token] = authHeader.split(' ');

  // Invalid/malformed header
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Malformed Authorization header. Expected: Bearer <token>",
    });
  }

  try {
    // Verify signature + expiration
    const payload = jwt.verify(token, getJwtSecret()) as TokenPayload;

    // If somehow no pennkey was encoded (should never happen if your /token route is correct)
    if (!payload.pennkey) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Token missing pennkey information",
      });
    }

    // Attach pennkey + full payload to the request for downstream use
    req.pennkey = payload.pennkey;
    req.tokenPayload = payload;

    next();
  } catch {
    // Signature invalid, expired token, malformed token, etc.
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
}