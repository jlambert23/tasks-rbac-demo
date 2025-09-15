import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY, REQUIRE_ROLE_KEY } from "./rbac.decorators";
import { RbacAuthService } from "./rbac-auth.service";
import { RoleName, AuthContext } from "@tasks/data";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<RoleName>(
      REQUIRE_ROLE_KEY,
      [context.getHandler(), context.getClass()]
    );

    const roles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole && !roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authContext: AuthContext = request.user;

    if (!authContext?.user?.role) {
      throw new ForbiddenException("User role not found");
    }

    if (requiredRole) {
      const hasPermission = RbacAuthService.hasRolePermission(
        authContext.user.role,
        requiredRole
      );
      if (!hasPermission) {
        throw new ForbiddenException(`Requires ${requiredRole} role or higher`);
      }
    }

    if (roles) {
      const hasRole = roles.includes(authContext.user.role.name as RoleName);
      if (!hasRole) {
        throw new ForbiddenException(`Requires one of: ${roles.join(", ")}`);
      }
    }

    return true;
  }
}
