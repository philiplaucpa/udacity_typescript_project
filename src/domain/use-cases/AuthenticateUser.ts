import { createHash } from 'node:crypto';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class AuthenticateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordHash = createHash('sha256').update(password).digest('hex');
    if (user.passwordHash !== passwordHash) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}
