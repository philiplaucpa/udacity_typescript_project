import { createHash } from 'node:crypto';
import { User, UserCreateInput } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export { UserRepository };

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UserCreateInput): Promise<User> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const passwordHash = createHash('sha256').update(data.password).digest('hex');
    const { password, ...userData } = data;

    return this.userRepository.create({ ...userData, passwordHash });
  }
}
