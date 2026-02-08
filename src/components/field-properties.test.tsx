import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FieldProperties } from './field-properties';
import type { CanvasField } from './fields/field-preview';

const mockField: CanvasField = {
    id: 'test-id',
    type: 'text',
    label: 'Initial Label',
    placeholder: 'Initial Placeholder',
    required: false,
};

describe('FieldProperties', () => {
    it('does not render when field is null', () => {
        const { container } = render(
            <FieldProperties field={null} open={true} onOpenChange={() => { }} onSave={() => { }} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders with initial field values when open', () => {
        render(
            <FieldProperties field={mockField} open={true} onOpenChange={() => { }} onSave={() => { }} />
        );
        expect(screen.getByDisplayValue('Initial Label')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Initial Placeholder')).toBeInTheDocument();
    });

    it('updates state and calls onSave with new values', async () => {
        const onSave = vi.fn();
        const onOpenChange = vi.fn();
        const user = userEvent.setup();

        render(
            <FieldProperties field={mockField} open={true} onOpenChange={onOpenChange} onSave={onSave} />
        );

        const labelInput = screen.getByLabelText(/label/i);
        await user.clear(labelInput);
        await user.type(labelInput, 'Updated Label');

        const saveButton = screen.getByText(/save changes/i);
        await user.click(saveButton);

        expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
            label: 'Updated Label',
        }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('shows additional fields for specific types (dropdown)', () => {
        const dropdownField = { ...mockField, type: 'dropdown', options: ['A', 'B'] };
        render(
            <FieldProperties field={dropdownField} open={true} onOpenChange={() => { }} onSave={() => { }} />
        );

        const optionsInput = screen.getByLabelText(/options/i);
        expect(optionsInput).toBeInTheDocument();
        expect(optionsInput).toHaveValue('A\nB');
    });

    it('shows additional fields for specific types (number)', () => {
        const numberField = { ...mockField, type: 'number', min: 0, max: 10 };
        render(
            <FieldProperties field={numberField} open={true} onOpenChange={() => { }} onSave={() => { }} />
        );

        expect(screen.getByLabelText(/min/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/max/i)).toBeInTheDocument();

        // Use more specific checks for values
        const minInput = screen.getByLabelText(/min/i);
        const maxInput = screen.getByLabelText(/max/i);

        expect(minInput).toHaveValue(0);
        expect(maxInput).toHaveValue(10);
    });
});
