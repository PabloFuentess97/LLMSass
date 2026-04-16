import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { NodesModule } from "./modules/nodes/nodes.module";
import { AgentsModule } from "./modules/agents/agents.module";
import { ChatModule } from "./modules/chat/chat.module";
import { BillingModule } from "./modules/billing/billing.module";
import { WebhooksModule } from "./modules/webhooks/webhooks.module";
import { RealtimeModule } from "./realtime/realtime.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: { transport: { target: "pino-pretty", options: { singleLine: true } } },
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    NodesModule,
    AgentsModule,
    ChatModule,
    BillingModule,
    WebhooksModule,
    RealtimeModule,
  ],
})
export class AppModule {}
