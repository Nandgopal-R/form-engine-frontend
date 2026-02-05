import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

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
        case "number":
            return <Input type="number" placeholder="Enter number..." />
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
        default:
            return <Input placeholder="Enter value..." />
    }
}
