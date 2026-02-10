/**
 * Editor Canvas Component
 *
 * This component provides the main editing interface for forms with two modes:
 *
 * Edit Mode:
 * - Allows editing form title and description
 * - Shows form fields with edit/remove controls
 * - Real-time field property changes
 *
 * Preview Mode:
 * - Shows how form will look to end users
 * - Displays fields in a clean, finalized layout
 * - Shows submit button (disabled) for completeness
 *
 * The canvas serves as the central hub where users can see their form
 * structure and make changes to individual fields or form metadata.
 */

import { Save } from 'lucide-react'
import { FieldPreview, renderFieldInput } from './fields/field-preview'
import type { CanvasField } from './fields/field-preview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EditorCanvasProps {
  fields: Array<CanvasField> // Current form fields
  formTitle: string // Current form title
  formDescription: string // Current form description
  onTitleChange: (title: string) => void // Title change handler
  onDescriptionChange: (description: string) => void // Description change handler
  onRemoveField?: (id: string) => void // Field removal handler
  onEditField?: (field: CanvasField) => void // Field editing handler
  onSave?: () => void // Save handler
  onUpdateTitle?: () => void // Title update handler (for dedicated title mode)
  isSaving?: boolean // Loading state for save button
  showFormTitleInput?: boolean // Whether to show dedicated title input
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
        {/* Header with save button and mode switcher */}
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

        {/* Edit Mode - Form building interface */}
        <TabsContent value="edit" className="flex-1 overflow-y-auto p-6 mt-0">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Form Title & Description Section */}
            <div className="space-y-4 pb-6 border-b">
              {showFormTitleInput ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="form-title-input"
                      className="block text-sm font-medium mb-2"
                    >
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
                    <label
                      htmlFor="form-description-input"
                      className="block text-sm font-medium mb-2"
                    >
                      Description{' '}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
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

        {/* Preview Mode - Shows how form will look to users */}
        <TabsContent
          value="preview"
          className="flex-1 overflow-y-auto p-6 mt-0 bg-gradient-to-b from-muted/30 to-muted/10"
        >
          <div className="max-w-2xl mx-auto">
            {/* Form Header - styled like a real form */}
            <div className="bg-primary rounded-t-lg p-6 text-primary-foreground">
              <h1 className="text-2xl font-bold tracking-tight">
                {formTitle || 'Untitled Form'}
              </h1>
              {formDescription && (
                <p className="text-primary-foreground/80 mt-2">
                  {formDescription}
                </p>
              )}
            </div>

            {/* Form Body with all fields */}
            <div className="bg-background border-x border-b border-border rounded-b-lg p-8">
              {fields.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No fields to preview yet.
                </p>
              ) : (
                <>
                  <div className="divide-y divide-border">
                    {fields.map((field) => (
                      <Field
                        key={field.id}
                        className="space-y-2 py-5 first:pt-0 last:pb-0"
                      >
                        <FieldLabel className="flex items-center gap-1 text-sm font-medium">
                          {field.label}
                          {field.required && (
                            <span className="text-destructive">*</span>
                          )}
                        </FieldLabel>
                        <FieldContent>{renderFieldInput(field)}</FieldContent>
                      </Field>
                    ))}
                  </div>

                  {/* Preview Submit Button - always disabled for safety */}
                  <div className="pt-6 border-t border-border mt-8">
                    <Button disabled className="w-full sm:w-auto">
                      Submit
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      This is a preview. Submissions are disabled.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
