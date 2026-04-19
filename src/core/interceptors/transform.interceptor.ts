import { Response } from "@common/dtos/base-response.dto";
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => ({
        error: res?.error || false,
        statusCode: res?.statusCode || context.switchToHttp().getResponse().statusCode,
        message: res?.message ?? (context.switchToHttp().getResponse().statusCode === HttpStatus.OK && "Success"),
        data: res?.data || null,
        pagination: res?.pagination,
      })),
    );
  }
}
