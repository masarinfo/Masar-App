import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto, AddMemberDto } from './dto/workspace.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@masar/types';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async createWorkspace(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateWorkspaceDto,
  ) {
    return this.workspaceService.createWorkspace(userId, dto);
  }

  @Get()
  async getUserWorkspaces(@CurrentUser('sub') userId: string) {
    return this.workspaceService.getUserWorkspaces(userId);
  }

  @Get(':slug')
  async getWorkspaceBySlug(
    @CurrentUser('sub') userId: string,
    @Param('slug') slug: string,
  ) {
    return this.workspaceService.getWorkspaceBySlug(userId, slug);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Post(':id/members')
  async addMember(
    @Param('id') workspaceId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.workspaceService.addMember(workspaceId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id') workspaceId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.workspaceService.removeMember(workspaceId, memberId);
  }
}
