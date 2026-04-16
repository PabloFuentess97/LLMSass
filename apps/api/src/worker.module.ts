import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { PrismaModule } from "./prisma/prisma.module";
import { NodesHealthProcessor } from "./modules/nodes/nodes-health.processor";
import { WebhooksProcessor } from "./modules/webhooks/webhooks.processor";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule.forRoot(), PrismaModule],
  providers: [NodesHealthProcessor, WebhooksProcessor],
})
export class WorkerModule {}
