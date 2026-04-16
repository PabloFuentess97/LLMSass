import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class SendMessageDto {
  @IsString() agentId!: string;
  @IsOptional() @IsString() conversationId?: string;
  @IsString() message!: string;
  @IsOptional() @IsArray() attachments?: string[];
  @IsOptional() @IsBoolean() stream?: boolean;
}
