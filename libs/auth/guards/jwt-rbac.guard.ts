import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../jwt';
import { ROLES_KEY, REQUIRE_ROLE_KEY } from '../rbac/rbac.decorators';
import { RoleName } from '@tasks/data';

@Injectable()
export class JwtRbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Check for role requirements
    const requiredRole = this.reflector.getAllAndOverride<RoleName>(REQUIRE_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const roles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('JwtRbacGuard - requiredRole:', requiredRole, 'roles:', roles);

    // If no role requirements, allow access
    if (!requiredRole && !roles) {
      console.log('No role requirements found, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Check for JWT token
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = this.jwtService.extractTokenFromHeader(authHeader);
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const payload = this.jwtService.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Check role requirements based on JWT payload
    if (requiredRole) {
      if (!this.hasRolePermission(payload.role as RoleName, requiredRole)) {
        throw new ForbiddenException(`Requires ${requiredRole} role or higher`);
      }
    }

    if (roles) {
      if (!roles.includes(payload.role as RoleName)) {
        throw new ForbiddenException(`Requires one of: ${roles.join(', ')}`);
      }
    }

    // Attach JWT payload to request for potential use by controllers
    request.jwtPayload = payload;
    
    return true;
  }

  /**
   * Simple role hierarchy check based on role names
   * Owner > Admin > Viewer
   */
  private hasRolePermission(userRole: RoleName, requiredRole: RoleName): boolean {
    const roleHierarchy = {
      owner: 3,
      admin: 2,
      viewer: 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
}