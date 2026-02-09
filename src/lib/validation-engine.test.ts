import { describe, it, expect, vi } from 'vitest';
import {
    validateField,
    validateForm,
    buildValidationConfig,
    getRulesForFieldType,
    combinePatterns,
    getPatternDescription,
    PREDEFINED_PATTERNS,
    RULE_TEMPLATES,
    type ValidationConfig,
} from './validation-engine';

describe('Validation Engine', () => {
    describe('getPatternDescription', () => {
        it('returns description for known pattern', () => {
            // Find a pattern to test
            const pattern = Object.values(PREDEFINED_PATTERNS)[0].pattern;
            const description = Object.values(PREDEFINED_PATTERNS)[0].description;
            expect(getPatternDescription(pattern)).toBe(description);
        });

        it('returns "Custom pattern" for unknown pattern', () => {
            expect(getPatternDescription('^unknown$')).toBe('Custom pattern');
        });
    });

    describe('validateField', () => {
        it('validates required field', () => {
            const config: ValidationConfig = { required: true };

            // Empty values should fail validation
            expect(validateField('', 'test', 'Test Field', config)).toHaveLength(1);
            expect(validateField(null, 'test', 'Test Field', config)).toHaveLength(1);
            expect(validateField(undefined, 'test', 'Test Field', config)).toHaveLength(1);

            // Non-empty values should pass
            expect(validateField('val', 'test', 'Test Field', config)).toHaveLength(0);
            expect(validateField(0, 'test', 'Test Field', config)).toHaveLength(0);
        });

        it('skips validation if empty and not required', () => {
            const config: ValidationConfig = { required: false, minLength: 5 };
            expect(validateField('', 'test', 'Test Field', config)).toHaveLength(0);
        });

        it('validates minLength', () => {
            const config: ValidationConfig = { minLength: 3 };
            expect(validateField('ab', 'test', 'Test Field', config)).toHaveLength(1);
            expect(validateField('abc', 'test', 'Test Field', config)).toHaveLength(0);
        });

        it('validates maxLength', () => {
            const config: ValidationConfig = { maxLength: 3 };
            expect(validateField('abcd', 'test', 'Test Field', config)).toHaveLength(1);
            expect(validateField('abc', 'test', 'Test Field', config)).toHaveLength(0);
        });

        it('validates min value', () => {
            const config: ValidationConfig = { min: 10 };
            expect(validateField(5, 'test', 'Test Field', config)).toHaveLength(1);
            expect(validateField(10, 'test', 'Test Field', config)).toHaveLength(0);

            // Also works with string numbers
            expect(validateField('5', 'test', 'Test Field', config)).toHaveLength(1);
        });

        it('validates max value', () => {
            const config: ValidationConfig = { max: 10 };
            expect(validateField(15, 'test', 'Test Field', config)).toHaveLength(1);
            expect(validateField(10, 'test', 'Test Field', config)).toHaveLength(0);
        });

        it('validates pattern', () => {
            // Numbers only
            const config: ValidationConfig = { pattern: '^[0-9]+$' };
            expect(validateField('abc', 'test', 'Test Field', config)).toHaveLength(1);
            expect(validateField('123', 'test', 'Test Field', config)).toHaveLength(0);
        });

        it('handles invalid regex pattern gracefully', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const config: ValidationConfig = { pattern: '[' }; // Invalid regex

            // Should not throw
            const errors = validateField('value', 'test', 'Test Field', config);
            expect(errors).toHaveLength(0);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('returns correct error message for pattern failure', () => {
            const config: ValidationConfig = { pattern: PREDEFINED_PATTERNS.email.pattern };
            const errors = validateField('invalid-email', 'test', 'Email', config);
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('email');
        });
    });

    describe('validateForm', () => {
        it('validates multiple fields', () => {
            const fields = [
                { id: 'f1', label: 'Field 1', fieldType: 'text', validation: { required: true } },
                { id: 'f2', label: 'Field 2', fieldType: 'text', validation: { minLength: 3 } },
            ];

            const responses = { f1: '', f2: 'ab' }; // Both invalid
            const result = validateForm(responses, fields);

            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(2);
        });

        it('returns valid result when no errors', () => {
            const fields = [
                { id: 'f1', label: 'Field 1', fieldType: 'text', validation: { required: true } },
            ];
            const responses = { f1: 'valid' };
            const result = validateForm(responses, fields);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('buildValidationConfig', () => {
        it('builds config from selected rules', () => {
            const selectedRules = [
                { ruleId: 'minLength', params: { value: 5 } },
                { ruleId: 'email' },
            ];
            const config = buildValidationConfig(selectedRules, true);

            expect(config.required).toBe(true);
            expect(config.minLength).toBe(5);
            expect(config.pattern).toBe(PREDEFINED_PATTERNS.email.pattern);
        });
    });

    describe('combinePatterns', () => {
        it('returns empty string for empty input', () => {
            expect(combinePatterns([])).toBe('');
        });

        it('returns single pattern as is', () => {
            expect(combinePatterns(['^abc$'])).toBe('^abc$');
        });

        it('combines multiple patterns', () => {
            const p1 = 'abc';
            const p2 = 'def';
            const combined = combinePatterns([p1, p2]);
            expect(combined).toContain(p1);
            expect(combined).toContain(p2);
        });
    });

    describe('getRulesForFieldType', () => {
        it('returns text rules for text input', () => {
            const rules = getRulesForFieldType('text');
            expect(rules.length).toBeGreaterThan(0);
            expect(rules.some(r => r.category === 'text')).toBe(true);
        });

        it('returns number rules for number input', () => {
            const rules = getRulesForFieldType('number');
            expect(rules.length).toBeGreaterThan(0);
            expect(rules.some(r => r.category === 'number')).toBe(true);
        });

        it('returns specific rules for email', () => {
            const rules = getRulesForFieldType('email');
            expect(rules.some(r => r.id === 'email')).toBe(true);
        });

        it('returns specific rules for phone', () => {
            const rules = getRulesForFieldType('phone');
            expect(rules.some(r => r.id === 'phone')).toBe(true);
        });

        it('returns specific rules for url', () => {
            const rules = getRulesForFieldType('url');
            expect(rules.some(r => r.id === 'url')).toBe(true);
        });

        it('returns text rules for unknown types', () => {
            const rules = getRulesForFieldType('unknown');
            expect(rules.every(r => r.category === 'text')).toBe(true);
        });
    });

    describe('RULE_TEMPLATES', () => {
        it('generates validation config for all templates', () => {
            RULE_TEMPLATES.forEach(template => {
                // Test without params
                const config1 = template.generateValidation();
                expect(config1).toBeDefined();

                // Test with value param (simulating user input)
                const config2 = template.generateValidation({ value: 5 });
                expect(config2).toBeDefined();
            });
        });

        it('generates patterns for templates that have them', () => {
            RULE_TEMPLATES.forEach(template => {
                if (template.generatePattern) {
                    const pattern = template.generatePattern();
                    expect(typeof pattern).toBe('string');
                    expect(pattern.length).toBeGreaterThan(0);
                }
            });
        });
    });
});
