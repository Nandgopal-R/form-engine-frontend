import { Save } from 'lucide-react'
import { FieldPreview, renderFieldInput } from './fields/field-preview'
import type { CanvasField } from './fields/field-preview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EditorCanvasProps {
  fields: Array<CanvasField>
  formTitle: string
  formDescription: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onRemoveField?: (id: string) => void
  onEditField?: (field: CanvasField) => void
  onSave?: () => void
  onUpdateTitle?: () => void
  isSaving?: boolean
  showFormTitleInput?: boolean
}

export function EditorCanvas({
  fields,
  formTitle,
  formDescription,
  onTitleChange,
  onDescriptionChange,
  onRemoveField,
  onEditField,
  onSave,
  onUpdateTitle,
  isSaving,
  showFormTitleInput = false,
}: EditorCanvasProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="edit" className="flex-1 flex flex-col h-full">
        <div className="flex justify-end items-center px-6 py-2 border-b bg-background gap-2">
          <Button
            size="sm"
            onClick={onSave}
            className="gap-2"
            disabled={isSaving || !formTitle.trim()}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Form'}
          </Button>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="flex-1 overflow-y-auto p-6 mt-0">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Form Title & Description */}
            <div className="space-y-4 pb-6 border-b">
              {showFormTitleInput ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="form-title-input" className="block text-sm font-medium mb-2">
                      Form Title <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="form-title-input"
                      value={formTitle}
                      onChange={(e) => onTitleChange(e.target.value)}
                      placeholder="Enter form title..."
                      className="text-lg font-semibold"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-description-input" className="block text-sm font-medium mb-2">
                      Description <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <textarea
                      id="form-description-input"
                      value={formDescription || ''}
                      onChange={(e) => onDescriptionChange(e.target.value)}
                      placeholder="Describe what this form is for..."
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    value={formTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Form Title"
                    className="text-2xl font-bold h-auto py-2 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onUpdateTitle}
                    disabled={isSaving || !formTitle.trim()}
                  >
                    Change Title
                  </Button>
                </div>
              )}

              {!showFormTitleInput && (
                <div className="space-y-2">
                  <textarea
                    // Adding || "" ensures the value is never undefined
                    value={formDescription || ''}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Add a description for your form (optional)"
                    className="w-full text-sm text-muted-foreground bg-transparent border-0 resize-none focus:outline-none focus:ring-0 min-h-[60px] px-0"
                    rows={2}
                  />
                </div>
              )}
            </div>

            {/* Fields */}
            {fields.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <p className="text-lg font-medium">No fields added</p>
                <p className="text-sm">
                  Click on fields from the sidebar to add them here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field) => (
                  <FieldPreview
                    key={field.id}
                    field={field}
                    onRemove={onRemoveField}
                    onEdit={onEditField}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="preview"
          className="flex-1 overflow-y-auto p-6 mt-0 bg-muted/20"
        >
          <div className="max-w-2xl mx-auto p-8 bg-card rounded-xl shadow-sm border space-y-6">
            <div className="space-y-2 mb-8">
              <h1 className="text-2xl font-bold tracking-tight">
                {formTitle || 'Untitled Form'}
              </h1>
              {formDescription && (
                <p className="text-muted-foreground">{formDescription}</p>
              )}
            </div>
            {fields.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No fields to preview yet.
              </p>
            ) : (
              fields.map((field) => (
                <Field key={field.id} className="space-y-2">
                  <FieldLabel className="flex items-center gap-1">
                    {field.label}
                    {field.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </FieldLabel>
                  <FieldContent>{renderFieldInput(field)}</FieldContent>
                </Field>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
