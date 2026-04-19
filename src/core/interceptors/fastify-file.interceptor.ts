import { CallHandler, ExecutionContext, Inject, mixin, NestInterceptor, Optional, Type } from "@nestjs/common";
import { Observable } from "rxjs";
import FastifyMulter from "fastify-multer";
import { Multer } from "multer";
import { ApiProperty } from "@nestjs/swagger";
import { Options } from "fastify-multer/lib/interfaces";

// you can add validate using class-validator
export class SingleFileDto {
  @ApiProperty({ type: "string", format: "binary" })
  file: string;
}

type MulterInstance = any;
export function FastifyFileInterceptor(fieldName: string, localOptions: Options): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject("MULTER_MODULE_OPTIONS")
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions });
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) =>
        this.multer.single(fieldName)(ctx.getRequest(), ctx.getResponse(), (error: any) => {
          if (error) {
            return reject(new Error(`File upload error: ${error.message}`));
          }
          resolve();
        }),
      );

      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
