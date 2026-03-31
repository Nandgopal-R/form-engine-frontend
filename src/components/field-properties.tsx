/**
 * Field Properties Component
 *
 * This component provides a dialog interface for editing form field properties.
 * It allows users to configure:
 * - Basic properties (label, placeholder, required status)
 * - Numeric constraints (min, max, step values)
 * - Options for select/radio/checkbox fields
 * - Advanced validation rules using the ValidationRuleBuilder
 *
 * The component maintains local state for all properties and only saves
 * when the user explicitly clicks the save button. This provides a safe
 * editing experience where changes can be cancelled.
 */

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
  field: CanvasField | null // Field being edited (null when no field selected)
  open: boolean // Whether dialog is open
  onOpenChange: (open: boolean) => void // Callback for dialog open/close
  onSave: (field: CanvasField) => void // Callback for saving field changes
}

export function FieldProperties({
  field,
  open,
  onOpenChange,
  onSave,
}: FieldPropertiesProps) {
  // Local state for all field properties
  // Using separate state variables allows granular control and validation
  const [label, setLabel] = useState('')
  const [required, setRequired] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const [min, setMin] = useState<number | undefined>(undefined)
  const [max, setMax] = useState<number | undefined>(undefined)
  const [step, setStep] = useState<number | undefined>(undefined)
  const [optionsString, setOptionsString] = useState('')
  const [validation, setValidation] = useState<ValidationConfig>({})
  const [showValidation, setShowValidation] = useState(false)

  // Payment-specific state
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentCurrency, setPaymentCurrency] = useState('INR')
  const [paymentDescription, setPaymentDescription] = useState('')
  const [paymentBusinessName, setPaymentBusinessName] = useState('')
  const [paymentLogoUrl, setPaymentLogoUrl] = useState('')
  const [paymentThemeColor, setPaymentThemeColor] = useState('#6366f1')
  const [paymentPrefillName, setPaymentPrefillName] = useState('')
  const [paymentPrefillEmail, setPaymentPrefillEmail] = useState('')
  const [paymentPrefillContact, setPaymentPrefillContact] = useState('')
  const [paymentReceiptPrefix, setPaymentReceiptPrefix] = useState('receipt')
  const [paymentNotes, setPaymentNotes] = useState('')

  // Initialize local state when field prop changes
  // This syncs dialog with the field being edited
  useEffect(() => {
    if (field) {
      setLabel(field.label || '')
      // Set required status from multiple possible sources for backward compatibility
      setRequired(field.required || field.validation?.required || false)
      setPlaceholder(field.placeholder || '')
      setMin(field.min)
      setMax(field.max)
      setStep(field.step)
      setOptionsString(Array.isArray(field.options) ? field.options.join('\n') : '')
      setValidation(field.validation || {})
      setShowValidation(false)

      // Initialize payment-specific state
      const fieldOptions = field.options as { amount?: number; currency?: string; description?: string; businessName?: string; logoUrl?: string; themeColor?: string; prefillName?: string; prefillEmail?: string; prefillContact?: string; receiptPrefix?: string; notes?: string } | null
      setPaymentAmount(fieldOptions?.amount || 0)
      setPaymentCurrency(fieldOptions?.currency || 'INR')
      setPaymentDescription(fieldOptions?.description || '')
      setPaymentBusinessName(fieldOptions?.businessName || '')
      setPaymentLogoUrl(fieldOptions?.logoUrl || '')
      setPaymentThemeColor(fieldOptions?.themeColor || '#6366f1')
      setPaymentPrefillName(fieldOptions?.prefillName || '')
      setPaymentPrefillEmail(fieldOptions?.prefillEmail || '')
      setPaymentPrefillContact(fieldOptions?.prefillContact || '')
      setPaymentReceiptPrefix(fieldOptions?.receiptPrefix || 'receipt')
      setPaymentNotes(fieldOptions?.notes || '')
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

    // Build options based on field type
    let finalOptions: string[] | { amount: number; currency: string; description: string; businessName: string; logoUrl: string; themeColor: string; prefillName: string; prefillEmail: string; prefillContact: string; receiptPrefix: string; notes: string } | undefined

    if (field.type === 'payment') {
      finalOptions = {
        amount: paymentAmount,
        currency: paymentCurrency,
        description: paymentDescription,
        businessName: paymentBusinessName,
        logoUrl: paymentLogoUrl,
        themeColor: paymentThemeColor,
        prefillName: paymentPrefillName,
        prefillEmail: paymentPrefillEmail,
        prefillContact: paymentPrefillContact,
        receiptPrefix: paymentReceiptPrefix,
        notes: paymentNotes,
      }
    } else if (optionsString) {
      finalOptions = optionsString.split('\n').filter((s) => s.trim() !== '')
    }

    onSave({
      ...field,
      label,
      required,
      placeholder,
      min: min !== undefined && !isNaN(min) ? Number(min) : undefined,
      max: max !== undefined && !isNaN(max) ? Number(max) : undefined,
      step: step !== undefined && !isNaN(step) ? Number(step) : undefined,
      options: finalOptions,
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

            {/* Payment-specific options */}
            {field.type === 'payment' && (
              <div className="space-y-4">
                {/* ── Payment Details ── */}
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Payment Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="paymentAmount">Amount</FieldLabel>
                      <Input
                        id="paymentAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={paymentAmount || ''}
                        onChange={(e) =>
                          setPaymentAmount(
                            e.target.value === '' ? 0 : Number(e.target.value),
                          )
                        }
                        placeholder="0.00"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="paymentCurrency">Currency</FieldLabel>
                      <select
                        id="paymentCurrency"
                        value={paymentCurrency}
                        onChange={(e) => setPaymentCurrency(e.target.value)}
                        className="flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="INR">INR — Indian Rupee ₹</option>
                        <option value="USD">USD — US Dollar $</option>
                        <option value="EUR">EUR — Euro €</option>
                        <option value="GBP">GBP — British Pound £</option>
                        <option value="SGD">SGD — Singapore Dollar</option>
                        <option value="AED">AED — UAE Dirham</option>
                        <option value="MYR">MYR — Malaysian Ringgit</option>
                      </select>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="paymentDescription">Payment Description</FieldLabel>
                    <Input
                      id="paymentDescription"
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                      placeholder="e.g. Application fee, Course enrollment"
                    />
                    <FieldDescription>Shown to the payer in the checkout modal.</FieldDescription>
                  </Field>
                </div>

                {/* ── Merchant Branding ── */}
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Merchant Branding</p>
                  <Field>
                    <FieldLabel htmlFor="paymentBusinessName">Business / Merchant Name</FieldLabel>
                    <Input
                      id="paymentBusinessName"
                      value={paymentBusinessName}
                      onChange={(e) => setPaymentBusinessName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                    />
                    <FieldDescription>Displayed at the top of the Razorpay checkout modal.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="paymentLogoUrl">Logo URL (optional)</FieldLabel>
                    <Input
                      id="paymentLogoUrl"
                      type="url"
                      value={paymentLogoUrl}
                      onChange={(e) => setPaymentLogoUrl(e.target.value)}
                      placeholder="https://yourdomain.com/logo.png"
                    />
                    <FieldDescription>Your brand logo shown in the payment modal.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="paymentThemeColor">Theme Color</FieldLabel>
                    <div className="flex items-center gap-3">
                      <input
                        id="paymentThemeColor"
                        type="color"
                        value={paymentThemeColor}
                        onChange={(e) => setPaymentThemeColor(e.target.value)}
                        className="h-9 w-12 cursor-pointer rounded-md border border-input bg-background p-1"
                      />
                      <Input
                        value={paymentThemeColor}
                        onChange={(e) => setPaymentThemeColor(e.target.value)}
                        placeholder="#6366f1"
                        className="font-mono"
                      />
                    </div>
                    <FieldDescription>Accent color for the Razorpay checkout UI.</FieldDescription>
                  </Field>
                </div>

                {/* ── Prefill Respondent Info ── */}
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Prefill Customer Info</p>
                  <FieldDescription className="-mt-1">
                    These values pre-populate Razorpay's checkout form fields. Leave blank to let the payer fill them.
                  </FieldDescription>
                  <Field>
                    <FieldLabel htmlFor="paymentPrefillName">Name</FieldLabel>
                    <Input
                      id="paymentPrefillName"
                      value={paymentPrefillName}
                      onChange={(e) => setPaymentPrefillName(e.target.value)}
                      placeholder="e.g. John Doe"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="paymentPrefillEmail">Email</FieldLabel>
                    <Input
                      id="paymentPrefillEmail"
                      type="email"
                      value={paymentPrefillEmail}
                      onChange={(e) => setPaymentPrefillEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="paymentPrefillContact">Phone / Contact</FieldLabel>
                    <Input
                      id="paymentPrefillContact"
                      type="tel"
                      value={paymentPrefillContact}
                      onChange={(e) => setPaymentPrefillContact(e.target.value)}
                      placeholder="e.g. +919876543210"
                    />
                  </Field>
                </div>

                {/* ── Receipt & Notes ── */}
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Receipt &amp; Notes</p>
                  <Field>
                    <FieldLabel htmlFor="paymentReceiptPrefix">Receipt Prefix</FieldLabel>
                    <Input
                      id="paymentReceiptPrefix"
                      value={paymentReceiptPrefix}
                      onChange={(e) => setPaymentReceiptPrefix(e.target.value)}
                      placeholder="e.g. invoice, order, reg"
                    />
                    <FieldDescription>
                      Prefixed to the auto-generated receipt ID (e.g. <code className="text-xs font-mono bg-muted px-1 rounded">invoice_20240311_abc</code>).
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="paymentNotes">Notes</FieldLabel>
                    <textarea
                      id="paymentNotes"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      rows={2}
                      placeholder="Internal notes visible on Razorpay dashboard"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </Field>
                </div>
              </div>
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
            {[
              'text',
              'textarea',
              'email',
              'url',
              'phone',
              'number',
              'input',
            ].includes(field.type.toLowerCase()) && (
                <Collapsible
                  open={showValidation}
                  onOpenChange={setShowValidation}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto border rounded-lg"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-base font-medium">
                          Validation Rules
                        </span>
                        <span className="text-xs text-muted-foreground font-normal">
                          Add pattern and format validation
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${showValidation ? 'rotate-180' : ''
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
