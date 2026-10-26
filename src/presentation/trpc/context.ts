import { CreateUser } from "../../domain/use-cases/CreateUser";
import { AuthenticateUser } from "../../domain/use-cases/AuthenticateUser";
import { PrismaUserRepository } from "../../infrastructure/prisma/PrismaUserRepository";
import { UserService } from "../../application/services/UserService";

export function createContext() {
  const userRepository = new PrismaUserRepository();
  const createUser = new CreateUser(userRepository);
  const authenticateUser = new AuthenticateUser(userRepository);
  const userService = new UserService(
    createUser,
    authenticateUser,
    userRepository,
  );

  return { userService };
}

export type Context = ReturnType<typeof createContext>;
