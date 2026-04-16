import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { CurrentUser, AuthPrincipal } from "../../common/decorators/current-user.decorator";
import { NodesService } from "./nodes.service";
import { CreateNodeDto, UpdateNodeDto } from "./dto";

@ApiTags("nodes")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller("nodes")
export class NodesController {
  constructor(private nodes: NodesService) {}

  @Get()
  list(@CurrentUser() u: AuthPrincipal) {
    return this.nodes.list(u.tenantId);
  }

  @Get(":id")
  get(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.nodes.findOne(u.tenantId, id);
  }

  @Roles("OWNER", "ADMIN")
  @Post()
  create(@CurrentUser() u: AuthPrincipal, @Body() dto: CreateNodeDto) {
    return this.nodes.create(u.tenantId, dto);
  }

  @Roles("OWNER", "ADMIN")
  @Put(":id")
  update(
    @CurrentUser() u: AuthPrincipal,
    @Param("id") id: string,
    @Body() dto: UpdateNodeDto,
  ) {
    return this.nodes.update(u.tenantId, id, dto);
  }

  @Roles("OWNER", "ADMIN")
  @Delete(":id")
  remove(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.nodes.remove(u.tenantId, id);
  }

  @Roles("OWNER", "ADMIN")
  @Post(":id/restart")
  restart(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.nodes.sendCommand(u.tenantId, id, "restart");
  }

  @Roles("OWNER", "ADMIN")
  @Post(":id/pause")
  pause(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.nodes.sendCommand(u.tenantId, id, "pause");
  }

  @Roles("OWNER", "ADMIN")
  @Post(":id/resume")
  resume(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.nodes.sendCommand(u.tenantId, id, "resume");
  }
}
