import { Injectable } from '@nestjs/common';
import { prisma, Page } from '@masar/db';

@Injectable()
export class SyncService {
  async getDocumentContent(pageId: string): Promise<{ id: string; title: string; content: any; updatedAt: Date } | null> {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { id: true, title: true, content: true, updatedAt: true },
    });

    if (!page) {
      return null;
    }

    return page;
  }

  async saveDocumentContent(pageId: string, content: any): Promise<Page> {
    const page = await prisma.page.update({
      where: { id: pageId },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    return page;
  }
}
