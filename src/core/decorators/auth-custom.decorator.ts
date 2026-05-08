import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RolesPermissionsGuard } from "@core/guards/roles-permissions.guard";
import { JwtAuthGuard } from "@core/guards/jwt-auth.guard";
import { UserRoleEnum } from "@common/constans/enum.constant";

export function AuthCustom(...roles: UserRoleEnum[]) {
  return applyDecorators(SetMetadata("roles", roles), UseGuards(JwtAuthGuard, RolesPermissionsGuard), ApiBearerAuth());
}
