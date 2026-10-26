import { z } from 'zod';

describe('Project Setup Verification', () => {
  test('Zod should be importable', () => {
    expect(z).toBeDefined();
    expect(z.string).toBeDefined();
  });

  test('TypeScript compilation works with Jest', () => {
    const user = { id: '1', email: 'test@test.com' };
    expect(user.id).toBe('1');
  });
});
