import { useState } from "react"
import { GripVertical, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FieldRenderer } from "./field-renderer"
import type { CanvasField } from "./field-preview"

interface BuilderFieldCardProps {
    field: CanvasField
    onUpdate: (updatedField: CanvasField) => void
    onRemove?: (id: string) => void
    onDuplicate?: (field: CanvasField) => void
}

export function BuilderFieldCard({ field, onUpdate, onRemove, onDuplicate }: BuilderFieldCardProps) {
    const [isOpen, setIsOpen] = useState(true)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    }

    const handleChange = (key: keyof CanvasField, value: any) => {
        onUpdate({ ...field, [key]: value })
    }

    const isFullWidth = ["textarea", "file", "image", "section", "address", "checkbox-group", "radio", "multi-select"].includes(field.type) || field.type.includes("question")

    return (
        <Collapsible
            ref={setNodeRef}
            style={style}
            open={isOpen}
            onOpenChange={setIsOpen}
            className={cn(
                "group/card w-full transition-all duration-300",
                isFullWidth ? "md:col-span-2" : "md:col-span-1",
                isDragging && "opacity-50 scale-[0.98] rotate-1 shadow-2xl ring-2 ring-[#E89E45]"
            )}
        >
            {/* Card Header */}
            <div className="flex items-center gap-3 p-4 pr-6 bg-[#FDFBF7] border-b border-transparent data-[state=open]:border-[#E5E1D8]/50 transition-colors">

                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move text-[#D0C9BA] hover:text-[#A0998A] transition-colors p-1"
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                {/* Field Icon (Optional - based on type) */}
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F2EA] text-[#8A8476]">
                    <span className="text-xs font-mono font-bold uppercase">{field.type.slice(0, 2)}</span>
                </div>

                {/* Header Label (Preview) */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#4A4538] truncate">
                        {field.label || "Untitled Field"}
                    </h3>
                    <p className="text-xs text-[#9A9486] truncate">
                        {field.type} • {field.required ? "Required" : "Optional"}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#9A9486] hover:text-[#4A4538] hover:bg-[#F5F2EA]"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDuplicate?.(field)
                        }}
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#9A9486] hover:text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemove?.(field.id)
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* Expand Toggle */}
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9A9486] hover:bg-[#F5F2EA]">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                </CollapsibleTrigger>
            </div>

            {/* Config Body */}
            <CollapsibleContent className="p-6 pt-2 space-y-6 animate-slide-down">

                {/* Live Preview Section */}
                <div className="bg-[#FDFBF7]/50 rounded-2xl border border-[#E5E1D8]/50 p-6 mb-2">
                    <div className="text-[10px] font-bold text-[#BBB5A5] uppercase tracking-widest mb-4">Live Preview</div>
                    <FieldRenderer
                        field={field}
                        value={['checkbox-group', 'multi-select'].includes(field.type) ? [] : ""}
                        onChange={() => { }} // Non-persistent in preview
                    />
                </div>

                {/* Section Header */}
                <div className="text-xs font-semibold text-[#9A9486] uppercase tracking-wider mb-2 border-b border-[#E5E1D8]/30 pb-2">
                    Attribute Configuration
                </div>

                {/* Top Row: Label */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-[#4A4538]">Label attribute <span className="text-red-500">*</span></Label>
                    </div>
                    <Input
                        value={field.label}
                        onChange={(e) => handleChange("label", e.target.value)}
                        className="bg-white border-[#E5E1D8] focus:border-[#D0C9BA] focus:ring-[#D0C9BA]/30 text-[#4A4538] placeholder:text-[#BBB5A5] rounded-xl h-11"
                        placeholder="Enter label..."
                    />
                </div>

                {/* Middle Row: Name & Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-[#4A4538]">Name attribute <span className="text-red-500">*</span></Label>
                        <Input
                            value={field.id}
                            disabled
                            className="bg-[#F5F2EA]/50 border-[#E5E1D8] text-[#9A9486] font-mono text-xs rounded-xl h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-[#4A4538]">Placeholder attribute</Label>
                        <Input
                            value={field.placeholder || ""}
                            onChange={(e) => handleChange("placeholder", e.target.value)}
                            className="bg-white border-[#E5E1D8] focus:border-[#D0C9BA] focus:ring-[#D0C9BA]/30 text-[#4A4538] placeholder:text-[#BBB5A5] rounded-xl h-11"
                            placeholder="Enter placeholder..."
                        />
                    </div>
                </div>

                {/* Bottom Row: Type */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-[#4A4538]">Type attribute <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <select
                            value={field.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            className="w-full appearance-none bg-white border border-[#E5E1D8] text-[#4A4538] text-sm rounded-xl px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#D0C9BA]/30 focus:border-[#D0C9BA] transition-all cursor-pointer"
                        >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="password">Password</option>
                            <option value="textarea">Long Text</option>
                            <option value="checkbox">Checkbox (Single)</option>
                            <option value="checkbox-group">Checkbox Group</option>
                            <option value="radio">Radio Group</option>
                            <option value="dropdown">Dropdown (Single)</option>
                            <option value="multi-select">Multi Select</option>
                            <option value="switch">Switch</option>
                            <option value="slider">Range Slider</option>
                            <option value="rating">Star Rating</option>
                            <option value="currency">Currency</option>
                            <option value="percent">Percentage</option>
                            <option value="country">Country</option>
                            <option value="state">State</option>
                            <option value="city">City</option>
                            <option value="zip">Zip Code</option>
                            <option value="address">Address</option>
                            <option value="payment">Payment</option>
                            <option value="date">Date</option>
                            <option value="time">Time</option>
                            <option value="datetime">Date & Time</option>
                            <option value="url">URL</option>
                            <option value="file">File Upload</option>
                            <option value="image">Image Upload</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9A9486]">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Options Editor (Conditional) */}
                {["dropdown", "radio", "checkbox", "multi-select", "checkbox-group"].includes(field.type) && (
                    <div className="space-y-2 p-4 bg-white/50 rounded-xl border border-[#E5E1D8]/50">
                        <Label className="text-xs font-semibold text-[#4A4538]">Options</Label>
                        {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                            <div key={i} className="flex gap-2">
                                <Input
                                    value={opt}
                                    onChange={(e) => {
                                        const newOptions = [...(field.options || [])];
                                        newOptions[i] = e.target.value;
                                        handleChange("options", newOptions);
                                    }}
                                    className="bg-white border-[#E5E1D8] h-9 text-sm"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-red-400 hover:bg-red-50"
                                    onClick={() => {
                                        const newOptions = (field.options || []).filter((_, idx) => idx !== i);
                                        handleChange("options", newOptions);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed border-[#E5E1D8] text-[#9A9486] hover:text-[#4A4538]"
                            onClick={() => {
                                const newOptions = [...(field.options || []), `Option ${(field.options || []).length + 1}`];
                                handleChange("options", newOptions);
                            }}
                        >
                            Add Option
                        </Button>
                    </div>
                )}

                {/* Validation Toggles */}
                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={`req-${field.id}`}
                            checked={field.required}
                            onCheckedChange={(c) => handleChange("required", c === true)}
                            className="border-[#D0C9BA] data-[state=checked]:bg-[#E89E45] data-[state=checked]:border-[#E89E45] text-white rounded-md w-5 h-5 transition-all"
                        />
                        <Label htmlFor={`req-${field.id}`} className="text-sm font-medium text-[#4A4538] cursor-pointer">Required</Label>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                        <Checkbox
                            id={`dis-${field.id}`}
                            disabled
                            className="border-[#E5E1D8]"
                        />
                        <Label htmlFor={`dis-${field.id}`} className="text-sm font-medium text-[#9A9486]">Disabled</Label>
                    </div>
                </div>

            </CollapsibleContent>
        </Collapsible>
    )
}
