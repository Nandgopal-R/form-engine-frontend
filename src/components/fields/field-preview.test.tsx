import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {  FieldPreview } from './field-preview';
import type {CanvasField} from './field-preview';

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

    it('shows a required asterisk when required prop is true', () => {
        const requiredField = { ...mockField, required: true };
        render(<FieldPreview field={requiredField} />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders text input', () => {
        render(<FieldPreview field={mockField} />);
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('renders textarea', () => {
        const field = { ...mockField, type: 'textarea', placeholder: 'Enter long text...' };
        render(<FieldPreview field={field} />);
        expect(screen.getByPlaceholderText('Enter long text...')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders number input with attributes', () => {
        const field: CanvasField = { ...mockField, type: 'number', min: 0, max: 10, step: 2, placeholder: undefined };
        render(<FieldPreview field={field} />);
        const input = screen.getByPlaceholderText('Enter number...');
        expect(input).toHaveAttribute('type', 'number');
        expect(input).toHaveAttribute('min', '0');
        expect(input).toHaveAttribute('max', '10');
        expect(input).toHaveAttribute('step', '2');
    });

    it('renders email input', () => {
        const field: CanvasField = { ...mockField, type: 'email', placeholder: undefined };
        render(<FieldPreview field={field} />);
        expect(screen.getByPlaceholderText('name@example.com')).toHaveAttribute('type', 'email');
    });

    it('renders url input', () => {
        const field: CanvasField = { ...mockField, type: 'url', placeholder: undefined };
        render(<FieldPreview field={field} />);
        expect(screen.getByPlaceholderText('https://example.com')).toHaveAttribute('type', 'url');
    });

    it('renders phone input', () => {
        const field: CanvasField = { ...mockField, type: 'phone', placeholder: undefined };
        render(<FieldPreview field={field} />);
        expect(screen.getByPlaceholderText('+1 (555) 000-0000')).toHaveAttribute('type', 'tel');
    });

    it('renders single checkbox', () => {
        const field = { ...mockField, type: 'checkbox' };
        render(<FieldPreview field={field} />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renders multiple checkboxes when options provided', () => {
        const field = { ...mockField, type: 'checkbox', options: ['Opt 1', 'Opt 2'] };
        render(<FieldPreview field={field} />);
        expect(screen.getAllByRole('checkbox')).toHaveLength(2);
        expect(screen.getByText('Opt 1')).toBeInTheDocument();
        expect(screen.getByText('Opt 2')).toBeInTheDocument();
    });

    it('renders radio buttons', () => {
        const field = { ...mockField, type: 'radio', options: ['Yes', 'No'] };
        render(<FieldPreview field={field} />);
        const radios = screen.getAllByRole('radio');
        expect(radios).toHaveLength(2);
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('renders dropdown', () => {
        const field = { ...mockField, type: 'dropdown', options: ['A', 'B'] };
        render(<FieldPreview field={field} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Select an option...')).toBeInTheDocument();
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
    });

    it('renders date input', () => {
        const field = { ...mockField, type: 'date' };
        render(<FieldPreview field={field} />);
        // Date input might not have role 'textbox' or placeholder in some browsers/jsdom
        // Check for input with type date
        // Selector by display value or label is hard if empty.
        // We can check container or just finding by ID if we had one, but renderFieldInput doesn't add ID for simple inputs always.
        // querySelector is a fallback.
        const input = document.querySelector('input[type="date"]');
        expect(input).toBeInTheDocument();
        // Or better, using testing-library container
        // const { container } = render(...);
        // expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
    });

    it('renders time input', () => {
        const field = { ...mockField, type: 'time' };
        const { container } = render(<FieldPreview field={field} />);
        expect(container.querySelector('input[type="time"]')).toBeInTheDocument();
    });

    it('renders toggle', () => {
        const field = { ...mockField, type: 'toggle' };
        render(<FieldPreview field={field} />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument(); // Switch often uses checkbox role
        expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('renders slider', () => {
        const field = { ...mockField, type: 'slider', min: 10, max: 50 };
        render(<FieldPreview field={field} />);
        expect(screen.getByRole('slider')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('renders rating', () => {
        const field = { ...mockField, type: 'rating' };
        const { container } = render(<FieldPreview field={field} />);
        // 5 stars
        expect(container.querySelectorAll('.lucide-star')).toHaveLength(5);
    });

    it('renders file input', () => {
        const field = { ...mockField, type: 'file' };
        const { container } = render(<FieldPreview field={field} />);
        expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('renders section divider', () => {
        const field = { ...mockField, type: 'section' };
        const { container } = render(<FieldPreview field={field} />);
        expect(container.querySelector('.h-px.w-full.bg-border')).toBeInTheDocument();
    });

    it('renders CGPA input', () => {
        const field = { ...mockField, type: 'cgpa' };
        const { container } = render(<FieldPreview field={field} />);
        const input = container.querySelector('input[type="number"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('min', '0');
        expect(input).toHaveAttribute('max', '10');
        expect(input).toHaveAttribute('step', '0.01');
        expect(screen.getByPlaceholderText('Enter CGPA (0.00-10.00)')).toBeInTheDocument();
    });

    it('calls onRemove when the trash icon is clicked', async () => {
        const onRemove = vi.fn();
        const user = userEvent.setup();
        render(<FieldPreview field={mockField} onRemove={onRemove} />);

        // Find remove button (has Trash2 icon)
        // Since we don't have aria-label yet, we might rely on order or button count.
        // Settings is first, Trash is second.
        const buttons = screen.getAllByRole('button');
        // Filter out any other buttons possibly rendered by field content (unlikely for text field)
        const interfaceButtons = buttons.slice(0, 2);
        const removeButton = interfaceButtons[1];

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
