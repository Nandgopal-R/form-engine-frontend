/**
 * Validation Rule Builder Component
 *
 * This component provides an interactive interface for building validation rules
 * for form fields. It allows users to:
 * - Select from predefined validation rules based on field type
 * - Configure rule parameters (like minimum length, maximum value, etc.)
 * - Test validation patterns in real-time
 * - See a preview of how validation will work
 *
 * The component uses a template-based system where common validation patterns
 * are pre-configured and users just need to set parameters.
 */

import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, Plus, X } from 'lucide-react'
import type { RuleTemplate, ValidationConfig } from '@/lib/validation-engine';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  PREDEFINED_PATTERNS,
  RULE_TEMPLATES,


  getRulesForFieldType
} from '@/lib/validation-engine'

interface ValidationRuleBuilderProps {
  fieldType: string
  currentValidation?: ValidationConfig
  onChange: (validation: ValidationConfig) => void
}

// Active rule represents a rule that has been added to the field
interface ActiveRule {
  ruleId: string
  params?: Record<string, unknown>
}

// Human-readable labels for rule categories
const CATEGORY_LABELS: Record<string, string> = {
  text: 'Text Rules',
  number: 'Number Rules',
  contact: 'Contact Info',
  format: 'Format Rules',
  security: 'Security',
  college: 'College/Academic',
}

// Color scheme for different rule categories
// Helps users visually distinguish between rule types
const CATEGORY_COLORS: Record<string, string> = {
  text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  number: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  contact:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  format:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  security: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  college:
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
}


