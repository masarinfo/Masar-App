import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_vZH4jbro3hAB@ep-square-wildflower-auoynl7e.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true",
    },
  },
});

async function main() {
  console.log('Seeding...');
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
      title: 'Demo Database',
      isDatabase: true,
      authorId: user.id,
      workspaceId: workspace.id,
    },
  });

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
