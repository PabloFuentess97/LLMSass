// Shared DTO contracts mirrored between apps/web and apps/api.

export type NodeStatus =
  | "REGISTERED"
  | "ACTIVE"
  | "BUSY"
  | "PAUSED"
  | "INACTIVE"
  | "ERROR";

export type AgentStatus = "ACTIVE" | "INACTIVE";

export type Role = "OWNER" | "ADMIN" | "MEMBER";

export interface NodeCapacity {
  cpu: number;
  ramGb: number;
  gpu?: string;
}

export interface NodeDto {
  id: string;
  name: string;
  endpoint: string;
  controlUrl?: string;
  status: NodeStatus;
  capacity: NodeCapacity;
  tags: string[];
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NodeMetricDto {
  cpuPct: number;
  ramPct: number;
  gpuPct?: number;
  latencyMs: number;
  tokensProcessed: number;
  at: string;
}

export interface AgentDto {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  model: string;
  nodeId?: string;
  temperature: number;
  tools: string[];
  memory?: Record<string, unknown>;
  limits?: Record<string, unknown>;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDto {
  id: string;
  agentId: string;
  title: string | null;
  updatedAt: string;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  role: "SYSTEM" | "USER" | "ASSISTANT" | "TOOL";
  content: string;
  tokensIn: number;
  tokensOut: number;
  createdAt: string;
}

export interface PageResult<T> {
  data: T[];
  nextCursor: string | null;
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
}
