// roles-permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import { CustomHttpException } from "@common/exceptions/custom-http.exception";

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new CustomHttpException("User not authenticated", "USER_NOT_AUTH");
    }

    // Nếu không yêu cầu role hay permission gì thì cho qua
    if ((!requiredRoles || requiredRoles.length === 0) && (!requiredPermissions || requiredPermissions.length === 0)) {
      return true;
    }

    const roleCode = user.role?.code?.toUpperCase();
    const isAdmin = roleCode === 'ADMIN' || roleCode === 'SUPERADMIN';

    // Admin có toàn quyền
    if (isAdmin) {
      return true;
    }

    let hasRole = false;
    if (requiredRoles && requiredRoles.length > 0) {
      hasRole = requiredRoles.includes(roleCode);
    }

    let hasPermission = false;
    if (requiredPermissions && requiredPermissions.length > 0) {
      hasPermission = requiredPermissions.some((perm) => user.permissions?.includes(perm));
    }

    // Nếu endpoint chỉ yêu cầu role, check role
    if (requiredRoles && requiredRoles.length > 0 && (!requiredPermissions || requiredPermissions.length === 0)) {
      if (hasRole) return true;
    }
    
    // Nếu endpoint chỉ yêu cầu permission, check permission
    if (requiredPermissions && requiredPermissions.length > 0 && (!requiredRoles || requiredRoles.length === 0)) {
      if (hasPermission) return true;
    }

    // Nếu yêu cầu cả hai, thì user cần thỏa mãn MỘT TRONG HAI (Role hoặc Permission)
    if (requiredRoles && requiredRoles.length > 0 && requiredPermissions && requiredPermissions.length > 0) {
      if (hasRole || hasPermission) return true;
    }

    throw new CustomHttpException("You do not have the required permission", "NOT_PERMISSION");
  }
}
