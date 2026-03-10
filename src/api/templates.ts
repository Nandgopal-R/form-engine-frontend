export interface TemplateField {
  id: string
  fieldName: string
  label: string
  fieldValueType: string
  fieldType: string
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: string
  }
  placeholder?: string
  min?: number
  max?: number
  step?: number
  options?: string[]
}

export interface Template {
  id: string
  title: string
  description: string
  templateType: 'builtin' | 'custom'
  ownerId?: string
  fields: TemplateField[]
  createdAt: string
  updatedAt?: string
}

export const templatesApi = {
  getBuiltin: async (): Promise<Template[]> => {
    return builtinTemplates
  },
}

export const builtinTemplates: Template[] = [
  {
    id: 'builtin-contact',
    title: 'Contact Us Form',
    description: 'A simple contact form with name, email, and message fields',
    templateType: 'builtin',
    createdAt: '2024-01-01T00:00:00Z',
    fields: [
      {
        id: 'f1',
        fieldName: 'fullName',
        label: 'Full Name',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: true, minLength: 2, maxLength: 100 },
        placeholder: 'Enter your full name',
      },
      {
        id: 'f2',
        fieldName: 'email',
        label: 'Email Address',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: {
          required: true,
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        placeholder: 'you@example.com',
      },
      {
        id: 'f3',
        fieldName: 'phone',
        label: 'Phone Number',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: false },
        placeholder: '(Optional) Your phone number',
      },
      {
        id: 'f4',
        fieldName: 'subject',
        label: 'Subject',
        fieldValueType: 'string',
        fieldType: 'select',
        validation: { required: true },
        options: ['General Inquiry', 'Support', 'Sales', 'Feedback', 'Other'],
      },
      {
        id: 'f5',
        fieldName: 'message',
        label: 'Message',
        fieldValueType: 'string',
        fieldType: 'textarea',
        validation: { required: true, minLength: 10, maxLength: 1000 },
        placeholder: 'How can we help you?',
      },
    ],
  },
  {
    id: 'builtin-feedback',
    title: 'Customer Feedback Form',
    description: 'Collect customer feedback with rating and suggestions',
    templateType: 'builtin',
    createdAt: '2024-01-01T00:00:00Z',
    fields: [
      {
        id: 'f1',
        fieldName: 'customerName',
        label: 'Your Name',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: false },
        placeholder: 'Enter your name (optional)',
      },
      {
        id: 'f2',
        fieldName: 'email',
        label: 'Email Address',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: {
          required: false,
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        placeholder: 'you@example.com (optional)',
      },
      {
        id: 'f3',
        fieldName: 'rating',
        label: 'How would you rate our service?',
        fieldValueType: 'number',
        fieldType: 'rating',
        validation: { required: true, min: 1, max: 5 },
      },
      {
        id: 'f4',
        fieldName: 'category',
        label: 'Feedback Category',
        fieldValueType: 'string',
        fieldType: 'radio',
        validation: { required: true },
        options: [
          'Product Quality',
          'Customer Service',
          'Website Experience',
          'Pricing',
          'Other',
        ],
      },
      {
        id: 'f5',
        fieldName: 'recommend',
        label: 'Would you recommend us to a friend?',
        fieldValueType: 'boolean',
        fieldType: 'radio',
        validation: { required: true },
        options: ['Yes, definitely', 'Maybe', 'No'],
      },
      {
        id: 'f6',
        fieldName: 'comments',
        label: 'Additional Comments',
        fieldValueType: 'string',
        fieldType: 'textarea',
        validation: { required: false, maxLength: 500 },
        placeholder: 'Share your detailed feedback...',
      },
    ],
  },
  {
    id: 'builtin-event-registration',
    title: 'Event Registration Form',
    description: 'Register participants for events with attendance details',
    templateType: 'builtin',
    createdAt: '2024-01-01T00:00:00Z',
    fields: [
      {
        id: 'f1',
        fieldName: 'fullName',
        label: 'Full Name',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: true, minLength: 2, maxLength: 100 },
        placeholder: 'Enter your full name',
      },
      {
        id: 'f2',
        fieldName: 'email',
        label: 'Email Address',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: {
          required: true,
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        placeholder: 'you@example.com',
      },
      {
        id: 'f3',
        fieldName: 'phone',
        label: 'Phone Number',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: true },
        placeholder: 'Your contact number',
      },
      {
        id: 'f4',
        fieldName: 'organization',
        label: 'Organization/Company',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: false },
        placeholder: 'Your organization (optional)',
      },
      {
        id: 'f5',
        fieldName: 'attendanceType',
        label: 'Attendance Type',
        fieldValueType: 'string',
        fieldType: 'select',
        validation: { required: true },
        options: ['In-Person', 'Virtual', 'Both'],
      },
      {
        id: 'f6',
        fieldName: 'dietaryRestrictions',
        label: 'Dietary Restrictions',
        fieldValueType: 'string',
        fieldType: 'checkbox',
        validation: { required: false },
        options: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut Allergy', 'None'],
      },
      {
        id: 'f7',
        fieldName: 'sessions',
        label: 'Sessions to Attend',
        fieldValueType: 'string',
        fieldType: 'checkbox',
        validation: { required: false },
        options: ['Morning Session', 'Afternoon Session', 'Evening Networking'],
      },
    ],
  },
  {
    id: 'builtin-job-application',
    title: 'Job Application Form',
    description: 'Collect resumes and applicant information for hiring',
    templateType: 'builtin',
    createdAt: '2024-01-01T00:00:00Z',
    fields: [
      {
        id: 'f1',
        fieldName: 'fullName',
        label: 'Full Name',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: true, minLength: 2, maxLength: 100 },
        placeholder: 'Enter your full name',
      },
      {
        id: 'f2',
        fieldName: 'email',
        label: 'Email Address',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: {
          required: true,
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        placeholder: 'you@example.com',
      },
      {
        id: 'f3',
        fieldName: 'phone',
        label: 'Phone Number',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: true },
        placeholder: 'Your contact number',
      },
      {
        id: 'f4',
        fieldName: 'currentCompany',
        label: 'Current Company',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: false },
        placeholder: 'Where do you currently work?',
      },
      {
        id: 'f5',
        fieldName: 'yearsOfExperience',
        label: 'Years of Experience',
        fieldValueType: 'number',
        fieldType: 'number',
        validation: { required: true, min: 0, max: 50 },
      },
      {
        id: 'f6',
        fieldName: 'position',
        label: 'Position Applying For',
        fieldValueType: 'string',
        fieldType: 'select',
        validation: { required: true },
        options: [
          'Software Engineer',
          'Product Manager',
          'Designer',
          'Data Analyst',
          'Other',
        ],
      },
      {
        id: 'f7',
        fieldName: 'linkedin',
        label: 'LinkedIn Profile',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: false },
        placeholder: 'https://linkedin.com/in/yourprofile',
      },
      {
        id: 'f8',
        fieldName: 'coverLetter',
        label: 'Cover Letter',
        fieldValueType: 'string',
        fieldType: 'textarea',
        validation: { required: false, maxLength: 2000 },
        placeholder: 'Tell us why you would be a great fit...',
      },
    ],
  },
  {
    id: 'builtin-survey',
    title: 'Customer Satisfaction Survey',
    description:
      'Measure customer satisfaction with NPS and detailed questions',
    templateType: 'builtin',
    createdAt: '2024-01-01T00:00:00Z',
    fields: [
      {
        id: 'f1',
        fieldName: 'productUsed',
        label: 'Which product/service did you use?',
        fieldValueType: 'string',
        fieldType: 'select',
        validation: { required: true },
        options: ['Product A', 'Product B', 'Product C', 'Multiple Products'],
      },
      {
        id: 'f2',
        fieldName: 'nps',
        label: 'How likely are you to recommend us to a friend? (0-10)',
        fieldValueType: 'number',
        fieldType: 'number',
        validation: { required: true, min: 0, max: 10 },
      },
      {
        id: 'f3',
        fieldName: 'easeOfUse',
        label: 'How easy was it to use our product?',
        fieldValueType: 'string',
        fieldType: 'radio',
        validation: { required: true },
        options: [
          'Very Easy',
          'Easy',
          'Neutral',
          'Difficult',
          'Very Difficult',
        ],
      },
      {
        id: 'f4',
        fieldName: 'supportRating',
        label: 'How would you rate our customer support?',
        fieldValueType: 'string',
        fieldType: 'radio',
        validation: { required: true },
        options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
      },
      {
        id: 'f5',
        fieldName: 'improvements',
        label: 'What could we improve?',
        fieldValueType: 'string',
        fieldType: 'checkbox',
        validation: { required: false },
        options: [
          'Product Features',
          'User Interface',
          'Customer Support',
          'Pricing',
          'Documentation',
        ],
      },
      {
        id: 'f6',
        fieldName: 'additionalFeedback',
        label: 'Any other feedback?',
        fieldValueType: 'string',
        fieldType: 'textarea',
        validation: { required: false, maxLength: 500 },
        placeholder: 'Share any additional thoughts...',
      },
    ],
  },
]
