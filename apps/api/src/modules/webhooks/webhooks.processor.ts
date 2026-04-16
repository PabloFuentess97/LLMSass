import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class WebhooksProcessor {
  private readonly log = new Logger(WebhooksProcessor.name);
  // BullMQ worker stub for outbound webhook delivery: HMAC sign, POST, retry w/ backoff.
  constructor() {
    this.log.log("WebhooksProcessor ready");
  }
}
