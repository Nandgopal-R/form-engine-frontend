import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { FileText, Loader2, Sparkles } from 'lucide-react'
import type { CanvasField } from '@/components/fields/field-preview'
import type { CreateFormInput } from '@/api/forms'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { FieldSidebar } from '@/components/field-sidebar'
import { EditorCanvas } from '@/components/editor-canvas'
import { FieldProperties } from '@/components/field-properties'
import { formsApi } from '@/api/forms'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_layout/editor/')({
  component: EditorComponent,
})

const FIELD_LABELS: Record<string, string> = {
  text: 'Text Input',
  number: 'Number Input',
  checkbox: 'Checkbox',
  radio: 'Radio Group',
  dropdown: 'Dropdown',
  date: 'Date Picker',
  textarea: 'Long Text',
  email: 'Email',
  url: 'Website',
  phone: 'Phone Number',
  time: 'Time Picker',
  toggle: 'Toggle Switch',
  slider: 'Scale',
  rating: 'Rating',
  file: 'File Upload',
  section: 'Section Header',
}

function EditorComponent() {
  const navigate = useNavigate()
  const [fields, setFields] = useState<Array<CanvasField>>([])
  const [editingField, setEditingField] = useState<CanvasField | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const [dialogOpen, setDialogOpen] = useState(true)
  const [newFormTitle, setNewFormTitle] = useState('')
  const [newFormDescription, setNewFormDescription] = useState('')

  // useMutation for creating a new form from dialog
  const createFormMutation = useMutation({
    mutationFn: (data: CreateFormInput) => formsApi.create(data),
    onSuccess: (data) => {
      console.log('Form created successfully!', data)
      setDialogOpen(false)
      navigate({ to: '/editor/$formId', params: { formId: data.id } })
    },
    onError: (error) => {
      console.error('Failed to create form:', error.message)
    },
  })

  // useMutation for saving form from canvas (legacy)
  const saveFormMutation = useMutation({
    mutationFn: (data: CreateFormInput) => formsApi.create(data),
    onSuccess: (data) => {
      console.log('Form saved successfully!', data)
      navigate({ to: '/editor/$formId', params: { formId: data.id } })
    },
    onError: (error) => {
      console.error('Failed to save form:', error.message)
    },
  })

  const handleFieldClick = (fieldId: string) => {
    const newField: CanvasField = {
      id: `${fieldId}-${Date.now()}`,
      type: fieldId,
      label: FIELD_LABELS[fieldId] || fieldId,
    }
    setFields((prev) => [...prev, newField])
  }

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  const handleEditField = (field: CanvasField) => {
    setEditingField(field)
  }

  const handleSaveField = (updatedField: CanvasField) => {
    setFields((prev) =>
      prev.map((f) => (f.id === updatedField.id ? updatedField : f)),
    )
    setEditingField(null)
  }

  const handleSaveForm = () => {
    saveFormMutation.mutate({
      title: formTitle,
      description: formDescription,
    })
  }

  const handleCreateForm = () => {
    if (!newFormTitle.trim()) return
    createFormMutation.mutate({
      title: newFormTitle.trim(),
      description: newFormDescription.trim() || undefined,
    })
  }

  return (
    <>
      {/* Create New Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20">
              <Sparkles className="h-6 w-6 text-violet-500" />
            </div>
            <DialogTitle className="text-center text-xl">
              Create New Form
            </DialogTitle>
            <DialogDescription className="text-center">
              Give your form a name and description to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="form-title" className="text-sm font-medium">
                Form Title <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="form-title"
                  placeholder="Enter form title..."
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  value={newFormTitle}
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-description" className="text-sm font-medium">
                Description{' '}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <textarea
                id="form-description"
                placeholder="Describe what this form is for..."
                value={newFormDescription}
                onChange={(e) => setNewFormDescription(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              disabled={createFormMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateForm}
              disabled={!newFormTitle.trim() || createFormMutation.isPending}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
            >
              {createFormMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Form'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={20} minSize={15}>
          <FieldSidebar onFieldClick={handleFieldClick} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80} minSize={50}>
          <EditorCanvas
            fields={fields}
            formTitle={formTitle}
            formDescription={formDescription}
            onTitleChange={setFormTitle}
            onDescriptionChange={setFormDescription}
            onRemoveField={handleRemoveField}
            onEditField={handleEditField}
            onSave={handleSaveForm}
            isSaving={saveFormMutation.isPending}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      <FieldProperties
        field={editingField}
        open={!!editingField}
        onOpenChange={(open) => !open && setEditingField(null)}
        onSave={handleSaveField}
      />
    </>
  )
}
