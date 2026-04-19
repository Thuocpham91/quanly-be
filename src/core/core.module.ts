import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { ExceptionsLoggerFilter } from "./filter/exception-logger.filter";
import { ValidationPipe } from "./pipes/validation.pipe";
import { HttpModule } from "@nestjs/axios";
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 20,
        limit: 100,
      },
    ]),
    ConfigModule,
    HttpModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [],
})
export class CoreModule {}
