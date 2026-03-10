import { afterEach, beforeEach, vi } from 'vitest';

// Store the original fetch
const originalFetch = globalThis.fetch;

// Mock fetch function that can be configured per test
export let mockFetch: ReturnType<typeof vi.fn>;

export function resetMockFetch() {
  mockFetch = vi.fn();
  globalThis.fetch = mockFetch;
}

export function restoreFetch() {
  globalThis.fetch = originalFetch;
}

// Helper to create a successful API response
export function mockApiResponse<T>(data: T, status = 200): Response {
  return new Response(
    JSON.stringify({ success: true, message: 'OK', data }),
    {
      status,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

// Helper to create an error API response
export function mockApiError(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({ success: false, message }),
    {
      status,
      statusText: 'Bad Request',
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

// Auto-setup and teardown for each test
beforeEach(() => {
  resetMockFetch();
});

afterEach(() => {
  restoreFetch();
});
