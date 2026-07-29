import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Page } from '@masar/db';
import { IPageTreeNode } from '@masar/types';

@Controller('pages')
@UseGuards(JwtAuthGuard)
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  async createPage(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreatePageDto,
  ): Promise<Page> {
    return this.pageService.createPage(userId, dto);
  }

  @Get('workspace/:workspaceId/tree')
  async getPageTree(@Param('workspaceId') workspaceId: string): Promise<IPageTreeNode[]> {
    return this.pageService.getPageTree(workspaceId);
  }

  @Get(':id')
  async getPageById(@Param('id') pageId: string): Promise<Page> {
    return this.pageService.getPageById(pageId);
  }

  @Patch(':id')
  async updatePage(
    @Param('id') pageId: string,
    @Body() dto: UpdatePageDto,
  ): Promise<Page> {
    return this.pageService.updatePage(pageId, dto);
  }

  @Delete(':id')
  async deletePage(@Param('id') pageId: string): Promise<{ success: boolean; message: string }> {
    return this.pageService.deletePage(pageId);
  }
}
