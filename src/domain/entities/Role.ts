// Circular: Role ↔ User. Uses `import type` to avoid runtime issues.
import type { User } from './User';

export interface Role {
  id: string;
  name: string;
  permissions?: Permission[];
  users?: User[];
}

export interface Permission {
  id: string;
  action: string;
  resource: string;
}

export interface RoleCreateInput {
  name: string;
  permissionIds?: string[];
}
