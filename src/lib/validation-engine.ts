/**
 * Validation Engine
 * Converts user-friendly validation rules to regex patterns and validates form inputs
 */

export interface ValidationRule {
  type:
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'min'
    | 'max'
    | 'pattern'
    | 'email'
    | 'url'
    | 'phone'
    | 'alphanumeric'
    | 'lettersOnly'
    | 'numbersOnly'
    | 'noSpaces'
    | 'custom'
  value?: string | number | boolean
  message?: string
}

export interface ValidationConfig {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  customRules?: Array<ValidationRule>
}

export interface ValidationError {
  field: string
  fieldLabel: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Array<ValidationError>
}

// Predefined patterns for common validations
export const PREDEFINED_PATTERNS: Record<
  string,
  { pattern: string; description: string }
> = {
  email: {
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Valid email address',
  },
  url: {
    pattern:
      '^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
    description: 'Valid URL',
  },
  phone: {
    pattern: '^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$',
    description: 'Valid phone number',
  },
  alphanumeric: {
    pattern: '^[a-zA-Z0-9]+$',
    description: 'Letters and numbers only',
  },
  lettersOnly: {
    pattern: '^[a-zA-Z\\s]+$',
    description: 'Letters only (with spaces)',
  },
  numbersOnly: {
    pattern: '^[0-9]+$',
    description: 'Numbers only',
  },
  noSpaces: {
    pattern: '^\\S+$',
    description: 'No spaces allowed',
  },
  indianPhone: {
    pattern: '^[6-9]\\d{9}$',
    description: 'Valid Indian phone number (10 digits starting with 6-9)',
  },
  usPhone: {
    pattern: '^\\(?[2-9]\\d{2}\\)?[-. ]?\\d{3}[-. ]?\\d{4}$',
    description: 'Valid US phone number',
  },
  postalCode: {
    pattern: '^[1-9][0-9]{5}$',
    description: 'Valid Indian postal code (6 digits)',
  },
  usZipCode: {
    pattern: '^\\d{5}(-\\d{4})?$',
    description: 'Valid US ZIP code',
  },
  username: {
    pattern: '^[a-zA-Z][a-zA-Z0-9_]{2,19}$',
    description:
      'Username (3-20 chars, starts with letter, allows underscores)',
  },
  password: {
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
    description: 'Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)',
  },
  date: {
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    description: 'Date in YYYY-MM-DD format',
  },
  time: {
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
    description: 'Time in HH:MM format (24-hour)',
  },
  creditCard: {
    pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$',
    description: 'Valid credit card number (Visa, MasterCard, Amex)',
  },
  hexColor: {
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    description: 'Valid hex color code',
  },
  // College-related patterns
  rollNumber: {
    pattern: '^[A-Z]{2,4}\\d{2}[A-Z]{1,3}\\d{3,4}$',
    description: 'Roll number (e.g., CB21CS001, RA2011003010234)',
  },
  registrationNumber: {
    pattern: '^\\d{10,15}$',
    description: 'Registration number (10-15 digits)',
  },
  collegeEmail: {
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(edu|ac\\.in|edu\\.in)$',
    description: 'College email (.edu, .ac.in, .edu.in)',
  },
  cgpa: {
    pattern: '^([0-9](\\.\\d{1,2})?|10(\\.0{1,2})?)$',
    description: 'CGPA (0.00 to 10.00)',
  },
  percentage: {
    pattern: '^(100(\\.0{1,2})?|[0-9]{1,2}(\\.\\d{1,2})?)$',
    description: 'Percentage (0.00 to 100.00)',
  },
  semester: {
    pattern: '^[1-8]$',
    description: 'Semester number (1-8)',
  },
  year: {
    pattern: '^(19|20)\\d{2}$',
    description: 'Year (1900-2099)',
  },
  batchYear: {
    pattern: '^20[0-9]{2}$',
    description: 'Batch year (2000-2099)',
  },
  section: {
    pattern: '^[A-Z]$',
    description: 'Section (A-Z)',
  },
  department: {
    pattern: '^[A-Za-z\\s&]+$',
    description: 'Department name (letters, spaces, &)',
  },
}

// Rule templates that users can choose from
export interface RuleTemplate {
  id: string
  name: string
  description: string
  category: 'text' | 'number' | 'contact' | 'format' | 'security' | 'college'
  generatePattern?: () => string
  generateValidation: (
    params?: Record<string, unknown>,
  ) => Partial<ValidationConfig>
}

