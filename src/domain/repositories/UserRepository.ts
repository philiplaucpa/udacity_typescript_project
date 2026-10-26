import { User, UserCreateInput } from '../entities/User';

export interface UserRepository {
  create(data: Omit<UserCreateInput, 'password'> & { passwordHash: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
