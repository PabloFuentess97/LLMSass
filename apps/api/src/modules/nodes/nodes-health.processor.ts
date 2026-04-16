import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class NodesHealthProcessor {
  private readonly log = new Logger(NodesHealthProcessor.name);
  // BullMQ worker stub — actual queue wiring lands in Phase 2.
  // Consumes `nodes-health` jobs, pings endpoints, updates Node.status, publishes events.
  constructor() {
    this.log.log("NodesHealthProcessor ready");
  }
}
