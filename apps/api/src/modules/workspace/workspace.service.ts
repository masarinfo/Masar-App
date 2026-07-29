import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { prisma } from '@masar/db';
import { CreateWorkspaceDto, UpdateWorkspaceDto, AddMemberDto } from './dto/workspace.dto';
import { UserRole } from '@masar/types';

@Injectable()
export class WorkspaceService {
  private generateSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[\s\W]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return baseSlug ? `${baseSlug}-${randomSuffix}` : `workspace-${randomSuffix}`;
  }

  async createWorkspace(userId: string, dto: CreateWorkspaceDto) {
    const slug = dto.slug || this.generateSlug(dto.name);

    const existingSlug = await prisma.workspace.findUnique({ where: { slug } });
    if (existingSlug) {
      throw new ConflictException('الـ Slug المستخدم لمساحة العمل مأخوذ بالفعل');
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: dto.name,
        slug,
        icon: dto.icon || '🚀',
        members: {
          create: {
            userId,
            role: UserRole.OWNER,
          },
        },
      },
      include: {
        members: true,
      },
    });

    return workspace;
  }

  async getUserWorkspaces(userId: string) {
    const memberships = await prisma.member.findMany({
      where: { userId },
      include: {
        workspace: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return memberships.map((m) => ({
      ...m.workspace,
      role: m.role,
    }));
  }

  async getWorkspaceBySlug(userId: string, slug: string) {
    const workspace = await prisma.workspace.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('لم يتم العثور على مساحة العمل هذه');
    }

    const isMember = workspace.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('ليس لديك إمكانية الوصول لهذه المساحة');
    }

    return workspace;
  }

  async addMember(workspaceId: string, dto: AddMemberDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('لم يتم العثور على مستخدم بهذا البريد الإلكتروني');
    }

    const existing = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('المستخدم عضو بالفعل في مساحة العمل هذه');
    }

    const member = await prisma.member.create({
      data: {
        userId: user.id,
        workspaceId,
        role: dto.role || UserRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return member;
  }

  async removeMember(workspaceId: string, memberId: string) {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member || member.workspaceId !== workspaceId) {
      throw new NotFoundException('العضو غير موجود');
    }

    if (member.role === UserRole.OWNER) {
      throw new ForbiddenException('لا يمكن حذف مالك مساحة العمل الرئيسي');
    }

    await prisma.member.delete({
      where: { id: memberId },
    });

    return { success: true, message: 'تم إزالة العضو بنجاح' };
  }
}
