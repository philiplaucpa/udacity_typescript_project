// Frontend TypeScript Types
// Learner Task: After building the backend (Tasks 1-5), sync these types
// with your Prisma schema and tRPC router. In a production app, you would
// use @trpc/client's inferRouterOutputs to auto-generate these.

export interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface Role {
  id: string;
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  action: string;
  resource: string;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
  roleId: string;
}

export interface UserAuthenticateInput {
  email: string;
  password: string;
}
