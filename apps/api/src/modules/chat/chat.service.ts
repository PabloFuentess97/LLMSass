import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AiProviderRegistry, ChatChunk } from "./ai-provider.registry";
import { SendMessageDto } from "./dto";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private providers: AiProviderRegistry) {}

  async *send(
    tenantId: string,
    userId: string,
    dto: SendMessageDto,
  ): AsyncIterable<ChatChunk> {
    const agent = await this.prisma.agent.findFirst({
      where: { id: dto.agentId, tenantId },
    });
    if (!agent) throw new NotFoundException("agent_not_found");

    const conversation = dto.conversationId
      ? await this.prisma.conversation.findFirst({
          where: { id: dto.conversationId, tenantId },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        })
      : await this.prisma.conversation.create({
          data: {
            tenantId,
            agentId: agent.id,
            createdBy: userId,
            title: dto.message.slice(0, 48),
          },
          include: { messages: true },
        });
    if (!conversation) throw new NotFoundException("conversation_not_found");

    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: dto.message,
      },
    });

    const provider = this.providers.resolve(agent.model);
    const stream = provider.chat({
      model: agent.model,
      systemPrompt: agent.systemPrompt,
      temperature: agent.temperature,
      tools: agent.tools,
      messages: [
        ...conversation.messages.map((m) => ({
          role: m.role.toLowerCase() as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: dto.message },
      ],
    });

    let assistantBuffer = "";
    let usage: ChatChunk["usage"];
    for await (const chunk of stream) {
      if (chunk.type === "token" && chunk.delta) assistantBuffer += chunk.delta;
      if (chunk.type === "done") usage = chunk.usage;
      yield chunk;
    }

    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: assistantBuffer,
        tokensIn: usage?.inputTokens ?? 0,
        tokensOut: usage?.outputTokens ?? 0,
      },
    });
  }

  listConversations(tenantId: string) {
    return this.prisma.conversation.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    });
  }
}