export const RULE_TEMPLATES: Array<RuleTemplate> = [
  // Text rules
  {
    id: 'minLength',
    name: 'Minimum Length',
    description: 'Require at least a certain number of characters',
    category: 'text',
    generateValidation: (params) => {
      const val = params?.value as number | undefined
      return val !== undefined ? { minLength: val } : {}
    },
  },
  {
    id: 'maxLength',
    name: 'Maximum Length',
    description: 'Limit the maximum number of characters',
    category: 'text',
    generateValidation: (params) => {
      const val = params?.value as number | undefined
      return val !== undefined ? { maxLength: val } : {}
    },
  },
  {
    id: 'lettersOnly',
    name: 'Letters Only',
    description: 'Allow only alphabetic characters and spaces',
    category: 'text',
    generatePattern: () => PREDEFINED_PATTERNS.lettersOnly.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.lettersOnly.pattern,
    }),
  },
  {
    id: 'alphanumeric',
    name: 'Letters & Numbers',
    description: 'Allow only letters and numbers (no special characters)',
    category: 'text',
    generatePattern: () => PREDEFINED_PATTERNS.alphanumeric.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.alphanumeric.pattern,
    }),
  },
  {
    id: 'noSpaces',
    name: 'No Spaces',
    description: 'Prevent spaces in the input',
    category: 'text',
    generatePattern: () => PREDEFINED_PATTERNS.noSpaces.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.noSpaces.pattern,
    }),
  },

  // Number rules
  {
    id: 'min',
    name: 'Minimum Value',
    description: 'Set a minimum numeric value',
    category: 'number',
    generateValidation: (params) => {
      const val = params?.value as number | undefined
      return val !== undefined ? { min: val } : {}
    },
  },
  {
    id: 'max',
    name: 'Maximum Value',
    description: 'Set a maximum numeric value',
    category: 'number',
    generateValidation: (params) => {
      const val = params?.value as number | undefined
      return val !== undefined ? { max: val } : {}
    },
  },
  {
    id: 'numbersOnly',
    name: 'Numbers Only',
    description: 'Allow only numeric characters',
    category: 'number',
    generatePattern: () => PREDEFINED_PATTERNS.numbersOnly.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.numbersOnly.pattern,
    }),
  },

  // Contact rules
  {
    id: 'email',
    name: 'Email Format',
    description: 'Validate email address format',
    category: 'contact',
    generatePattern: () => PREDEFINED_PATTERNS.email.pattern,
    generateValidation: () => ({ pattern: PREDEFINED_PATTERNS.email.pattern }),
  },
  {
    id: 'phone',
    name: 'Phone Number',
    description: 'Validate general phone number format',
    category: 'contact',
    generatePattern: () => PREDEFINED_PATTERNS.phone.pattern,
    generateValidation: () => ({ pattern: PREDEFINED_PATTERNS.phone.pattern }),
  },
  {
    id: 'indianPhone',
    name: 'Indian Phone',
    description: 'Validate Indian mobile number (10 digits)',
    category: 'contact',
    generatePattern: () => PREDEFINED_PATTERNS.indianPhone.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.indianPhone.pattern,
    }),
  },
  {
    id: 'url',
    name: 'Website URL',
    description: 'Validate website URL format',
    category: 'contact',
    generatePattern: () => PREDEFINED_PATTERNS.url.pattern,
    generateValidation: () => ({ pattern: PREDEFINED_PATTERNS.url.pattern }),
  },

  // Format rules
  {
    id: 'postalCode',
    name: 'Postal Code (India)',
    description: 'Validate Indian postal code (6 digits)',
    category: 'format',
    generatePattern: () => PREDEFINED_PATTERNS.postalCode.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.postalCode.pattern,
    }),
  },
  {
    id: 'usZipCode',
    name: 'ZIP Code (US)',
    description: 'Validate US ZIP code',
    category: 'format',
    generatePattern: () => PREDEFINED_PATTERNS.usZipCode.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.usZipCode.pattern,
    }),
  },
  {
    id: 'date',
    name: 'Date (YYYY-MM-DD)',
    description: 'Validate date format',
    category: 'format',
    generatePattern: () => PREDEFINED_PATTERNS.date.pattern,
    generateValidation: () => ({ pattern: PREDEFINED_PATTERNS.date.pattern }),
  },
  {
    id: 'creditCard',
    name: 'Credit Card',
    description: 'Validate credit card number',
    category: 'format',
    generatePattern: () => PREDEFINED_PATTERNS.creditCard.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.creditCard.pattern,
    }),
  },

  // Security rules
  {
    id: 'username',
    name: 'Username',
    description: 'Validate username format (3-20 chars)',
    category: 'security',
    generatePattern: () => PREDEFINED_PATTERNS.username.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.username.pattern,
    }),
  },
  {
    id: 'password',
    name: 'Strong Password',
    description: 'Require strong password (8+ chars, mixed case, number)',
    category: 'security',
    generatePattern: () => PREDEFINED_PATTERNS.password.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.password.pattern,
    }),
  },

  // College rules
  {
    id: 'rollNumber',
    name: 'Roll Number',
    description: 'Validate roll number format (e.g., CB21CS001)',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.rollNumber.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.rollNumber.pattern,
    }),
  },
  {
    id: 'registrationNumber',
    name: 'Registration Number',
    description: 'Validate registration number (10-15 digits)',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.registrationNumber.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.registrationNumber.pattern,
    }),
  },
  {
    id: 'collegeEmail',
    name: 'College Email',
    description: 'Validate college email (.edu, .ac.in)',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.collegeEmail.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.collegeEmail.pattern,
    }),
  },
  {
    id: 'cgpa',
    name: 'CGPA',
    description: 'Validate CGPA (0.00 to 10.00)',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.cgpa.pattern,
    generateValidation: () => ({ pattern: PREDEFINED_PATTERNS.cgpa.pattern }),
  },
  {
    id: 'percentage',
    name: 'Percentage',
    description: 'Validate percentage (0 to 100)',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.percentage.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.percentage.pattern,
    }),
  },
  {
    id: 'semester',
    name: 'Semester',
    description: 'Validate semester number (1-8)',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.semester.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.semester.pattern,
    }),
  },
  {
    id: 'batchYear',
    name: 'Batch Year',
    description: 'Validate batch year (2000-2099)',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.batchYear.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.batchYear.pattern,
    }),
  },
  {
    id: 'section',
    name: 'Section',
    description: 'Validate section (A-Z)',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.section.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.section.pattern,
    }),
  },
  {
    id: 'department',
    name: 'Department Name',
    description: 'Validate department name format',
    category: 'college',
    generatePattern: () => PREDEFINED_PATTERNS.department.pattern,
    generateValidation: () => ({
      pattern: PREDEFINED_PATTERNS.department.pattern,
    }),
  },
]

