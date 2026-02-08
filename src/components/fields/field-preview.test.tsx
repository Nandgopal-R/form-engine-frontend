import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FieldPreview, type CanvasField } from './field-preview';

const mockField: CanvasField = {
    id: 'test-id',
    type: 'text',
    label: 'Test Label',
    placeholder: 'Test Placeholder',
};

describe('FieldPreview', () => {
    it('renders the label correctly', () => {
        render(<FieldPreview field={mockField} />);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders the correct input based on type (text)', () => {
        render(<FieldPreview field={mockField} />);
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('renders the correct input based on type (email)', () => {
        const emailField = { ...mockField, type: 'email', placeholder: 'email@test.com' };
        render(<FieldPreview field={emailField} />);
        const input = screen.getByPlaceholderText('email@test.com');
        expect(input).toHaveAttribute('type', 'email');
    });

    it('shows a required asterisk when required prop is true', () => {
        const requiredField = { ...mockField, required: true };
        render(<FieldPreview field={requiredField} />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('calls onRemove when the trash icon is clicked', async () => {
        const onRemove = vi.fn();
        const user = userEvent.setup();
        render(<FieldPreview field={mockField} onRemove={onRemove} />);

        const removeButton = screen.getAllByRole('button')[1];
        await user.click(removeButton);

        expect(onRemove).toHaveBeenCalledWith('test-id');
    });

    it('calls onEdit when the settings icon is clicked', async () => {
        const onEdit = vi.fn();
        const user = userEvent.setup();
        render(<FieldPreview field={mockField} onEdit={onEdit} />);

        const editButton = screen.getAllByRole('button')[0];
        await user.click(editButton);

        expect(onEdit).toHaveBeenCalledWith(mockField);
    });
});
