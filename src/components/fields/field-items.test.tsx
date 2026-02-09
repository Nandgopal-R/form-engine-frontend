import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FieldItems } from './field-items';

describe('FieldItems', () => {
    it('renders all field labels', () => {
        render(<FieldItems />);

        expect(screen.getByText('Short Text')).toBeDefined();
        expect(screen.getByText('Email')).toBeDefined();
        expect(screen.getByText('File Upload')).toBeDefined();
    });

    it('renders labels as buttons', () => {
        render(<FieldItems />);

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(10);
    });
});