export function ValidationRuleBuilder({
  fieldType,
  currentValidation = {},
  onChange,
}: ValidationRuleBuilderProps) {
  // State for currently active validation rules on this field
  const [activeRules, setActiveRules] = useState<Array<ActiveRule>>(() => {
    // Initialize active rules from existing validation config
    // This ensures the UI reflects the current validation state
    const rules: Array<ActiveRule> = []
    if (currentValidation.minLength !== undefined) {
      rules.push({
        ruleId: 'minLength',
        params: { value: currentValidation.minLength },
      })
    }
    if (currentValidation.maxLength !== undefined) {
      rules.push({
        ruleId: 'maxLength',
        params: { value: currentValidation.maxLength },
      })
    }
    if (currentValidation.min !== undefined) {
      rules.push({ ruleId: 'min', params: { value: currentValidation.min } })
    }
    if (currentValidation.max !== undefined) {
      rules.push({ ruleId: 'max', params: { value: currentValidation.max } })
    }
    if (currentValidation.pattern) {
      // Find matching predefined pattern
      const patternRuleId = Object.entries(PREDEFINED_PATTERNS).find(
        ([, preset]) => preset.pattern === currentValidation.pattern,
      )?.[0]
      if (patternRuleId) {
        rules.push({ ruleId: patternRuleId })
      } else {
        rules.push({
          ruleId: 'custom',
          params: { pattern: currentValidation.pattern },
        })
      }
    }
    return rules
  })

  const [selectedRule, setSelectedRule] = useState<string>('')
  const [testValue, setTestValue] = useState('')

  const applicableRules = useMemo(
    () => getRulesForFieldType(fieldType),
    [fieldType],
  )

  // Group rules by category
  const rulesByCategory = useMemo(() => {
    const grouped: Record<string, Array<RuleTemplate>> = {}
    for (const rule of applicableRules) {
      if (!(rule.category in grouped)) {
        grouped[rule.category] = []
      }
      grouped[rule.category].push(rule)
    }
    return grouped
  }, [applicableRules])

  // Build validation config from active rules
  const buildConfig = (
    rules: Array<ActiveRule>,
    required?: boolean,
  ): ValidationConfig => {
    const config: ValidationConfig = {
      required: required ?? currentValidation.required,
    }

    for (const rule of rules) {
      const template = RULE_TEMPLATES.find((t) => t.id === rule.ruleId)
      if (template) {
        const ruleConfig = template.generateValidation(rule.params)
        Object.assign(config, ruleConfig)
      } else if (rule.ruleId === 'custom' && rule.params?.pattern) {
        config.pattern = rule.params.pattern as string
      }
    }

    return config
  }

  // Add a new validation rule to the active rules list
  // Prevents duplicate rules of the same type
  const addRule = (ruleId: string, params?: Record<string, unknown>) => {
    // Don't add duplicate rules
    if (activeRules.some((r) => r.ruleId === ruleId)) {
      return
    }

    const newRules = [...activeRules, { ruleId, params }]
    setActiveRules(newRules)
    onChange(buildConfig(newRules))
    setSelectedRule('')
  }

  // Remove a validation rule by its index in the active rules array
  const removeRule = (index: number) => {
    const newRules = activeRules.filter((_, i) => i !== index)
    setActiveRules(newRules)
    onChange(buildConfig(newRules))
  }

  // Update parameters for an existing validation rule
  // Used when user sets values like minimum length, maximum value, etc.
  const updateRuleParams = (index: number, params: Record<string, unknown>) => {
    const newRules = [...activeRules]
    newRules[index] = { ...newRules[index], params }
    setActiveRules(newRules)
    onChange(buildConfig(newRules))
  }

  const getRuleTemplate = (ruleId: string) =>
    RULE_TEMPLATES.find((t) => t.id === ruleId)

  // Test current pattern against test value for immediate feedback
  // This helps users validate their regex patterns before saving
  const patternTestResult = useMemo(() => {
    if (!testValue) return null
    const config = buildConfig(activeRules)
    if (!config.pattern) return null

    try {
      const regex = new RegExp(config.pattern)
      return regex.test(testValue)
    } catch {
      return null
    }
  }, [testValue, activeRules]) // buildConfig is derived from activeRules

  // Get current regex pattern for display purposes
  const currentPattern = buildConfig(activeRules).pattern

  return (
    <div className="space-y-4">
      {/* Active Rules */}
      {activeRules.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Active Rules
          </Label>
          <div className="space-y-2">
            {activeRules.map((rule, index) => {
              const template = getRuleTemplate(rule.ruleId)
              const needsValue = [
                'minLength',
                'maxLength',
                'min',
                'max',
              ].includes(rule.ruleId)
              const isCustom = rule.ruleId === 'custom'

              return (
                <div
                  key={`${rule.ruleId}-${index}`}
                  className="flex items-center gap-2 p-2 rounded-md border bg-muted/30"
                >
                  <Badge
                    variant="secondary"
                    className={`shrink-0 ${template ? CATEGORY_COLORS[template.category] : ''}`}
                  >
                    {template?.name || 'Custom Pattern'}
                  </Badge>

                  {needsValue && (
                    <Input
                      type="number"
                      className="w-20 h-7 text-sm"
                      value={(rule.params?.value as number) || ''}
                      onChange={(e) =>
                        updateRuleParams(index, {
                          ...rule.params,
                          value: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="Value"
                    />
                  )}

                  {isCustom && (
                    <Input
                      className="flex-1 h-7 text-sm font-mono"
                      value={(rule.params?.pattern as string) || ''}
                      onChange={(e) =>
                        updateRuleParams(index, { pattern: e.target.value })
                      }
                      placeholder="Regex pattern"
                    />
                  )}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeRule(index)}
                          aria-label="Remove rule"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove rule</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Rule Dropdown */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Add Validation Rule
        </Label>
        <div className="flex gap-2">
          <Select value={selectedRule} onValueChange={setSelectedRule}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a rule..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(rulesByCategory).map(([category, rules]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {CATEGORY_LABELS[category] || category}
                  </div>
                  {rules.map((rule) => (
                    <SelectItem
                      key={rule.id}
                      value={rule.id}
                      disabled={activeRules.some((r) => r.ruleId === rule.id)}
                    >
                      <div className="flex flex-col">
                        <span>{rule.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {rule.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Advanced
              </div>
              <SelectItem value="custom">
                <div className="flex flex-col">
                  <span>Custom Regex</span>
                  <span className="text-xs text-muted-foreground">
                    Write your own pattern
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => {
              if (selectedRule) {
                addRule(selectedRule)
              }
            }}
            disabled={!selectedRule}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Pattern Preview & Test */}
      {currentPattern && (
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Generated Pattern
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  This regex pattern will be saved and used to validate input
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <code className="block text-xs p-2 rounded bg-muted font-mono break-all">
            {currentPattern}
          </code>

          {/* Test Pattern */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Test Pattern
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                className="flex-1 h-8 text-sm"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="Enter test value..."
              />
              {testValue &&
                patternTestResult !== null &&
                (patternTestResult ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                ))}
            </div>
            {testValue && patternTestResult !== null && (
              <p
                className={`text-xs ${patternTestResult ? 'text-green-600' : 'text-destructive'}`}
              >
                {patternTestResult
                  ? 'Pattern matches!'
                  : 'Pattern does not match'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Info */}
      {activeRules.length === 0 && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Add validation rules to ensure users enter data in the correct
            format. Rules will be automatically converted to regex patterns and
            checked when the form is submitted.
          </p>
        </div>
      )}
    </div>
  )
}
