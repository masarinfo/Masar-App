import { Injectable } from '@nestjs/common';
import { prisma, AuditLog } from '@masar/db';

export interface CreateAuditLogDto {
  action: string;
  entity: string;
  entityId: string;
  userId: string;
}

@Injectable()
export class AuditLogService {
  /**
   * تسجيل إجراء جديد في قاعدة البيانات (Audit Log).
   */
  async createLog(dto: CreateAuditLogDto): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        action: dto.action,
        entity: dto.entity,
        entityId: dto.entityId,
        userId: dto.userId,
      },
    });
  }

  /**
   * جلب أحدث الأنشطة لمستخدم معين.
   * في النظام الفعلي، يتم جلب الأنشطة بناءً على مساحة العمل (Workspace)، 
   * ولكن لتسهيل العرض سنقوم بجلب أحدث الأنشطة العامة للمستخدم الحالي.
   */
  async getRecentLogs(userId: string, limit = 10): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          }
        }
      }
    });
  }

  /**
   * دالة مساعدة لتوليد سجلات وهمية (Mock Data) لعرضها في لوحة التحكم
   * في حال عدم وجود سجلات كافية.
   */
  async getMockDashboardData(userId: string) {
    const realLogs = await this.getRecentLogs(userId, 5);
    
    const mockLogs = [
      { id: '1', action: 'أنشأ مستنداً جديداً', entity: 'Page', entityId: 'page-123', createdAt: new Date(Date.now() - 1000 * 60 * 5) },
      { id: '2', action: 'قام بدعوة عضو جديد للفريق', entity: 'Member', entityId: 'user-456', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
      { id: '3', action: 'حدّث إعدادات مساحة العمل', entity: 'Workspace', entityId: 'ws-789', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      { id: '4', action: 'استخدم المساعد الذكي لتلخيص المستند', entity: 'AI', entityId: 'ai-001', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    ];

    return {
      stats: {
        totalPages: 24,
        activeMembers: 3,
        aiTokensUsed: 1250,
        storageUsed: '45 MB',
      },
      recentLogs: realLogs.length > 0 ? realLogs : mockLogs,
    };
  }
}
