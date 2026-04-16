import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAgentDto, UpdateAgentDto } from "./dto";

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  list(tenantId: string) {
    return this.prisma.agent.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findOne(tenantId: string, id: string) {
    const agent = await this.prisma.agent.findFirst({ where: { id, tenantId } });
    if (!agent) throw new NotFoundException("agent_not_found");
    return agent;
  }

  async create(tenantId: string, userId: string, dto: CreateAgentDto) {
    const agent = await this.prisma.agent.create({
      data: {
        tenantId,
        name: dto.name,
        role: dto.role,
        systemPrompt: dto.systemPrompt,
        model: dto.model,
        nodeId: dto.nodeId,
        temperature: dto.temperature,
        tools: dto.tools,
        memory: dto.memory as any,
        limits: dto.limits as any,
      },
    });
    await this.prisma.agentVersion.create({
      data: { agentId: agent.id, config: dto as any, createdBy: userId },
    });
    return agent;
  }

  async update(tenantId: string, userId: string, id: string, dto: UpdateAgentDto) {
    await this.findOne(tenantId, id);
    const agent = await this.prisma.agent.update({
      where: { id },
      data: dto as any,
    });
    await this.prisma.agentVersion.create({
      data: { agentId: id, config: dto as any, createdBy: userId },
    });
    return agent;
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.agent.delete({ where: { id } });
    return { ok: true };
  }

  async setStatus(tenantId: string, id: string, status: "ACTIVE" | "INACTIVE") {
    await this.findOne(tenantId, id);
    return this.prisma.agent.update({ where: { id }, data: { status } });
  }
}
