import { RoleEntity, RoleName } from "@tasks/data";

export class RbacAuthService {
  static hasRolePermission(
    userRole: RoleEntity,
    requiredRole: RoleName
  ): boolean {
    if (userRole.name === requiredRole) {
      return true;
    }

    return this.inheritsRole(userRole, requiredRole);
  }

  private static inheritsRole(role: RoleEntity, targetRole: RoleName): boolean {
    if (!role.children || role.children.length === 0) {
      return false;
    }

    for (const child of role.children) {
      if (child.name === targetRole) {
        return true;
      }

      if (this.inheritsRole(child, targetRole)) {
        return true;
      }
    }

    return false;
  }

  static getAccessibleRoles(userRole: RoleEntity): RoleName[] {
    const roles: RoleName[] = [userRole.name as RoleName];

    const collectRoles = (role: RoleEntity) => {
      if (role.children) {
        for (const child of role.children) {
          roles.push(child.name as RoleName);
          collectRoles(child);
        }
      }
    };

    collectRoles(userRole);
    return [...new Set(roles)];
  }
}
