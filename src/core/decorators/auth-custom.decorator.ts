import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RolesGuard } from "@core/guards/roles.guard";
import { JwtAuthGuard } from "@core/guards/jwt-auth.guard";
import { UserRoleEnum } from "@common/constans/enum.constant";

export function AuthCustom(...roles: UserRoleEnum[]) {
  return applyDecorators(SetMetadata("roles", roles), UseGuards(JwtAuthGuard, RolesGuard), ApiBearerAuth());
}
