import { Controller, Get, Post, Param, Body, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { prisma, Property, DatabaseRow } from '@masar/db';

@Controller('public/forms')
export class FormsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get(':pageId/schema')
  async getFormSchema(@Param('pageId') pageId: string): Promise<{ properties: Property[], title: string }> {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page || page.isArchived || !page.isDatabase) {
      throw new NotFoundException('قاعدة البيانات غير موجودة أو غير متاحة');
    }

    if (!page.isPublished) {
      throw new ForbiddenException('النموذج غير متاح للعامة حالياً.');
    }

    const { properties } = await this.databaseService.getDatabaseSchema(pageId);
    
    // Filter out internal properties that shouldn't be in the form (like FORMULA or ROLLUP, but we send all for now and frontend filters)
    return { properties, title: page.title };
  }

  @Post(':pageId/submit')
  async submitForm(
    @Param('pageId') pageId: string,
    @Body() data: Record<string, any>
  ): Promise<{ success: boolean; rowId: string }> {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page || page.isArchived || !page.isDatabase) {
      throw new NotFoundException('قاعدة البيانات غير موجودة أو غير متاحة');
    }

    if (!page.isPublished) {
      throw new ForbiddenException('النموذج غير متاح للعامة حالياً.');
    }

    // Create a new row with the submitted data
    const row = await this.databaseService.createRow({
      pageId,
      data,
    });

    return { success: true, rowId: row.id };
  }
}
