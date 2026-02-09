import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from './switch';
import { Slider } from './slider';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from './sheet';

describe('Interactive UI Components', () => {
    describe('Switch', () => {
        it('renders and status reflects change', () => {
            const onCheckedChange = vi.fn();
            render(<Switch onCheckedChange={onCheckedChange} />);
            const switchEl = screen.getByRole('switch');

            fireEvent.click(switchEl);
            expect(onCheckedChange).toHaveBeenCalledWith(true);
        });

        it('renders with different sizes', () => {
            const { rerender } = render(<Switch size="sm" />);
            expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'sm');

            rerender(<Switch size="default" />);
            expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'default');
        });
    });

    describe('Slider', () => {
        it('renders correctly', () => {
            const { container } = render(<Slider defaultValue={[50]} min={0} max={100} />);
            const sliderRoot = container.querySelector('[data-slot="slider"]');
            expect(sliderRoot).toBeInTheDocument();
        });
    });

    describe('Sheet', () => {
        it('renders trigger', () => {
            render(
                <Sheet>
                    <SheetTrigger>Open Sheet</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Title</SheetTitle>
                    </SheetContent>
                </Sheet>
            );
            expect(screen.getByText('Open Sheet')).toBeInTheDocument();
        });
    });
});
