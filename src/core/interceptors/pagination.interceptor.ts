import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const query = context.switchToHttp().getRequest().query;
    const body = context.switchToHttp().getRequest().body;

    const params = { ...query, ...body };

    const { limit = 10, page = 1, skip, take } = params;

    query.limit = +limit;
    query.page = +page;
    query.skip = skip ? +skip : (+page - 1) * limit;
    query.take = take ? +take : +limit;

    if (body) {
      body.limit = +limit;
      body.page = +page;
      body.skip = skip ? +skip : (+page - 1) * limit;
      body.take = take ? +take : +limit;
    }

    return next.handle();
  }
}
