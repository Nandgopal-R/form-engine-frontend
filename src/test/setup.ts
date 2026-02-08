import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock ResizeObserver which is missing in JSDOM but used by Radix/TanStack
class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock as any;

// Mock scrollIntoView which is also missing in JSDOM
Element.prototype.scrollIntoView = vi.fn();
