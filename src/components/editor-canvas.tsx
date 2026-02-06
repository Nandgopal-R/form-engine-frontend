import { BuilderFieldCard } from "./fields/builder-field-card"
import type { CanvasField } from "./fields/field-preview"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable"

interface EditorCanvasProps {
    fields: CanvasField[]
    onRemoveField?: (id: string) => void
    onUpdateField?: (field: CanvasField) => void
    onDragEnd?: (event: any) => void
}

export function EditorCanvas({ fields, onRemoveField, onUpdateField, onDragEnd }: EditorCanvasProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )
    if (fields.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium">No fields added</p>
                    <p className="text-sm">Click on fields from the sidebar to add them here</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-3xl mx-auto min-h-[calc(100vh-4rem)] bg-transparent space-y-8 relative transition-all duration-300">

                {/* Canvas Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-[#4A4538] tracking-tight">Untitled Form</h1>
                    <p className="text-[#9A9486] font-medium">Customize your form layout below</p>
                </div>

                {/* Main Form Container */}
                <div className="bg-white rounded-3xl shadow-sm border border-[#E5E1D8] p-8 md:p-10">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={fields.map(f => f.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <BuilderFieldCard
                                        key={field.id}
                                        field={field}
                                        onRemove={onRemoveField}
                                        onUpdate={(updated) => onUpdateField?.(updated)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* Drop Zone Indication - Inside the card for flow */}
                    <div className="mt-8 h-24 border-2 border-dashed border-[#E5E1D8] rounded-2xl flex items-center justify-center bg-[#FDFBF7]/50 text-[#9A9486] text-sm font-medium hover:bg-[#FDFBF7] hover:border-[#D0C9BA] hover:text-[#4A4538] transition-all cursor-default">
                        Add more fields
                    </div>
                </div>
            </div>

            <div className="h-10" /> {/* Bottom spacer for scroll */}
        </div>
    )
}
