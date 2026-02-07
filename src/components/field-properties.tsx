import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { CanvasField } from "./fields/field-preview"
import { Switch } from "@/components/ui/switch"

interface FieldPropertiesProps {
    field: CanvasField | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (field: CanvasField) => void
}

export function FieldProperties({ field, open, onOpenChange, onSave }: FieldPropertiesProps) {
    const [label, setLabel] = useState("")
    const [required, setRequired] = useState(false)
    const [placeholder, setPlaceholder] = useState("")

    useEffect(() => {
        if (field) {
            setLabel(field.label || "")
            // standardizing: field might not have these properties yet, so need to extend CanvasField type or cast
            setRequired((field as any).required || false)
            setPlaceholder((field as any).placeholder || "")
        }
    }, [field])

    const handleSave = () => {
        if (!field) return
        onSave({
            ...field,
            label,
            // @ts-ignore
            required,
            placeholder,
        })
        onOpenChange(false)
    }

    if (!field) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Field Properties</DialogTitle>
                    <DialogDescription>
                        Edit the properties for the {field.type} field.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="label">Label</FieldLabel>
                            <Input
                                id="label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="Field Label"
                            />
                            <FieldDescription>
                                The label displayed above the field.
                            </FieldDescription>
                        </Field>

                        {/* Placeholder for text-like inputs */}
                        {["text", "textarea", "email", "url", "phone", "number"].includes(field.type) && (
                            <Field>
                                <FieldLabel htmlFor="placeholder">Placeholder</FieldLabel>
                                <Input
                                    id="placeholder"
                                    value={placeholder}
                                    onChange={(e) => setPlaceholder(e.target.value)}
                                    placeholder="Placeholder text"
                                />
                            </Field>
                        )}

                        <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FieldLabel className="text-base">Required</FieldLabel>
                                <FieldDescription>
                                    Mark this field as mandatory.
                                </FieldDescription>
                            </div>
                            <Switch
                                checked={required}
                                onCheckedChange={setRequired}
                            />
                        </Field>
                    </FieldGroup>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
