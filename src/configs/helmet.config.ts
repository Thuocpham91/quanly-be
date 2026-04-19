import { NestFastifyApplication } from "@nestjs/platform-fastify/interfaces/nest-fastify-application.interface";
import fastifyHelmet from "@fastify/helmet";

export const useHelmet = async (app: NestFastifyApplication) => {
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"],
      },
    },
  });
};
