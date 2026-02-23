import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RouterProvider, createMemoryHistory, createRootRoute, createRouter } from '@tanstack/react-router';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

// Mock useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
    useIsMobile: vi.fn(() => false),
}));

// Mock auth-client
vi.mock('@/lib/auth-client', () => ({
    authClient: {
        useSession: vi.fn(() => ({
            data: {
                user: {
                    name: 'Test User',
                    email: 'test@example.com',
                },
            },
        })),
        signOut: vi.fn(),
    },
}));

// Create a simple router for testing
const rootRoute = createRootRoute({
    component: () => <AppSidebar />,
});

const createTestRouter = () => {
    const history = createMemoryHistory();
    return createRouter({
        routeTree: rootRoute,
        history,
    });
};

describe('AppSidebar', () => {
    it('renders the sidebar with correct title', async () => {
        const router = createTestRouter();
        render(
            <SidebarProvider>
                <RouterProvider router={router} />
            </SidebarProvider>
        );
        expect(await screen.findByText('Form Builder')).toBeInTheDocument();
    });

    it('renders navigation links', async () => {
        const router = createTestRouter();
        render(
            <SidebarProvider>
                <RouterProvider router={router} />
            </SidebarProvider>
        );
        expect(await screen.findByText('Dashboard')).toBeInTheDocument();
        expect(await screen.findByText('Editor')).toBeInTheDocument();
        expect(await screen.findByText('Analytics')).toBeInTheDocument();
        expect(await screen.findByText('Settings')).toBeInTheDocument();
    });
});
