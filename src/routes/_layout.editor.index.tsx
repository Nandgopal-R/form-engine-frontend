import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, FileText, Loader2, Sparkles } from 'lucide-react'

import type { CreateFormInput } from '@/api/forms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formsApi } from '@/api/forms'
import { aiApi } from '@/api/ai'

export const Route = createFileRoute('/_layout/editor/')({
  component: EditorComponent,
})

function EditorComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [mode, setMode] = useState<'manual' | 'ai'>('manual')
  const [aiPrompt, setAiPrompt] = useState('')

  // useMutation for creating a new form
  const createFormMutation = useMutation({
    mutationFn: (data: CreateFormInput) => formsApi.create(data),
    onSuccess: (data) => {
      console.log('Form created successfully!', data)
      // Navigate to the proper form editor page where fields can be added
      navigate({ to: '/editor/$formId', params: { formId: data.id } })
    },
    onError: (error) => {
      console.error('Failed to create form:', error.message)
    },
  })

  // useMutation for AI form generation
  const aiGenerateMutation = useMutation({
    mutationFn: (prompt: string) => aiApi.generateForm(prompt),
    onSuccess: (generatedForm) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      navigate({ to: '/editor/$formId', params: { formId: generatedForm.id } })
    },
  })

  const handleCreateForm = () => {
    if (!formTitle.trim()) {
      return
    }
    createFormMutation.mutate({
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
    })
  }

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return
    aiGenerateMutation.mutate(aiPrompt.trim())
  }

  return (
    <div className="h-full flex items-center justify-center bg-muted/20">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-xl shadow-sm border p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
              {mode === 'ai' ? (
                <Sparkles className="h-7 w-7 text-primary" />
              ) : (
                <FileText className="h-7 w-7 text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === 'ai' ? 'Generate with AI' : 'Create New Form'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === 'ai'
                ? 'Describe the form you need and AI will create it for you.'
                : 'Enter a title and description for your form, then you can add fields.'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-lg border p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'manual'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <FileText className="h-4 w-4" />
              Manual
            </button>
            <button
              type="button"
              onClick={() => setMode('ai')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === 'ai'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI Generate
            </button>
          </div>

          {mode === 'manual' ? (
            <>
              {/* Manual Form inputs */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="form-title" className="block text-sm font-medium mb-2">
                    Form Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="form-title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter form title..."
                    className="text-lg"
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="form-description" className="block text-sm font-medium mb-2">
                    Description <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <textarea
                    id="form-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe what this form is for..."
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    rows={4}
                  />
                </div>
              </div>

              {/* Error message */}
              {createFormMutation.isError && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
                  Failed to create form: {createFormMutation.error.message}
                </div>
              )}

              {/* Create button */}
              <Button
                onClick={handleCreateForm}
                disabled={!formTitle.trim() || createFormMutation.isPending}
                className="w-full gap-2"
                size="lg"
              >
                {createFormMutation.isPending ? (
                  'Creating...'
                ) : (
                  <>
                    Create Form & Add Fields
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                After creating the form, you&apos;ll be able to add fields to it.
              </p>
            </>
          ) : (
            <>
              {/* AI Prompt */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="ai-prompt" className="block text-sm font-medium mb-2">
                    Describe your form
                  </label>
                  <textarea
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Create a job application form with fields for name, email, resume upload, work experience, and education..."
                    className="w-full min-h-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    rows={5}
                    disabled={aiGenerateMutation.isPending}
                    autoFocus
                  />
                </div>
              </div>

              {/* Error message */}
              {aiGenerateMutation.isError && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
                  AI generation failed: {aiGenerateMutation.error.message}
                </div>
              )}

              {/* Generate button */}
              <Button
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || aiGenerateMutation.isPending}
                className="w-full gap-2"
                size="lg"
              >
                {aiGenerateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating form...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Form
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                AI will create a form with appropriate fields that you can then edit.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
