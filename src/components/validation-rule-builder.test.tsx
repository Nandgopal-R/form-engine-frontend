import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ValidationRuleBuilder } from './validation-rule-builder';

// Mock pointer capture for Radix UI
beforeAll(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
});

describe('ValidationRuleBuilder', () => {
    it('renders without crashing', () => {
        render(<ValidationRuleBuilder fieldType="text" onChange={vi.fn()} />);
        expect(screen.getByText('Add Validation Rule')).toBeInTheDocument();
    });

    it('displays active rules from initial prop', () => {
        const initialValidation: any = {
            minLength: 5
        };

        render(<ValidationRuleBuilder fieldType="text" currentValidation={initialValidation} onChange={vi.fn()} />);
        // Check for minLength value input
        expect(screen.getByDisplayValue('5')).toBeInTheDocument();
        // Check for the rule badge
        expect(screen.getByText('Minimum Length')).toBeInTheDocument();
    });

    it('adds a rule', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<ValidationRuleBuilder fieldType="text" onChange={onChange} />);

        // Open select (combobox)
        const trigger = screen.getByRole('combobox');
        await user.click(trigger);

        // Select "Minimum Length" option
        // The option text might be in "Minimum Length" span
        const option = await screen.findByText('Minimum Length');
        await user.click(option);

        // Click Add button (the one with the plus icon next to select)
        // We can find it by finding the button that is NOT the combobox and NOT a remove button.
        const buttons = screen.getAllByRole('button');
        const addButton = buttons.find(b => !b.getAttribute('role')?.includes('combobox') && !b.getAttribute('aria-label')?.includes('Remove'));

        if (addButton) {
            await user.click(addButton);
        } else {
            throw new Error('Add button not found');
        }

        expect(onChange).toHaveBeenCalled();
        expect(screen.getByDisplayValue('')).toBeInTheDocument(); // New input for value should appear
    });

    it('removes a rule', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const initialValidation: any = { minLength: 5 };

        render(<ValidationRuleBuilder fieldType="text" currentValidation={initialValidation} onChange={onChange} />);

        expect(screen.getByDisplayValue('5')).toBeInTheDocument();

        // Find delete button by aria-label
        const removeButton = screen.getByRole('button', { name: "Remove rule" });
        await user.click(removeButton);

        // After removal, onChange is called with new config (empty/undefined minLength)
        expect(onChange).toHaveBeenCalled();
        const lastCallConfig = onChange.mock.calls[onChange.mock.calls.length - 1][0];
        expect(lastCallConfig.minLength).toBeUndefined();
    });

    it('updates rule parameters', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const initialValidation: any = { minLength: 5 };

        render(<ValidationRuleBuilder fieldType="text" currentValidation={initialValidation} onChange={onChange} />);

        const input = screen.getByDisplayValue('5');
        await user.clear(input);
        await user.type(input, '10');

        expect(onChange).toHaveBeenCalled();
        const lastCallConfig = onChange.mock.calls[onChange.mock.calls.length - 1][0];
        expect(lastCallConfig.minLength).toBe(10);
    });
});
