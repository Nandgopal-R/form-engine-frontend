import { describe, expect, it } from 'vitest';
import { authClient } from '../lib/auth-client';

describe('authClient integration', () => {
  it('is defined', () => {
    expect(authClient).toBeDefined();
  });

  it('has signIn method', () => {
    expect(authClient.signIn).toBeDefined();
  });

  it('has signUp method', () => {
    expect(authClient.signUp).toBeDefined();
  });

  it('has signOut method', () => {
    expect(authClient.signOut).toBeDefined();
  });

  it('has useSession hook', () => {
    expect(authClient.useSession).toBeDefined();
  });

  it('has getSession method', () => {
    expect(authClient.getSession).toBeDefined();
  });
});
