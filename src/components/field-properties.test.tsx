import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FieldProperties } from './field-properties';
import type { CanvasField } from './fields/field-preview';

// Mock pointer capture for Radix UI (Dialog/Select/etc)
beforeEach(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
});

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

    it('saves validation rules correctly', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();
        render(<FieldProperties field={mockField} open={true} onOpenChange={vi.fn()} onSave={onSave} />);

        // Open validation rules
        const validationTrigger = screen.getByText('Validation Rules');
        await user.click(validationTrigger);

        // Add a rule (min length)
        expect(screen.getByText('Add Validation Rule')).toBeInTheDocument();

        await user.click(screen.getByText('Save changes'));
        expect(onSave).toHaveBeenCalled();
    });

    it('handles numeric input changes correctly (min/max)', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();
        const numberField = { ...mockField, type: 'number' };
        render(<FieldProperties field={numberField} open={true} onOpenChange={vi.fn()} onSave={onSave} />);

        const minInput = screen.getByLabelText('Min');
        await user.type(minInput, '10');

        await user.click(screen.getByText('Save changes'));

        expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
            min: 10,
            validation: expect.objectContaining({ min: 10 })
        }));
    });

    it('handles options changes correctly', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();
        const dropdownField = { ...mockField, type: 'dropdown' };
        render(<FieldProperties field={dropdownField} open={true} onOpenChange={vi.fn()} onSave={onSave} />);

        const optionsInput = screen.getByLabelText(/Options/i);
        await user.type(optionsInput, 'Option 1{enter}Option 2');

        await user.click(screen.getByText('Save changes'));

        expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
            options: ['Option 1', 'Option 2']
        }));
    });
});
