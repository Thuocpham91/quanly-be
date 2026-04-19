import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { CustomHttpException } from "@common/exceptions/custom-http.exception";
import { ErrorCode } from "@common/constans/message-code.enum";

@Catch()
export class ExceptionsLoggerFilter implements ExceptionFilter {
  private readonly logger = new Logger("ExceptionFilter");

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine HTTP status
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorCode: string;
    let message: string;

    // Map standard HTTP status codes to ErrorCode enum
    const mapHttpStatusToErrorCode = (status: number): ErrorCode => {
      switch (status) {
        case 400:
          return ErrorCode.BAD_REQUEST;
        case 401:
          return ErrorCode.UNAUTHORIZED;
        case 403:
          return ErrorCode.FORBIDDEN;
        case 404:
          return ErrorCode.NOT_FOUND;
        case 500:
          return ErrorCode.INTERNAL_SERVER_ERROR;
        default:
          return ErrorCode.UNKNOWN_ERROR;
      }
    };

    if (exception instanceof CustomHttpException) {
      errorCode = exception.errorCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const data = typeof res === "string" ? { message: res } : (res as any);

      message = data.message || exception.message;
      errorCode = data.errorCode || mapHttpStatusToErrorCode(status);
    } else {
      message = exception?.message || "Internal server error";
      errorCode = ErrorCode.UNKNOWN_ERROR;
    }

    const errorResponse = {
      statusCode: status,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log the exception
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception.stack || message, JSON.stringify(errorResponse));
    } else {
      this.logger.warn(`${request.method} ${request.url} ${message}`, JSON.stringify(errorResponse));
    }

    response.status(status).send(errorResponse);
  }
}
