import React, { useState, useEffect, useCallback } from 'react';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../src/presentation/trpc/router';
import type { User, UserCreateInput, UserAuthenticateInput } from './types';

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: '/trpc' })],
});

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authResult, setAuthResult] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<UserCreateInput>({
    email: '',
    name: '',
    password: '',
    roleId: '',
  });

  const [loginForm, setLoginForm] = useState<UserAuthenticateInput>({
    email: '',
    password: '',
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await client.listUsers.query() as User[];
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await client.createUser.mutate(createForm);
      setCreateForm({ email: '', name: '', password: '', roleId: '' });
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthResult(null);
    try {
      const user = await client.authenticate.mutate(loginForm) as User;
      setAuthResult(`Authenticated as ${user.name} (${user.email})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="App">
      <h1>Dashy Analytics - User Management</h1>

      {error && <p className="error">{error}</p>}
      {authResult && <p className="success">{authResult}</p>}

      <section>
        <h2>Create New User</h2>
        <form onSubmit={handleCreateUser}>
          <input
            type="email"
            placeholder="Email"
            value={createForm.email}
            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={createForm.password}
            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Role ID (UUID)"
            value={createForm.roleId}
            onChange={(e) => setCreateForm({ ...createForm, roleId: e.target.value })}
            required
          />
          <button type="submit">Create User</button>
        </form>
      </section>

      <section>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
      </section>

      <section>
        <h2>Users ({users.length})</h2>
        {loading && <p>Loading...</p>}
        {users.length === 0 && !loading && (
          <p>No users found. Create one above!</p>
        )}
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email}) - Role: {user.role?.name ?? 'N/A'}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
