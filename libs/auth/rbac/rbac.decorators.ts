import { SetMetadata } from "@nestjs/common";
import { RoleName } from "@tasks/data";

export const ROLES_KEY = "roles";
export const REQUIRE_ROLE_KEY = "requireRole";

export const RequireRole = (role: RoleName) =>
  SetMetadata(REQUIRE_ROLE_KEY, role);

export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
