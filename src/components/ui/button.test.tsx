import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();
        render(<Button onClick={onClick}>Click me</Button>);

        const button = screen.getByRole('button', { name: /click me/i });
        await user.click(button);

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when the disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
    });

    it('applies variant classes correctly', () => {
        const { rerender } = render(<Button variant="destructive">Destructive</Button>);
        let button = screen.getByRole('button');
        expect(button).toHaveClass('bg-destructive');

        rerender(<Button variant="outline">Outline</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('border');
    });

    it('renders as a custom component when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        const link = screen.getByRole('link', { name: /link button/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
    });
});
