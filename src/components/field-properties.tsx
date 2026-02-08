import { useEffect, useState } from 'react'
import type { CanvasField } from './fields/field-preview'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface FieldPropertiesProps {
  field: CanvasField | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (field: CanvasField) => void
}

export function FieldProperties({
  field,
  open,
  onOpenChange,
  onSave,
}: FieldPropertiesProps) {
  const [label, setLabel] = useState('')
  const [required, setRequired] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const [min, setMin] = useState<number | undefined>(undefined)
  const [max, setMax] = useState<number | undefined>(undefined)
  const [step, setStep] = useState<number | undefined>(undefined)
  const [optionsString, setOptionsString] = useState('')

  useEffect(() => {
    if (field) {
      setLabel(field.label || '')
      setRequired(field.required || false)
      setPlaceholder(field.placeholder || '')
      setMin(field.min)
      setMax(field.max)
      setStep(field.step)
      setOptionsString(field.options ? field.options.join('\n') : '')
    }
  }, [field])

  const handleSave = () => {
    if (!field) return
    onSave({
      ...field,
      label,
      required,
      placeholder,
      min: min !== undefined && !isNaN(min) ? Number(min) : undefined,
      max: max !== undefined && !isNaN(max) ? Number(max) : undefined,
      step: step !== undefined && !isNaN(step) ? Number(step) : undefined,
      options: optionsString
        ? optionsString.split('\n').filter((s) => s.trim() !== '')
        : undefined,
    })
    onOpenChange(false)
  }

  if (!field) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Field Properties</DialogTitle>
          <DialogDescription>
            Edit the properties for the {field.type} field.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="label">Label</FieldLabel>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Field Label"
              />
              <FieldDescription>
                The label displayed above the field.
              </FieldDescription>
            </Field>

            {/* Placeholder for text-like inputs */}
            {['text', 'textarea', 'email', 'url', 'phone', 'number'].includes(
              field.type,
            ) && (
              <Field>
                <FieldLabel htmlFor="placeholder">Placeholder</FieldLabel>
                <Input
                  id="placeholder"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="Placeholder text"
                />
              </Field>
            )}

            {/* Min/Max/Step for number and slider */}
            {['number', 'slider'].includes(field.type) && (
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="min">Min</FieldLabel>
                  <Input
                    id="min"
                    type="number"
                    value={min ?? ''}
                    onChange={(e) =>
                      setMin(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="max">Max</FieldLabel>
                  <Input
                    id="max"
                    type="number"
                    value={max ?? ''}
                    onChange={(e) =>
                      setMax(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="step">Step</FieldLabel>
                  <Input
                    id="step"
                    type="number"
                    value={step ?? ''}
                    onChange={(e) =>
                      setStep(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </Field>
              </div>
            )}

            {/* Options for dropdown, radio, checkbox group */}
            {['dropdown', 'radio', 'checkbox'].includes(field.type) && (
              <Field>
                <FieldLabel htmlFor="options">
                  Options (one per line)
                </FieldLabel>
                <textarea
                  id="options"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={optionsString}
                  onChange={(e) => setOptionsString(e.target.value)}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </Field>
            )}

            <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FieldLabel className="text-base">Required</FieldLabel>
                <FieldDescription>
                  Mark this field as mandatory.
                </FieldDescription>
              </div>
              <Switch checked={required} onCheckedChange={setRequired} />
            </Field>
          </FieldGroup>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
