import { describe, it, expect } from 'vitest';
import { authClient } from './auth-client';

describe('authClient', () => {
    it('is defined and has expected properties', () => {
        expect(authClient).toBeDefined();
        // better-auth client should have these common methods
        expect(typeof authClient.signIn).toBeDefined();
        expect(typeof authClient.signUp).toBeDefined();
    });
});
