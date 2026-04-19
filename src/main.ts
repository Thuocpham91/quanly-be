import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import multipart from "@fastify/multipart";
import { join } from "path";
import fastifyStatic from "@fastify/static";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require("morgan");

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 100 * 1024 * 1024, // 100MB
    }),
  );

  // @ts-ignore

  app.enableShutdownHooks();
  app.use(morgan("dev"));

  app.enableCors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["authorization", "content-type", "x-custom-lang"],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Start microservices
  await app.startAllMicroservices();

  // Thêm global prefix
  app.setGlobalPrefix("api/v1/");

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.register(multipart, {
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB
    },
  });

  app.register(fastifyStatic, {
    root: join(process.cwd(), "public"),
    prefix: "/", // QUAN TRỌNG
  });

  await app.listen(app.get(ConfigService).get<number>("PORT"), "0.0.0.0");

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger is ${await app.getUrl()}/api/docs`);
}
bootstrap();
