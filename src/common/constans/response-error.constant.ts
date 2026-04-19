import { HttpStatus } from "@nestjs/common";

export const serverInternalError = {
  error: true,
  message: "Internal server error",
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
};
