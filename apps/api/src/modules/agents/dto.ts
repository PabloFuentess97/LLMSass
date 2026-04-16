import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateAgentDto {
  @IsString() name!: string;
  @IsString() role!: string;
  @IsString() systemPrompt!: string;
  @IsString() model!: string;

  @IsOptional() @IsString() nodeId?: string;

  @IsNumber() @Min(0) @Max(2)
  temperature: number = 0.7;

  @IsArray() tools: string[] = [];

  @IsOptional() @IsObject() memory?: Record<string, unknown>;
  @IsOptional() @IsObject() limits?: Record<string, unknown>;
}

export class UpdateAgentDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() systemPrompt?: string;
  @IsOptional() @IsString() model?: string;
  @IsOptional() @IsString() nodeId?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(2) temperature?: number;
  @IsOptional() @IsArray() tools?: string[];
  @IsOptional() @IsObject() memory?: Record<string, unknown>;
  @IsOptional() @IsObject() limits?: Record<string, unknown>;
}
