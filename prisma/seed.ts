import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'node:crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding database...');

  const readDashboard = await prisma.permission.create({
    data: { id: uuidv4(), action: 'read', resource: 'dashboard' },
  });

  const writeDashboard = await prisma.permission.create({
    data: { id: uuidv4(), action: 'write', resource: 'dashboard' },
  });

  const readUsers = await prisma.permission.create({
    data: { id: uuidv4(), action: 'read', resource: 'user' },
  });

  const adminRole = await prisma.role.create({
    data: {
      id: uuidv4(),
      name: 'admin',
      permissions: {
        connect: [
          { id: readDashboard.id },
          { id: writeDashboard.id },
          { id: readUsers.id },
        ],
      },
    },
  });

  const userRole = await prisma.role.create({
    data: {
      id: uuidv4(),
      name: 'user',
      permissions: {
        connect: [{ id: readDashboard.id }],
      },
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin@dashy.com',
      name: 'Admin User',
      passwordHash: hashPassword('admin123'),
      roleId: adminRole.id,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'user@dashy.com',
      name: 'Regular User',
      passwordHash: hashPassword('user1234'),
      roleId: userRole.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
