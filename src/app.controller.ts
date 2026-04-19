import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from "@nestjs/terminus";

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private db: TypeOrmHealthIndicator, // private microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  async healthCheck() {
    const helpCheckData = {};
    await this.health.check([
      async () => {
        const checkMemory = await this.memory.checkHeap("memory_heap", 8000 * 1024 * 1024);
        helpCheckData["memory_heap"] = checkMemory;
        return checkMemory;
      },
      async () => {
        const checkRSS = await this.memory.checkRSS("memory_rss", 8000 * 1024 * 1024);
        helpCheckData["memory_rss"] = checkRSS;
        return checkRSS;
      },
      async () => {
        const dbCheckLibrary = await this.db.pingCheck("library");
        helpCheckData["db_check_library"] = dbCheckLibrary;
        const dbCheckSequelize = await this.db.pingCheck("sequelize");
        helpCheckData["db_check_sequelize"] = dbCheckSequelize;
        return dbCheckLibrary;
      },
      // async () => {
      //   const checkRedis = await this.microservice.pingCheck<RedisOptions>("redis", {
      //     transport: Transport.REDIS,
      //     options: {
      //       host: process.env.REDIS_HOST,
      //       port: +process.env.REDIS_PORT,
      //     },
      //   });
      //   helpCheckData["redis"] = checkRedis;
      //   return checkRedis;
      // },
    ]);
    console.log("====> helpCheckData::: ", helpCheckData);
    return {
      data: helpCheckData,
    };
  }
}
