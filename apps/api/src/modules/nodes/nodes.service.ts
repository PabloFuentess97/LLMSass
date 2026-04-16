import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateNodeDto, UpdateNodeDto } from "./dto";

@Injectable()
export class NodesService {
  constructor(private prisma: PrismaService) {}

  list(tenantId: string) {
    return this.prisma.node.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(tenantId: string, id: string) {
    const node = await this.prisma.node.findFirst({ where: { id, tenantId } });
    if (!node) throw new NotFoundException("node_not_found");
    return node;
  }

  create(tenantId: string, dto: CreateNodeDto) {
    return this.prisma.node.create({
      data: {
        tenantId,
        name: dto.name,
        endpoint: dto.endpoint,
        controlUrl: dto.controlUrl,
        capacity: dto.capacity as any,
        tags: dto.tags ?? [],
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateNodeDto) {
    await this.findOne(tenantId, id);
    return this.prisma.node.update({ where: { id }, data: dto as any });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.node.delete({ where: { id } });
    return { ok: true };
  }

  async sendCommand(
    tenantId: string,
    id: string,
    command: "restart" | "pause" | "resume",
  ) {
    const node = await this.findOne(tenantId, id);
    // TODO: enqueue signed control webhook to node.controlUrl via BullMQ.
    const nextStatus =
      command === "pause" ? "PAUSED" : command === "resume" ? "ACTIVE" : node.status;
    return this.prisma.node.update({
      where: { id },
      data: { status: nextStatus },
    });
  }
}
