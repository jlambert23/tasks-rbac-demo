import { Injectable } from "@nestjs/common";
import { sign, verify, SignOptions } from "jsonwebtoken";

import { UserContext } from "@tasks/data";

export interface CustomJwtPayload {
  sub: number; // user id
  email?: string;
  role: string;
  iat?: number;
  exp?: number;
}

function isCustomJwtPayload(decoded: unknown): decoded is CustomJwtPayload {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    "sub" in decoded &&
    "role" in decoded
  );
}

@Injectable()
export class JwtService {
  private readonly secret = process.env.JWT_SECRET || "your-secret-key";
  private readonly expiresIn = parseInt(process.env.JWT_EXPIRES_IN || "86400"); // 24h in seconds

  generateToken(user: UserContext): string {
    const payload = {
      sub: user.id,
      role: user.role.name,
    };

    const options: SignOptions = {
      expiresIn: this.expiresIn,
    };

    return sign(payload, this.secret, options);
  }

  verifyToken(token: string): CustomJwtPayload | null {
    try {
      const decoded = verify(token, this.secret);
      return isCustomJwtPayload(decoded) ? decoded : null;
    } catch (error) {
      return null;
    }
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader) return null;
    const [type, token] = authHeader.split(" ");
    return type === "Bearer" && token ? token : null;
  }
}
