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
import { AgentsService } from "./agents.service";
import { CreateAgentDto, UpdateAgentDto } from "./dto";

@ApiTags("agents")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller("agents")
export class AgentsController {
  constructor(private agents: AgentsService) {}

  @Get()
  list(@CurrentUser() u: AuthPrincipal) {
    return this.agents.list(u.tenantId);
  }

  @Get(":id")
  get(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.agents.findOne(u.tenantId, id);
  }

  @Roles("OWNER", "ADMIN")
  @Post()
  create(@CurrentUser() u: AuthPrincipal, @Body() dto: CreateAgentDto) {
    return this.agents.create(u.tenantId, u.userId, dto);
  }

  @Roles("OWNER", "ADMIN")
  @Put(":id")
  update(
    @CurrentUser() u: AuthPrincipal,
    @Param("id") id: string,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agents.update(u.tenantId, u.userId, id, dto);
  }

  @Roles("OWNER", "ADMIN")
  @Delete(":id")
  remove(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.agents.remove(u.tenantId, id);
  }

  @Roles("OWNER", "ADMIN")
  @Post(":id/activate")
  activate(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.agents.setStatus(u.tenantId, id, "ACTIVE");
  }

  @Roles("OWNER", "ADMIN")
  @Post(":id/deactivate")
  deactivate(@CurrentUser() u: AuthPrincipal, @Param("id") id: string) {
    return this.agents.setStatus(u.tenantId, id, "INACTIVE");
  }
}
