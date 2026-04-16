import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto, RegisterDto } from "./dto";
import type { AuthPrincipal } from "../../common/decorators/current-user.decorator";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException("email_taken");

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash },
    });
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.tenantName,
        slug: dto.tenantName.toLowerCase().replace(/\s+/g, "-"),
        memberships: {
          create: { userId: user.id, role: "OWNER" },
        },
      },
    });
    return this.issueTokens(user.id, tenant.id, "OWNER");
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { memberships: true },
    });
    if (!user) throw new UnauthorizedException("invalid_credentials");
    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) throw new UnauthorizedException("invalid_credentials");

    const membership = user.memberships[0];
    if (!membership) throw new UnauthorizedException("no_tenant");
    return this.issueTokens(user.id, membership.tenantId, membership.role);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh",
      });
      return this.issueTokens(payload.sub, payload.tenantId, payload.role);
    } catch {
      throw new UnauthorizedException("invalid_refresh_token");
    }
  }

  async me(principal: AuthPrincipal) {
    const user = await this.prisma.user.findUnique({
      where: { id: principal.userId },
      select: { id: true, email: true, name: true, avatarUrl: true },
    });
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: principal.tenantId },
      select: { id: true, name: true, slug: true },
    });
    return { user, tenant, role: principal.role };
  }

  private issueTokens(
    userId: string,
    tenantId: string,
    role: "OWNER" | "ADMIN" | "MEMBER",
  ) {
    const accessToken = this.jwt.sign({ sub: userId, tenantId, role });
    const refreshToken = this.jwt.sign(
      { sub: userId, tenantId, role },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh",
        expiresIn: process.env.JWT_REFRESH_TTL ?? "30d",
      },
    );
    return { accessToken, refreshToken };
  }
}
