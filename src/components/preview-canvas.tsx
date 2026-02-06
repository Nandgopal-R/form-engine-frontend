import { useState } from "react"
import { FieldRenderer } from "./fields/field-renderer"
import type { CanvasField } from "./fields/field-preview"
import { Button } from "@/components/ui/button"

interface PreviewCanvasProps {
    fields: CanvasField[]
}

export function PreviewCanvas({ fields }: PreviewCanvasProps) {
    const [formData, setFormData] = useState<Record<string, any>>({})

    const handleValueChange = (id: string, val: any) => {
        setFormData((prev: any) => {
            const newData = { ...prev, [id]: val }

            // Cascading clear logic based on field types
            const updatedField = fields.find(f => f.id === id)
            if (updatedField?.type === "country") {
                // Find and clear state/city fields
                fields.forEach(f => {
                    if (f.type === "state" || f.type === "city") delete newData[f.id]
                })
            } else if (updatedField?.type === "state") {
                // Find and clear city fields
                fields.forEach(f => {
                    if (f.type === "city") delete newData[f.id]
                })
            }

            return newData
        })
    }

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-2xl mx-auto min-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-[#E5E1D8] p-10 md:p-14 space-y-10 relative transition-all duration-300">
                {/* Form Header */}
                <div className="space-y-4 pb-10 border-b border-[#E5E1D8]/60">
                    <h1 className="text-5xl font-black text-[#4A4538] tracking-tight leading-none">Untitled Form</h1>
                    <p className="text-[#9A9486] font-medium text-xl leading-relaxed max-w-xl">This is a live preview of your form. You can interact with all fields and check validations.</p>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    {fields.length === 0 ? (
                        <div className="col-span-2 py-20 text-center text-[#9A9486] italic">
                            No fields added yet. Switch back to Editor to design your form.
                        </div>
                    ) : (
                        fields.map((field) => {
                            const isFullWidth = ["textarea", "file", "image", "section", "address", "checkbox-group", "radio", "multi-select"].includes(field.type) || field.type.includes("question")
                            return (
                                <div key={field.id} className={isFullWidth ? "md:col-span-2" : "md:col-span-1"}>
                                    <FieldRenderer
                                        field={field}
                                        value={formData[field.id]}
                                        onChange={(val) => handleValueChange(field.id, val)}
                                        formData={Object.fromEntries(
                                            fields.map(f => [f.type, formData[f.id]])
                                        )}
                                    />
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Form Footer / Submit */}
                {fields.length > 0 && (
                    <div className="pt-12 border-t border-[#E5E1D8]/50 flex justify-end">
                        <Button className="bg-[#E89E45] hover:bg-[#D48931] text-white px-10 h-14 text-lg font-bold rounded-2xl shadow-lg shadow-[#E89E45]/20 transition-all font-mono uppercase tracking-widest">
                            Submit Form
                        </Button>
                    </div>
                )}
            </div>

            <div className="max-w-2xl mx-auto mt-8 text-center">
                <p className="text-[#9A9486] text-sm font-medium">Built with <span className="font-bold text-[#4A4538]">TanCN Form Builder</span></p>
            </div>
        </div>
    )
}
