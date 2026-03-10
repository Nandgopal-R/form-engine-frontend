import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet
} from './field';

describe('Field Components', () => {
    describe('Field', () => {
        it('renders with vertical orientation by default', () => {
            render(<Field>Test Content</Field>);
            const field = screen.getByRole('group');
            expect(field).toHaveAttribute('data-orientation', 'vertical');
        });

        it('renders with horizontal orientation', () => {
            render(<Field orientation="horizontal">Test Content</Field>);
            const field = screen.getByRole('group');
            expect(field).toHaveAttribute('data-orientation', 'horizontal');
        });
    });

    describe('FieldError', () => {
        it('renders children if provided', () => {
            render(<FieldError>Custom Error</FieldError>);
            expect(screen.getByRole('alert')).toHaveTextContent('Custom Error');
        });

        it('deduplicates error messages', () => {
            const errors = [
                { message: 'Required field' },
                { message: 'Required field' },
                { message: 'Invalid format' }
            ];
            render(<FieldError errors={errors} />);
            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(2);
            expect(listItems[0]).toHaveTextContent('Required field');
            expect(listItems[1]).toHaveTextContent('Invalid format');
        });

        it('renders a single error message without a list', () => {
            const errors = [{ message: 'Single error' }];
            render(<FieldError errors={errors} />);
            expect(screen.getByRole('alert')).toHaveTextContent('Single error');
            expect(screen.queryByRole('list')).not.toBeInTheDocument();
        });

        it('returns null if no errors or children', () => {
            const { container } = render(<FieldError errors={[]} />);
            expect(container).toBeEmptyDOMElement();
        });
    });

    describe('FieldSet & FieldLegend', () => {
        it('renders FieldSet with correct structure', () => {
            render(
                <FieldSet>
                    <FieldLegend>Title</FieldLegend>
                </FieldSet>
            );
            expect(screen.getByRole('group')).toBeInTheDocument();
            expect(screen.getByText('Title')).toBeInTheDocument();
        });

        it('renders FieldLegend with different variants', () => {
            const { rerender } = render(<FieldLegend variant="label">Label Legend</FieldLegend>);
            expect(screen.getByText('Label Legend')).toHaveAttribute('data-variant', 'label');

            rerender(<FieldLegend variant="legend">Standard Legend</FieldLegend>);
            expect(screen.getByText('Standard Legend')).toHaveAttribute('data-variant', 'legend');
        });
    });

    describe('Other Sub-components', () => {
        it('renders FieldGroup', () => {
            render(<FieldGroup>Group Content</FieldGroup>);
            expect(screen.getByText('Group Content')).toHaveAttribute('data-slot', 'field-group');
        });

        it('renders FieldDescription', () => {
            render(<FieldDescription>Info text</FieldDescription>);
            expect(screen.getByText('Info text')).toHaveAttribute('data-slot', 'field-description');
        });
    });
});
