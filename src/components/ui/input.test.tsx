import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './input';

describe('Input', () => {
    it('renders correctly with initial value', () => {
        render(<Input defaultValue="Hello" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('Hello');
    });

    it('updates value on change', async () => {
        const user = userEvent.setup();
        render(<Input placeholder="Enter text" />);
        const input = screen.getByPlaceholderText('Enter text');

        await user.type(input, 'New Value');
        expect(input).toHaveValue('New Value');
    });

    it('is disabled when prop is passed', () => {
        render(<Input disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies custom className', () => {
        render(<Input className="custom-class" />);
        expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('handles different input types', () => {
        render(<Input type="number" placeholder="Number" />);
        const input = screen.getByPlaceholderText('Number');
        expect(input).toHaveAttribute('type', 'number');
    });
});
