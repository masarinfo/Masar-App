import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { prisma, Page } from '@masar/db';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { IPageTreeNode } from '@masar/types';

@Injectable()
export class PageService {
  async createPage(userId: string, dto: CreatePageDto): Promise<Page> {
    if (dto.parentId) {
      const parent = await prisma.page.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('المستند الأب غير موجود');
      }
    }

    const page = await prisma.page.create({
      data: {
        title: dto.title || 'صفحة جديدة',
        icon: dto.icon || '📄',
        workspaceId: dto.workspaceId,
        authorId: userId,
        parentId: dto.parentId || null,
        isDatabase: dto.isDatabase || false,
      },
    });

    return page;
  }

  async getPageTree(workspaceId: string): Promise<IPageTreeNode[]> {
    const pages = await prisma.page.findMany({
      where: {
        workspaceId,
        isArchived: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const buildTree = (parentId: string | null): IPageTreeNode[] => {
      return pages
        .filter((p) => p.parentId === parentId)
        .map((p) => ({
          ...p,
          children: buildTree(p.id),
        }));
    };

    return buildTree(null);
  }

  async getPageById(pageId: string): Promise<Page> {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        children: {
          where: { isArchived: false },
          select: { id: true, title: true, icon: true },
        },
      },
    });

    if (!page || page.isArchived) {
      throw new NotFoundException('لم يتم العثور على المستند المطلوب');
    }

    return page;
  }

  async updatePage(pageId: string, dto: UpdatePageDto): Promise<Page> {
    const page = await prisma.page.findUnique({ where: { id: pageId } });
    if (!page) {
      throw new NotFoundException('لم يتم العثور على المستند');
    }

    const updated = await prisma.page.update({
      where: { id: pageId },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  async deletePage(pageId: string): Promise<{ success: boolean; message: string }> {
    const page = await prisma.page.findUnique({ where: { id: pageId } });
    if (!page) {
      throw new NotFoundException('المستند غير موجود');
    }

    // Soft delete by archiving
    await prisma.page.update({
      where: { id: pageId },
      data: { isArchived: true },
    });

    return { success: true, message: 'تم أرشفة المستند بنجاح' };
  }

  async getPublicPage(pageId: string): Promise<Page> {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page || page.isArchived) {
      throw new NotFoundException('الصفحة غير موجودة');
    }

    if (!page.isPublished) {
      throw new ForbiddenException('هذه الصفحة غير متاحة للعامة. يرجى تفعيل المشاركة من الإعدادات.');
    }

    return page;
  }
}
