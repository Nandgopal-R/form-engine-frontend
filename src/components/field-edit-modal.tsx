import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Save, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CanvasField } from "@/components/fields/field-preview"

interface FieldEditModalProps {
    field: CanvasField | null
    isOpen: boolean
    onClose: () => void
    onSave: (updatedField: CanvasField) => void
}


export function FieldEditModal({ field, isOpen, onClose, onSave }: FieldEditModalProps) {
    const [localField, setLocalField] = useState<CanvasField | null>(null)
    const [isClosing, setIsClosing] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    // Sync state when field opens and handle scroll lock
    useEffect(() => {
        if (isOpen && field) {
            setLocalField({ ...field })
            setIsClosing(false)
            // Lock body scroll
            document.body.style.overflow = "hidden"
        } else {
            // Unlock body scroll
            document.body.style.overflow = ""
        }

        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen, field])

    /* Handle close animation */
    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            onClose()
            setIsClosing(false)
        }, 200)
    }

    /* Save Handler */
    const handleSave = () => {
        if (localField) {
            onSave(localField)
            handleClose()
        }
    }

    if (!mounted || !isOpen || !localField) return null

    return createPortal(
        <div className={cn(
            "fixed inset-0 z-[9999] flex items-center justify-center isolate",
            "transition-all duration-300 ease-out",
            isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className={cn(
                "relative w-full max-w-lg bg-[#0F1117]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[10000]",
                "transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)",
                isClosing ? "scale-95 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
                    <div>
                        <h2 className="text-lg font-semibold text-white tracking-tight">Edit Field</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Customize the properties for this {localField.type} field.</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">

                    {/* Label Input */}
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider text-gray-500">Field Label</Label>
                        <Input
                            value={localField.label}
                            onChange={(e) => setLocalField({ ...localField, label: e.target.value })}
                            className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all h-11"
                        />
                    </div>

                    {/* Placeholder Logic Helper */}
                    {(() => {
                        const getDetailsForType = (type: string) => {
                            switch (type) {
                                case "text": return { show: true, placeholder: "Enter your text..." };
                                case "textarea": return { show: true, placeholder: "Enter detailed description..." };
                                case "email": return { show: true, placeholder: "Enter your @gmail.com address..." };
                                case "phone": return { show: true, placeholder: "Enter 10-digit phone number..." };
                                case "password": return { show: true, placeholder: "Enter your password..." };
                                case "url": return { show: true, placeholder: "Enter website URL (https://example.com)" };
                                case "number": return { show: true, placeholder: "Enter a number..." };

                                case "country": return { show: true, placeholder: "Select your country..." };
                                case "city": return { show: true, placeholder: "Select your city..." };
                                case "address": return { show: true, placeholder: "Enter your full address..." };
                                case "dropdown": return { show: true, placeholder: "Select an option..." };
                                case "multi-select": return { show: true, placeholder: "Select options..." };
                                case "file": return { show: true, placeholder: "Upload a file..." };
                                case "image": return { show: true, placeholder: "Upload an image..." };
                                case "zip": return { show: true, placeholder: "Enter zip code..." };
                                // Hidden fields
                                case "checkbox":
                                case "radio":
                                case "switch":
                                case "rating":
                                case "slider":
                                case "range":
                                case "date":
                                case "time":
                                case "datetime":
                                case "datetime-local":
                                    return { show: false, placeholder: "" };

                                default:
                                    return { show: true, placeholder: `Enter ${type}...` };
                            }
                        }

                        const { show, placeholder } = getDetailsForType(localField.type);

                        if (!show) return null;

                        return (
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold tracking-wider text-gray-500">Placeholder</Label>
                                <Input
                                    value={localField.placeholder || ""}
                                    onChange={(e) => setLocalField({ ...localField, placeholder: e.target.value })}
                                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all h-11"
                                    placeholder={placeholder}
                                />
                            </div>
                        )
                    })()}

                    <Separator className="bg-white/5" />

                    {/* Validation Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
                        onClick={() => setLocalField({ ...localField, required: !localField.required })}>
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-white cursor-pointer">Required Field</Label>
                            <p className="text-xs text-gray-500">Users must fill this out before submitting.</p>
                        </div>
                        <Checkbox
                            checked={localField.required || false}
                            onCheckedChange={(checked) => setLocalField({ ...localField, required: checked === true })}
                            className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                    </div>



                    {/* Options (Conditional) */}
                    {["dropdown", "radio", "checkbox-group", "multi-select", "checkbox"].includes(localField.type) && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs uppercase font-bold tracking-wider text-gray-500">Options</Label>
                                <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">{(localField.options || []).length} items</span>
                            </div>

                            <div className="space-y-2">
                                {(localField.options || ["Option 1", "Option 2"]).map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2 group/option">
                                        <Input
                                            value={opt}
                                            onChange={(e) => {
                                                const newOptions = [...(localField.options || [])]
                                                newOptions[i] = e.target.value
                                                setLocalField({ ...localField, options: newOptions })
                                            }}
                                            className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all h-10 flex-1"
                                            placeholder={`Option ${i + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                const newOptions = (localField.options || []).filter((_, idx) => idx !== i)
                                                setLocalField({ ...localField, options: newOptions })
                                            }}
                                            className="h-10 w-10 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover/option:opacity-100 focus:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    const newOptions = [...(localField.options || []), `Option ${(localField.options || []).length + 1}`]
                                    setLocalField({ ...localField, options: newOptions })
                                }}
                                className="w-full border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 h-10 border-dashed"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div >,
        document.body
    )
}
