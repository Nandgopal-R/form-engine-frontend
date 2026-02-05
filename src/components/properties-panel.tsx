import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import type { CanvasField } from "@/components/fields/field-preview"

interface PropertiesPanelProps {
    field: CanvasField
    onUpdate: (field: CanvasField) => void
    onClose: () => void
}

export function PropertiesPanel({ field, onUpdate, onClose }: PropertiesPanelProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-sm">Field Properties</span>
            </div>

            <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                        value={field.label}
                        onChange={(e) => onUpdate({ ...field, label: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                        value={field.placeholder || ""}
                        onChange={(e) => onUpdate({ ...field, placeholder: e.target.value })}
                        placeholder="Enter placeholder text..."
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="required-check" className="cursor-pointer">Required</Label>
                    <Checkbox
                        id="required-check"
                        checked={field.required || false}
                        onCheckedChange={(checked) => onUpdate({ ...field, required: checked === true })}
                    />
                </div>

                {["dropdown", "radio", "checkbox-group", "multi-select", "checkbox"].includes(field.type) && (
                    <div className="space-y-2">
                        <Label>Options (one per line)</Label>
                        <Textarea
                            value={(field.options || []).join("\n")}
                            onChange={(e) => onUpdate({ ...field, options: e.target.value.split("\n") })}
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            className="min-h-[100px]"
                        />
                    </div>
                )}

                <Separator />

                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Field Type</Label>
                    <div className="text-sm font-medium capitalize">{field.type}</div>
                    <div className="text-xs text-muted-foreground font-mono">{field.id.split('-')[0]}</div>
                </div>
            </div>
        </div>
    )
}
