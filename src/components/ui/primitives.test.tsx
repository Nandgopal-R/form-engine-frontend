import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';
import { Separator } from './separator';
import { Skeleton } from './skeleton';

describe('UI Primitives', () => {
    describe('Checkbox', () => {
        it('renders and handles toggle', () => {
            const onCheckedChange = vi.fn();
            render(<Checkbox onCheckedChange={onCheckedChange} />);

            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);
            expect(onCheckedChange).toHaveBeenCalledWith(true);
        });

        it('renders in checked state', () => {
            render(<Checkbox checked />);
            expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
        });

        it('is disabled when prop is passed', () => {
            render(<Checkbox disabled />);
            expect(screen.getByRole('checkbox')).toBeDisabled();
        });
    });

    describe('Separator', () => {
        it('renders with horizontal orientation by default', () => {
            const { container } = render(<Separator />);
            const separator = container.querySelector('[data-slot="separator"]');
            expect(separator).toHaveAttribute('data-orientation', 'horizontal');
        });

        it('renders with vertical orientation', () => {
            const { container } = render(<Separator orientation="vertical" />);
            const separator = container.querySelector('[data-slot="separator"]');
            expect(separator).toHaveAttribute('data-orientation', 'vertical');
        });
    });

    describe('Skeleton', () => {
        it('renders with pulse animation', () => {
            const { container } = render(<Skeleton className="w-10 h-10" />);
            const skeleton = container.querySelector('[data-slot="skeleton"]');
            expect(skeleton).toHaveClass('animate-pulse');
            expect(skeleton).toHaveClass('w-10');
        });
    });
});
