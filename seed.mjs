import { PrismaClient } from './node_modules/.pnpm/@prisma+client@6.19.3_prisma@6.19.3_typescript@5.9.3__typescript@5.9.3/node_modules/@prisma/client/index.js';
import bcrypt from './node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs/index.js';

const prisma = new PrismaClient();

async function main() {
  const password = "password123";
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@masar.com' },
    update: { passwordHash: hash },
    create: {
      email: 'admin@masar.com',
      name: 'Super Admin',
      passwordHash: hash,
    },
  });

  // Regular User
  const user = await prisma.user.upsert({
    where: { email: 'user@masar.com' },
    update: { passwordHash: hash },
    create: {
      email: 'user@masar.com',
      name: 'Regular User',
      passwordHash: hash,
    },
  });

  // Create a default workspace for them
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'masar-workspace' },
    update: {},
    create: {
      name: 'Masar Workspace',
      slug: 'masar-workspace',
    },
  });

  // Add them to workspace
  await prisma.member.upsert({
    where: { userId_workspaceId: { userId: admin.id, workspaceId: workspace.id } },
    update: { role: 'OWNER' },
    create: {
      userId: admin.id,
      workspaceId: workspace.id,
      role: 'OWNER',
    }
  });

  await prisma.member.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: workspace.id } },
    update: { role: 'MEMBER' },
    create: {
      userId: user.id,
      workspaceId: workspace.id,
      role: 'MEMBER',
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
