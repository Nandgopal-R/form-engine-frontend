import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditorCanvas } from './editor-canvas';
import type { CanvasField } from './fields/field-preview';

const mockFields: Array<CanvasField> = [
    { id: '1', type: 'text', label: 'Field 1' },
    { id: '2', type: 'number', label: 'Field 2' },
];

describe('EditorCanvas', () => {
    const defaultProps = {
        fields: mockFields,
        formTitle: 'Test Form',
        formDescription: 'Test Description',
        onTitleChange: vi.fn(),
        onDescriptionChange: vi.fn(),
        onRemoveField: vi.fn(),
        onEditField: vi.fn(),
        onSave: vi.fn(),
        onUpdateTitle: vi.fn(),
    };

    it('renders empty state when no fields are provided', () => {
        render(<EditorCanvas {...defaultProps} fields={[]} />);
        expect(screen.getByText('No fields added')).toBeInTheDocument();
    });

    it('renders fields correctly', () => {
        render(<EditorCanvas {...defaultProps} />);
        expect(screen.getByText('Field 1')).toBeInTheDocument();
        expect(screen.getByText('Field 2')).toBeInTheDocument();
    });

    it('switches between Edit and Preview tabs', async () => {
        const user = userEvent.setup();
        render(<EditorCanvas {...defaultProps} />);

        // Default is Edit tab
        expect(screen.getByRole('tab', { name: 'Edit' })).toHaveAttribute('data-state', 'active');

        // Switch to Preview
        await user.click(screen.getByRole('tab', { name: 'Preview' }));
        expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute('data-state', 'active');
        expect(screen.getByText('This is a preview. Submissions are disabled.')).toBeInTheDocument();

        // Switch back to Edit
        await user.click(screen.getByRole('tab', { name: 'Edit' }));
        expect(screen.getByRole('tab', { name: 'Edit' })).toHaveAttribute('data-state', 'active');
    });

    it('calls onSave when save button is clicked', async () => {
        const user = userEvent.setup();
        render(<EditorCanvas {...defaultProps} />);

        await user.click(screen.getByText('Save Form'));
        expect(defaultProps.onSave).toHaveBeenCalled();
    });

    it('disables save button when isSaving is true', () => {
        render(<EditorCanvas {...defaultProps} isSaving={true} />);
        const saveButton = screen.getByText('Saving...');
        expect(saveButton).toBeDisabled();
    });

    it('allows editing form title in standard mode', async () => {
        const user = userEvent.setup();
        render(<EditorCanvas {...defaultProps} />);

        const titleInput = screen.getByDisplayValue('Test Form');
        await user.clear(titleInput);
        await user.type(titleInput, 'New Title');

        expect(defaultProps.onTitleChange).toHaveBeenCalled();
    });

    it('renders dedicated title input when showFormTitleInput is true', () => {
        render(<EditorCanvas {...defaultProps} showFormTitleInput={true} />);
        // Look for label
        expect(screen.getByLabelText(/Form Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });

    it('calls onUpdateTitle when handling title change request in standard mode', async () => {
        const user = userEvent.setup();
        render(<EditorCanvas {...defaultProps} />);

        await user.click(screen.getByText('Change Title'));
        expect(defaultProps.onUpdateTitle).toHaveBeenCalled();
    });

    it('calls onRemoveField when remove button is clicked', async () => {
        const user = userEvent.setup();
        render(<EditorCanvas {...defaultProps} />);

        // Assuming FieldPreview renders a trash icon button.
        // We know from FieldPreview tests that there are buttons.
        // Let's find the first remove button.
        // FieldPreview structure: settings button, then trash button.
        const buttons = screen.getAllByRole('button');
        // Filter for the trash button (it has text-destructive class usually, or we can look specifically).
        // Or we can rely on mock from FieldPreview? deeper integration test here.

        // Let's try to simulate click on the delete button of the first field.
        // The delete button is the second button in the group overlay.
        // It renders 2 fields. field 1 has 2 buttons.
        // The buttons are hidden by group-hover opacity usually, but they exist in DOM.

        // We can find by icon class if we render real icons, but querying by class is fragile.
        // Let's try:
        const removeButtons = document.querySelectorAll('.text-destructive.hover\\:bg-destructive\\/10');
        // This is implementation detail reliance.

        // Better: mock FieldPreview? No, we want integration.
        // Let's use the handler passed to it.
        // In FieldPreview, the button calls e.stopPropagation().

        // Let's try simply finding all buttons and clicking one that looks like delete (by icon or position).
        // Field 1 is index 0. Buttons 0 (settings) and 1 (delete).
        // But wait, "Save Form" and tabs are also buttons.
        // "Save Form" (1), "Edit" (1), "Preview" (1), "Change Title" (1) -> 4 specific buttons.
        // Then fields.

        // Since we are using UserEvent, let's find the specific card.
        const firstFieldText = screen.getByText('Field 1');
        const card = firstFieldText.closest('.group'); // The card has group class
        if (card) {
            const deleteBtn = card.querySelectorAll('button')[1]; // 2nd button in card
            await user.click(deleteBtn);
            expect(defaultProps.onRemoveField).toHaveBeenCalledWith('1');
        } else {
            throw new Error('Card not found');
        }
    });

    it('calls onEditField when edit button is clicked', async () => {
        const user = userEvent.setup();
        render(<EditorCanvas {...defaultProps} />);

        const firstFieldText = screen.getByText('Field 1');
        const card = firstFieldText.closest('.group');
        if (card) {
            const editBtn = card.querySelectorAll('button')[0]; // 1st button in card
            await user.click(editBtn);
            expect(defaultProps.onEditField).toHaveBeenCalledWith(mockFields[0]);
        }
    });

    it('updates title and description via inputs when showFormTitleInput is true', async () => {
        const user = userEvent.setup();
        const onTitleChange = vi.fn();
        const onDescriptionChange = vi.fn();

        render(
            <EditorCanvas
                {...defaultProps}
                showFormTitleInput={true}
                onTitleChange={onTitleChange}
                onDescriptionChange={onDescriptionChange}
            />
        );

        const titleInput = screen.getByLabelText(/Form Title/i);
        await user.clear(titleInput);
        await user.type(titleInput, 'Edited Title');
        expect(onTitleChange).toHaveBeenCalled();

        const descInput = screen.getByLabelText(/Description/i);
        await user.clear(descInput);
        await user.type(descInput, 'Edited Description');
        expect(onDescriptionChange).toHaveBeenCalled();
    });

    it('renders preview mode correctly with fields', async () => {
        const user = userEvent.setup();
        render(<EditorCanvas {...defaultProps} />);

        await user.click(screen.getByRole('tab', { name: 'Preview' }));

        expect(screen.getByText('Test Form')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        // In preview, we render Field components, which might just render the input.
        // We should check that inputs are present.
        const inputs = screen.getAllByRole('textbox'); // Text inputs
        expect(inputs.length).toBeGreaterThan(0);

        expect(screen.getByText('Submit')).toBeDisabled();
    });
});
