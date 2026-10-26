import { User, UserCreateInput } from '../../domain/entities/User';
import { CreateUser } from '../../domain/use-cases/CreateUser';
import { AuthenticateUser } from '../../domain/use-cases/AuthenticateUser';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class UserService {
  constructor(
    private createUserUseCase: CreateUser,
    private authenticateUserUseCase: AuthenticateUser,
    private userRepository: UserRepository,
  ) {}

  async createUser(data: UserCreateInput): Promise<User> {
    return this.createUserUseCase.execute(data);
  }

  async authenticate(email: string, password: string): Promise<User> {
    return this.authenticateUserUseCase.execute(email, password);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async listUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
