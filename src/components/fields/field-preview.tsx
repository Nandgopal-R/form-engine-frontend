import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Star } from "lucide-react"

export interface CanvasField {
    id: string
    type: string
    label: string
}

interface FieldPreviewProps {
    field: CanvasField
    onRemove?: (id: string) => void
}

export function FieldPreview({ field, onRemove }: FieldPreviewProps) {
    return (
        <Card className="p-4 group relative border-dashed border-2 shadow-none">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove?.(field.id)}
            >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>

            <div className="space-y-2">
                <Label>{field.label}</Label>
                {renderFieldInput(field.type)}
            </div>
        </Card>
    )
}



function renderFieldInput(type: string) {
    switch (type) {
        case "text":
            return <Input placeholder="Enter text..." />
        case "textarea":
            return (
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter long text..."
                />
            )
        case "number":
            return <Input type="number" placeholder="Enter number..." />
        case "email":
            return <Input type="email" placeholder="name@example.com" />
        case "url":
            return <Input type="url" placeholder="https://example.com" />
        case "phone":
            return <Input type="tel" placeholder="+1 (555) 000-0000" />
        case "checkbox":
            return (
                <div className="flex items-center gap-2">
                    <Checkbox id="checkbox-preview" />
                    <Label htmlFor="checkbox-preview" className="text-sm font-normal">Option</Label>
                </div>
            )
        case "radio":
            return (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <input type="radio" name="radio-preview" id="radio-1" className="h-4 w-4" />
                        <Label htmlFor="radio-1" className="text-sm font-normal">Option 1</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="radio" name="radio-preview" id="radio-2" className="h-4 w-4" />
                        <Label htmlFor="radio-2" className="text-sm font-normal">Option 2</Label>
                    </div>
                </div>
            )
        case "dropdown":
            return (
                <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                    <option>Select an option...</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                </select>
            )
        case "date":
            return <Input type="date" />
        case "time":
            return <Input type="time" />
        case "toggle":
            return (
                <div className="flex items-center space-x-2">
                    <Checkbox id="toggle-preview" className="h-6 w-11 rounded-full data-[state=checked]:bg-primary data-[state=unchecked]:bg-input transition-colors cursor-pointer" />
                    <Label htmlFor="toggle-preview">Toggle me</Label>
                </div>
            )
        case "slider":
            return (
                <div className="w-full">
                    <input type="range" className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1</span>
                        <span>10</span>
                    </div>
                </div>
            )
        case "rating":
            return (
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-6 w-6 text-muted-foreground hover:text-yellow-400 cursor-pointer transition-colors" />
                    ))}
                </div>
            )
        case "file":
            return <Input type="file" className="cursor-pointer" />
        case "section":
            return <div className="h-px w-full bg-border my-2" />
        default:
            return <Input placeholder="Enter value..." />
    }
}
