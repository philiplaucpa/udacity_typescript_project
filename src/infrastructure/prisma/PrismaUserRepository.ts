import { PrismaClient } from '@prisma/client';
import type { User as PrismaUser, Role as PrismaRole, Permission as PrismaPermission } from '@prisma/client';
import { User, UserCreateInput } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

const prisma = new PrismaClient();

type PrismaUserWithRelations = PrismaUser & {
  role?: (PrismaRole & { permissions?: PrismaPermission[] }) | null;
};

function mapToDomainUser(prismaUser: PrismaUserWithRelations): User {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    name: prismaUser.name,
    passwordHash: prismaUser.passwordHash,
    roleId: prismaUser.roleId,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    role: prismaUser.role
      ? {
          id: prismaUser.role.id,
          name: prismaUser.role.name,
          permissions: prismaUser.role.permissions?.map((p) => ({
            id: p.id,
            action: p.action,
            resource: p.resource,
          })),
        }
      : undefined,
  };
}

export class PrismaUserRepository implements UserRepository {
  async create(
    data: Omit<UserCreateInput, 'password'> & { passwordHash: string },
  ): Promise<User> {
    const created = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
      },
      include: {
        role: { include: { permissions: true } },
      },
    });
    return mapToDomainUser(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.user.findUnique({
      where: { email },
      include: {
        role: { include: { permissions: true } },
      },
    });
    return found ? mapToDomainUser(found) : null;
  }

  async findById(id: string): Promise<User | null> {
    const found = await prisma.user.findUnique({
      where: { id },
      include: {
        role: { include: { permissions: true } },
      },
    });
    return found ? mapToDomainUser(found) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: {
        role: { include: { permissions: true } },
      },
    });
    return users.map(mapToDomainUser);
  }
}