// Error messages
const ERROR_MESSAGES: Record<
  string,
  (value?: unknown, label?: string) => string
> = {
  required: (_, label) => `${label || 'This field'} is required`,
  minLength: (value, label) =>
    `${label || 'This field'} must be at least ${value} characters`,
  maxLength: (value, label) =>
    `${label || 'This field'} must be at most ${value} characters`,
  min: (value, label) => `${label || 'Value'} must be at least ${value}`,
  max: (value, label) => `${label || 'Value'} must be at most ${value}`,
  pattern: (_, label) => `${label || 'This field'} has an invalid format`,
  email: (_, label) => `${label || 'This field'} must be a valid email address`,
  url: (_, label) => `${label || 'This field'} must be a valid URL`,
  phone: (_, label) => `${label || 'This field'} must be a valid phone number`,
}

/**
 * Get a human-readable description for a pattern
 */
export function getPatternDescription(pattern: string): string {
  for (const [, preset] of Object.entries(PREDEFINED_PATTERNS)) {
    if (preset.pattern === pattern) {
      return preset.description
    }
  }
  return 'Custom pattern'
}

/**
 * Validate a single field value against its validation config
 */
export function validateField(
  value: unknown,
  fieldId: string,
  fieldLabel: string,
  config: ValidationConfig,
): Array<ValidationError> {
  const errors: Array<ValidationError> = []
  const stringValue = value !== null && value !== undefined ? String(value) : ''
  const isEmpty = stringValue.trim() === ''

  // Required validation
  if (config.required && isEmpty) {
    errors.push({
      field: fieldId,
      fieldLabel,
      message: ERROR_MESSAGES.required(undefined, fieldLabel),
    })
    return errors // If required and empty, skip other validations
  }

  // Skip other validations if field is empty and not required
  if (isEmpty) {
    return errors
  }

  // Min length validation
  if (config.minLength !== undefined && stringValue.length < config.minLength) {
    errors.push({
      field: fieldId,
      fieldLabel,
      message: ERROR_MESSAGES.minLength(config.minLength, fieldLabel),
    })
  }

  // Max length validation
  if (config.maxLength !== undefined && stringValue.length > config.maxLength) {
    errors.push({
      field: fieldId,
      fieldLabel,
      message: ERROR_MESSAGES.maxLength(config.maxLength, fieldLabel),
    })
  }

  // Numeric validations
  if (
    typeof value === 'number' ||
    (typeof value === 'string' && !isNaN(Number(value)))
  ) {
    const numValue = Number(value)

    if (config.min !== undefined && numValue < config.min) {
      errors.push({
        field: fieldId,
        fieldLabel,
        message: ERROR_MESSAGES.min(config.min, fieldLabel),
      })
    }

    if (config.max !== undefined && numValue > config.max) {
      errors.push({
        field: fieldId,
        fieldLabel,
        message: ERROR_MESSAGES.max(config.max, fieldLabel),
      })
    }
  }

  // Pattern validation (regex)
  if (config.pattern) {
    try {
      const regex = new RegExp(config.pattern)
      if (!regex.test(stringValue)) {
        // Try to get a descriptive message
        const description = getPatternDescription(config.pattern)
        errors.push({
          field: fieldId,
          fieldLabel,
          message:
            description !== 'Custom pattern'
              ? `${fieldLabel || 'This field'} must be: ${description.toLowerCase()}`
              : ERROR_MESSAGES.pattern(undefined, fieldLabel),
        })
      }
    } catch (e) {
      console.warn(
        `Invalid regex pattern for field ${fieldId}:`,
        config.pattern,
      )
    }
  }

  return errors
}

