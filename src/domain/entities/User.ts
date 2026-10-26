// Circular: User ↔ Role. Uses `import type` to avoid runtime issues.
import type { Role } from './Role';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
  role?: Role;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
  roleId: string;
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
  password?: string;
  roleId?: string;
}
