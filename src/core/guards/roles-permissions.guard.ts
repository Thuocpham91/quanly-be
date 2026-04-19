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

    const { user } = context.switchToHttp().getRequest();
    console.log(user);

    if (!user) {
      throw new CustomHttpException("User not authenticated", "USER_NOT_AUTH");
    }
    let checkPermission: boolean = false;
    // Kiểm tra role
    if (requiredRoles && requiredRoles.some((role) => user.role?.includes(role))) {
      checkPermission = true;
    }

    // Kiểm tra permission
    if (requiredPermissions && requiredPermissions.some((perm) => user.permissions?.includes(perm))) {
      checkPermission = true;
    }
    if (checkPermission == false)
      throw new CustomHttpException("You do not have the required permission", "NOT_PERMISSION");

    return true;
  }
}
