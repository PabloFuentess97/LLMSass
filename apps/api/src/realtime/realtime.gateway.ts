import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import type { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly log = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    // TODO: validate Bearer from handshake.auth.token, join tenant room.
    const tenantId = client.handshake.auth?.tenantId as string | undefined;
    if (tenantId) client.join(`tenant:${tenantId}`);
    this.log.log(`client connected ${client.id} tenant=${tenantId ?? "-"}`);
  }

  handleDisconnect(client: Socket) {
    this.log.log(`client disconnected ${client.id}`);
  }

  emitNodeStatus(tenantId: string, payload: unknown) {
    this.server.to(`tenant:${tenantId}`).emit("node.status", payload);
  }

  emitNodeMetrics(tenantId: string, payload: unknown) {
    this.server.to(`tenant:${tenantId}`).emit("node.metrics", payload);
  }
}
