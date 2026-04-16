import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { AiProviderRegistry } from "./ai-provider.registry";

@Module({
  controllers: [ChatController],
  providers: [ChatService, AiProviderRegistry],
  exports: [ChatService],
})
export class ChatModule {}
