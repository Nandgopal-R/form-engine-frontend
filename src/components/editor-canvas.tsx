import { FieldPreview, type CanvasField } from "./fields/field-preview"

interface EditorCanvasProps {
    fields: CanvasField[]
    onRemoveField?: (id: string) => void
}

export function EditorCanvas({ fields, onRemoveField }: EditorCanvasProps) {
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
        <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-2">
                {fields.map((field) => (
                    <FieldPreview
                        key={field.id}
                        field={field}
                        onRemove={onRemoveField}
                    />
                ))}
            </div>
        </div>
    )
}
