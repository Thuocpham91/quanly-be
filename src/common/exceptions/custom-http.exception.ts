import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomHttpException extends HttpException {
  errorCode: string;

  constructor(
    message: string = "Request failed",
    errorCode: string = "AUTH_401",
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        error: true,
        statusCode: status,
        message,
        errorCode,
      },
      status,
    );

    this.errorCode = errorCode;
  }
}
