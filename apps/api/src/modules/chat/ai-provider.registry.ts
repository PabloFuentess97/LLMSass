import { Injectable, NotFoundException } from "@nestjs/common";

export interface ChatInput {
  model: string;
  systemPrompt: string;
  messages: { role: "user" | "assistant" | "tool" | "system"; content: string }[];
  temperature: number;
  tools?: string[];
}

export interface ChatChunk {
  type: "token" | "tool_call" | "done";
  delta?: string;
  toolCall?: { name: string; args: unknown };
  usage?: { inputTokens: number; outputTokens: number };
}

export interface AiProvider {
  chat(input: ChatInput): AsyncIterable<ChatChunk>;
}

@Injectable()
export class AiProviderRegistry {
  // Resolves `openai:gpt-4.1` → OpenAiProvider, `anthropic:claude-sonnet-4-6` → AnthropicProvider, etc.
  // Real provider implementations land in Phase 3.
  resolve(model: string): AiProvider {
    const [vendor] = model.split(":");
    if (!vendor) throw new NotFoundException("invalid_model");
    return mockProvider;
  }
}

const mockProvider: AiProvider = {
  async *chat(input) {
    const text = `echo: ${input.messages.at(-1)?.content ?? ""}`;
    for (const ch of text) {
      yield { type: "token", delta: ch };
    }
    yield {
      type: "done",
      usage: { inputTokens: input.messages.length * 10, outputTokens: text.length },
    };
  },
};