/**
 * Validate an entire form
 */
export function validateForm(
  responses: Record<string, unknown>,
  fields: Array<{
    id: string
    label: string
    fieldType: string
    validation?: ValidationConfig
  }>,
): ValidationResult {
  const errors: Array<ValidationError> = []

  for (const field of fields) {
    const value = responses[field.id]
    const config = field.validation || {}

    const fieldErrors = validateField(
      value,
      field.id,
      field.label || field.id,
      config,
    )
    errors.push(...fieldErrors)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Build a ValidationConfig from selected rule templates
 */
export function buildValidationConfig(
  selectedRules: Array<{ ruleId: string; params?: Record<string, unknown> }>,
  required: boolean = false,
): ValidationConfig {
  const config: ValidationConfig = { required }

  for (const { ruleId, params } of selectedRules) {
    const template = RULE_TEMPLATES.find((t) => t.id === ruleId)
    if (template) {
      const ruleConfig = template.generateValidation(params)
      Object.assign(config, ruleConfig)
    }
  }

  return config
}

/**
 * Combine multiple regex patterns with AND logic
 * This creates a pattern that matches if ALL patterns match
 */
export function combinePatterns(patterns: string[]): string {
  if (patterns.length === 0) return ''
  if (patterns.length === 1) return patterns[0]

  // Use lookaheads to require all patterns to match
  const lookaheads = patterns.map((p) => `(?=.*${p})`).join('')
  return `^${lookaheads}.*$`
}

/**
 * Get rules applicable to a field type
 */
export function getRulesForFieldType(fieldType: string): RuleTemplate[] {
  const textTypes = ['text', 'textarea', 'Input', 'input']
  const numberTypes = ['number', 'slider', 'cgpa']

  if (textTypes.includes(fieldType)) {
    return RULE_TEMPLATES.filter(
      (r) =>
        r.category === 'text' ||
        r.category === 'contact' ||
        r.category === 'format' ||
        r.category === 'security' ||
        r.category === 'college',
    )
  }

  if (numberTypes.includes(fieldType)) {
    return RULE_TEMPLATES.filter(
      (r) => r.category === 'number' || r.category === 'college',
    )
  }

  if (fieldType === 'email') {
    return RULE_TEMPLATES.filter(
      (r) =>
        r.id === 'email' || r.id === 'collegeEmail' || r.category === 'text',
    )
  }

  if (fieldType === 'phone') {
    return RULE_TEMPLATES.filter(
      (r) =>
        r.id === 'phone' || r.id === 'indianPhone' || r.category === 'text',
    )
  }

  if (fieldType === 'url' || fieldType === 'website') {
    return RULE_TEMPLATES.filter((r) => r.id === 'url' || r.category === 'text')
  }

  return RULE_TEMPLATES.filter((r) => r.category === 'text')
}
