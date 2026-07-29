import { PrismaClient } from '@prisma/client';

export async function seedDemoData() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.upsert({
      where: { email: 'demo@masar.ai' },
      update: {},
      create: {
        id: 'demo-user-001',
        email: 'demo@masar.ai',
        name: 'Demo User',
      },
    });

    const workspace = await prisma.workspace.upsert({
      where: { slug: 'demo-workspace' },
      update: {},
      create: {
        id: 'demo-workspace-001',
        name: 'Demo Workspace',
        slug: 'demo-workspace',
      },
    });

    await prisma.page.upsert({
      where: { id: 'db-demo-page-001' },
      update: {},
      create: {
        id: 'db-demo-page-001',
        title: 'قاعدة بيانات تجريبية',
        isDatabase: true,
        authorId: user.id,
        workspaceId: workspace.id,
      },
    });
    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}
