import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface AuthPrincipal {
  userId: string;
  tenantId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  apiKeyId?: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPrincipal => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as AuthPrincipal;
  },
);
