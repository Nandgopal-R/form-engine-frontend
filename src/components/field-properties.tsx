import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ValidationRuleBuilder } from './validation-rule-builder'
import type { CanvasField } from './fields/field-preview'
import type { ValidationConfig } from '@/lib/validation-engine'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

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
  const [validation, setValidation] = useState<ValidationConfig>({})
  const [showValidation, setShowValidation] = useState(false)

  useEffect(() => {
    if (field) {
      setLabel(field.label || '')
      setRequired(field.required || field.validation?.required || false)
      setPlaceholder(field.placeholder || '')
      setMin(field.min)
      setMax(field.max)
      setStep(field.step)
      setOptionsString(field.options ? field.options.join('\n') : '')
      setValidation(field.validation || {})
      setShowValidation(false)
    }
  }, [field])

  const handleSave = () => {
    if (!field) return
    
    // Merge validation with required flag and min/max from number fields
    const finalValidation: ValidationConfig = {
      ...validation,
      required,
    }
    
    // For number/slider fields, include min/max in validation
    if (['number', 'slider'].includes(field.type)) {
      if (min !== undefined && !isNaN(min)) {
        finalValidation.min = Number(min)
      }
      if (max !== undefined && !isNaN(max)) {
        finalValidation.max = Number(max)
      }
    }
    
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
      validation: finalValidation,
    })
    onOpenChange(false)
  }

  if (!field) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
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

            {/* Validation Rules - Show for text-like fields */}
            {['text', 'textarea', 'email', 'url', 'phone', 'number', 'input'].includes(
              field.type.toLowerCase(),
            ) && (
              <Collapsible open={showValidation} onOpenChange={setShowValidation}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto border rounded-lg"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-base font-medium">Validation Rules</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        Add pattern and format validation
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showValidation ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <ValidationRuleBuilder
                    fieldType={field.type}
                    currentValidation={validation}
                    onChange={setValidation}
                  />
                </CollapsibleContent>
              </Collapsible>
            )}
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
