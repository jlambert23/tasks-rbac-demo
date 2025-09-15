import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "./jwt.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("No authorization header");
    }

    const token = this.jwtService.extractTokenFromHeader(authHeader);
    if (!token) {
      throw new UnauthorizedException("Invalid token format");
    }

    const payload = this.jwtService.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    request.jwtPayload = payload;
    return true;
  }
}
