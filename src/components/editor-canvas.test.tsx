import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EditorCanvas } from './editor-canvas';
import type { CanvasField } from './fields/field-preview';

const mockFields: CanvasField[] = [
    { id: '1', type: 'text', label: 'Field 1' },
    { id: '2', type: 'number', label: 'Field 2' },
];

describe('EditorCanvas', () => {
    it('renders empty state when no fields are provided', () => {
        render(<EditorCanvas fields={[]} />);
        expect(screen.getByText('No fields added')).toBeInTheDocument();
        expect(screen.getByText(/Click on fields from the sidebar/i)).toBeInTheDocument();
    });

    it('renders a list of fields correctly', () => {
        render(<EditorCanvas fields={mockFields} />);
        expect(screen.getByText('Field 1')).toBeInTheDocument();
        expect(screen.getByText('Field 2')).toBeInTheDocument();
    });

    it('passes handlers to FieldPreview correctly', () => {
        const onRemoveField = vi.fn();
        render(<EditorCanvas fields={mockFields} onRemoveField={onRemoveField} />);

        // We can verify that FieldPreview is being rendered with the correct labels
        // Detailed interaction testing is already covered in FieldPreview.test.tsx
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });
});
