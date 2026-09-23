import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { configTypeORM } from "./configs";
import { DatabaseModule } from "./database/database.module";

import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ObjectModule } from "./modules/object/object.module";
import { WorkModule } from "./modules/work/work.module";
import { OrderModule } from "./modules/order/order.module";
import { RoleModule } from "./modules/role/role.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { MilestoneModule } from "./modules/milestone/milestone.module";
import { MonthlyPayoutModule } from "./modules/monthly-payout/monthly-payout.module";
import { ChickenPriceModule } from "./modules/chicken-price/chicken-price.module";
import { FileModule } from "@modules/file/file.module";
import { ExpenseModule } from "./modules/expense/expense.module";
import { CallHistoryModule } from "./modules/call-history/call-history.module";
import { SocialModule } from "./modules/social/social.module";
import { QrConfigModule } from "./modules/qr-config/qr-config.module";

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forRoot({
      ...configTypeORM,
      subscribers: [],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env.sit", ".env"],
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("MAIL_HOST") || "smtp.gmail.com",
          port: Number(configService.get<number>("MAIL_PORT") || 587),
          secure: false,
          auth: {
            user: configService.get<string>("MAIL_USER") || "phamvuthuoc91@gmail.com",
            pass: configService.get<string>("MAIL_PASS") || "",
          },
        },
        defaults: {
          from: configService.get<string>("MAIL_FROM") || "phamvuthuoc91@gmail.com",
        },
      }),
    }),

    DatabaseModule,
    UserModule,
    AuthModule,
    ObjectModule,
    WorkModule,
    OrderModule,
    RoleModule,
    CustomerModule,
    MilestoneModule,
    MonthlyPayoutModule,
    ChickenPriceModule,
    FileModule,
    ExpenseModule,
    CallHistoryModule,
    SocialModule,
    QrConfigModule,
  ],
})
export class AppModule {}
