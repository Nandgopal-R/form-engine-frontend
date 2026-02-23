import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabsLine } from './editor-sidebar-tabs';

describe('TabsLine', () => {
    it('renders the initial tab (Fields) correctly', () => {
        render(<TabsLine />);
        expect(screen.getByText('Short Text')).toBeInTheDocument();
    });

    it('switches tabs correctly', async () => {
        const user = userEvent.setup();
        render(<TabsLine />);

        const templatesTab = screen.getByRole('tab', { name: /templates/i });
        await user.click(templatesTab);

        expect(screen.getByText(/templates coming soon/i)).toBeInTheDocument();
        expect(screen.queryByText('Short Text')).not.toBeInTheDocument();
    });

    it('calls onFieldClick when a field is clicked', async () => {
        const onFieldClick = vi.fn();
        const user = userEvent.setup();
        render(<TabsLine onFieldClick={onFieldClick} />);

        const textFieldButton = screen.getByText('Short Text');
        await user.click(textFieldButton);

        expect(onFieldClick).toHaveBeenCalledWith('text');
    });
});
