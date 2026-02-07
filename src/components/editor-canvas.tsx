import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { FieldPreview, renderFieldInput, type CanvasField } from "./fields/field-preview"

interface EditorCanvasProps {
    fields: CanvasField[]
    onRemoveField?: (id: string) => void
    onEditField?: (field: CanvasField) => void
}

export function EditorCanvas({ fields, onRemoveField, onEditField }: EditorCanvasProps) {
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
        <div className="h-full flex flex-col">
            <Tabs defaultValue="edit" className="flex-1 flex flex-col h-full">
                <div className="flex justify-end px-6 py-2 border-b bg-background">
                    <TabsList>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit" className="flex-1 overflow-y-auto p-6 mt-0">
                    <div className="max-w-2xl mx-auto space-y-4">
                        {fields.map((field) => (
                            <FieldPreview
                                key={field.id}
                                field={field}
                                onRemove={onRemoveField}
                                onEdit={onEditField}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="preview" className="flex-1 overflow-y-auto p-6 mt-0 bg-muted/20">
                    <div className="max-w-2xl mx-auto p-8 bg-card rounded-xl shadow-sm border space-y-6">
                        <div className="space-y-2 mb-8">
                            <h1 className="text-2xl font-bold tracking-tight">Form Preview</h1>
                            <p className="text-muted-foreground">This is how your users will see the form.</p>
                        </div>
                        {fields.map((field) => (
                            <Field key={field.id} className="space-y-2">
                                <FieldLabel className="flex items-center gap-1">
                                    {field.label}
                                    {field.required && <span className="text-destructive">*</span>}
                                </FieldLabel>
                                <FieldContent>
                                    {renderFieldInput(field)}
                                </FieldContent>
                            </Field>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
