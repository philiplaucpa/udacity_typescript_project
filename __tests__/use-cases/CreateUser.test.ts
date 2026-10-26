import { CreateUser } from '../../src/domain/use-cases/CreateUser';
import { UserRepository } from '../../src/domain/repositories/UserRepository';
import { User, UserCreateInput } from '../../src/domain/entities/User';

function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'test-id',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashed_password_value',
    roleId: '550e8400-e29b-41d4-a716-446655440000',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  };
}

class MockUserRepository implements UserRepository {
  create = jest.fn<ReturnType<UserRepository['create']>, Parameters<UserRepository['create']>>();
  findByEmail = jest.fn<ReturnType<UserRepository['findByEmail']>, Parameters<UserRepository['findByEmail']>>();
  findById = jest.fn<ReturnType<UserRepository['findById']>, Parameters<UserRepository['findById']>>();
  findAll = jest.fn<ReturnType<UserRepository['findAll']>, Parameters<UserRepository['findAll']>>();
}

describe('CreateUser Use Case', () => {
  let mockRepository: MockUserRepository;
  let createUser: CreateUser;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    createUser = new CreateUser(mockRepository);
  });

  test('should create a new user when email does not exist', async () => {
    const input: UserCreateInput = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      roleId: '550e8400-e29b-41d4-a716-446655440000',
    };

    const expectedUser = createMockUser({
      email: input.email,
      name: input.name,
      roleId: input.roleId,
    });

    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(expectedUser);

    const result = await createUser.execute(input);

    expect(mockRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockRepository.create).toHaveBeenCalled();
    expect(result.email).toBe(input.email);
    expect(result.name).toBe('Test User');
    expect(result.passwordHash).toEqual(expect.any(String));
  });

  test('should throw error when user already exists', async () => {
    const input: UserCreateInput = {
      email: 'existing@example.com',
      name: 'Existing User',
      password: 'password123',
      roleId: '550e8400-e29b-41d4-a716-446655440000',
    };

    const existingUser = createMockUser({ email: input.email });
    mockRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUser.execute(input)).rejects.toThrow('User already exists');
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  test('should hash the password before storing', async () => {
    const input: UserCreateInput = {
      email: 'hash@example.com',
      name: 'Hash Test',
      password: 'mySecret123',
      roleId: '550e8400-e29b-41d4-a716-446655440000',
    };

    let capturedPasswordHash: string | undefined;

    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockImplementation(
      async (_data) => {
        const data = _data as { passwordHash: string };
        capturedPasswordHash = data.passwordHash;
        return createMockUser({
          email: input.email,
          name: input.name,
          roleId: input.roleId,
          passwordHash: data.passwordHash,
        });
      },
    );

    await createUser.execute(input);

    expect(capturedPasswordHash).toBeDefined();
    expect(capturedPasswordHash).not.toBe(input.password);
  });
});
