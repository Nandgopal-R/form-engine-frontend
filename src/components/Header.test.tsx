import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

// Mock TanStack Router Link
vi.mock('@tanstack/react-router', () => ({
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe('Header', () => {
    it('renders the logo', () => {
        render(<Header />);
        expect(screen.getByAltText('TanStack Logo')).toBeInTheDocument();
    });

    it('opens and closes the mobile menu', async () => {
        const user = userEvent.setup();
        render(<Header />);

        const openButton = screen.getByLabelText(/open menu/i);
        await user.click(openButton);

        expect(screen.getByText('Navigation')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();

        const closeButton = screen.getByLabelText(/close menu/i);
        await user.click(closeButton);

        // Wait for transition if any, but since we are in JSDOM we can check immediately or wait
        // The aside uses translate-x-full to hide, so it might still be in the DOM but hidden
        const aside = screen.getByRole('complementary', { hidden: true });
        expect(aside).toHaveClass('-translate-x-full');
    });
});
