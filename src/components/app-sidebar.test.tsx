import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

// Mock useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
    useIsMobile: vi.fn(() => false),
}));

describe('AppSidebar', () => {
    it('renders the sidebar with correct title', () => {
        render(
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>
        );
        expect(screen.getByText('Form Builder')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>
        );
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Editor')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });
});
