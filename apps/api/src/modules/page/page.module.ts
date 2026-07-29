import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { PublicPageController } from './public-page.controller';

@Module({
  controllers: [PageController, PublicPageController],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}
