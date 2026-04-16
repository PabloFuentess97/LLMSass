import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CurrentUser, AuthPrincipal } from "../../common/decorators/current-user.decorator";
import { ChatService } from "./chat.service";
import { SendMessageDto } from "./dto";

@ApiTags("chat")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get("conversations")
  listConversations(@CurrentUser() u: AuthPrincipal) {
    return this.chat.listConversations(u.tenantId);
  }

  @Post("chat")
  async send(
    @CurrentUser() u: AuthPrincipal,
    @Body() dto: SendMessageDto,
    @Res() res: Response,
  ) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    for await (const chunk of this.chat.send(u.tenantId, u.userId, dto)) {
      res.write(`event: ${chunk.type}\n`);
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.end();
  }
}
