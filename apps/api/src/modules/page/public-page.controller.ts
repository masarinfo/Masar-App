import { Controller, Get, Param } from '@nestjs/common';
import { PageService } from './page.service';
import { Page } from '@masar/db';

@Controller('public/pages')
export class PublicPageController {
  constructor(private readonly pageService: PageService) {}

  @Get(':id')
  async getPublicPage(@Param('id') pageId: string): Promise<Page> {
    return this.pageService.getPublicPage(pageId);
  }
}
