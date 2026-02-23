import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
    it('merges multiple static classes', () => {
        expect(cn('bg-red-500', 'p-4', 'text-white')).toBe('bg-red-500 p-4 text-white');
    });

    it('handles conditional classes (truthy)', () => {
        const isActive = true as boolean;
        expect(cn('base', isActive && 'active')).toBe('base active');
    });

    it('handles conditional classes (falsy)', () => {
        const isActive = false as boolean;
        expect(cn('base', isActive && 'active')).toBe('base');
    });

    it('resolves tailwind conflicts (paddings)', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('resolves tailwind conflicts (colors)', () => {
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('handles arrays of classes', () => {
        expect(cn(['bg-red-500', 'p-4'], 'text-white')).toBe('bg-red-500 p-4 text-white');
    });

    it('handles undefined and null values', () => {
        expect(cn('base', undefined, null, 'end')).toBe('base end');
    });
});
