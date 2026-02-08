import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns true when window width is less than 768px', () => {
        // Mock window.innerWidth
        vi.stubGlobal('innerWidth', 500);

        // Mock matchMedia
        vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })));

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('returns false when window width is 768px or more', () => {
        // Mock window.innerWidth
        vi.stubGlobal('innerWidth', 1024);

        // Mock matchMedia
        vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })));

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('updates when window is resized', () => {
        let onChangeCallback: () => void = () => { };

        vi.stubGlobal('innerWidth', 1024);
        vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            addEventListener: vi.fn((type, cb) => {
                if (type === 'change') onChangeCallback = cb;
            }),
            removeEventListener: vi.fn(),
        })));

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);

        // Simulate resize to mobile
        act(() => {
            vi.stubGlobal('innerWidth', 500);
            onChangeCallback();
        });

        expect(result.current).toBe(true);
    });
});
