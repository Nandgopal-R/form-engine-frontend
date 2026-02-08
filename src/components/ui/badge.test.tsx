import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
    it('renders text content', () => {
        render(<Badge>New</Badge>);
        expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
        const { rerender } = render(<Badge variant="destructive">Destructive</Badge>);
        expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');

        rerender(<Badge variant="outline">Outline</Badge>);
        expect(screen.getByText('Outline')).toHaveClass('text-foreground');
    });
});
