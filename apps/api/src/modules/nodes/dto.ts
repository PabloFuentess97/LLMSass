import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";

export class CreateNodeDto {
  @IsString()
  @MaxLength(64)
  name!: string;

  @IsUrl({ require_tld: false })
  endpoint!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  controlUrl?: string;

  @IsObject()
  capacity!: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateNodeDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsUrl({ require_tld: false }) endpoint?: string;
  @IsOptional() @IsUrl({ require_tld: false }) controlUrl?: string;
  @IsOptional() @IsObject() capacity?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
}
