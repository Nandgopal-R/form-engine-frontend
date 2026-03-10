import { describe, expect, it } from 'vitest';
import { fieldsApi, formsApi } from '../api/forms';
import { mockApiError, mockApiResponse, mockFetch } from './setup';
import type { Form, FormField } from '../api/forms';

const BASE_URL = 'http://localhost:8000';

const sampleForm: Form = {
  id: 'form-1',
  title: 'Test Form',
  description: 'A test form',
  isPublished: false,
  createdAt: '2025-01-01T00:00:00Z',
  ownerId: 'user-1',
};

const sampleField: FormField = {
  id: 'field-1',
  fieldName: 'name',
  label: 'Full Name',
  fieldValueType: 'string',
  fieldType: 'text',
  formId: 'form-1',
  prevFieldId: null,
  createdAt: '2025-01-01T00:00:00Z',
};

// ─── Forms API ───────────────────────────────────────────────

describe('formsApi integration', () => {
  describe('getAll', () => {
    it('fetches all forms with correct request', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([sampleForm]));

      const result = await formsApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result).toEqual([sampleForm]);
    });

    it('returns empty array when no forms exist', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([]));

      const result = await formsApi.getAll();
      expect(result).toEqual([]);
    });

    it('throws on unauthorized request', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Unauthorized', 401));

      await expect(formsApi.getAll()).rejects.toThrow('Unauthorized');
    });
  });

  describe('getById', () => {
    it('fetches a form by ID with correct request', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse(sampleForm));

      const result = await formsApi.getById('form-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms/form-1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result).toEqual(sampleForm);
    });

    it('throws on form not found', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Form not found', 404));

      await expect(formsApi.getById('nonexistent')).rejects.toThrow('Form not found');
    });
  });

  describe('getPublicById', () => {
    it('fetches a public form by ID', async () => {
      const publishedForm = { ...sampleForm, isPublished: true };
      mockFetch.mockResolvedValueOnce(mockApiResponse(publishedForm));

      const result = await formsApi.getPublicById('form-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms/public/form-1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result).toEqual(publishedForm);
    });

    it('throws when form is not published', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Form not published', 403));

      await expect(formsApi.getPublicById('form-1')).rejects.toThrow('Form not published');
    });
  });

  describe('create', () => {
    it('creates a form with correct payload', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse(sampleForm));

      const result = await formsApi.create({ title: 'Test Form', description: 'A test form' });

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test Form', description: 'A test form' }),
        credentials: 'include',
      });
      expect(result).toEqual(sampleForm);
    });

    it('creates a form with title only', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse(sampleForm));

      await formsApi.create({ title: 'Minimal Form' });

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms`, expect.objectContaining({
        body: JSON.stringify({ title: 'Minimal Form' }),
      }));
    });

    it('throws on validation error', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Title is required', 400));

      await expect(formsApi.create({ title: '' })).rejects.toThrow('Title is required');
    });
  });

  describe('update', () => {
    it('updates a form with correct payload', async () => {
      const updated = { ...sampleForm, title: 'Updated Title' };
      mockFetch.mockResolvedValueOnce(mockApiResponse(updated));

      const result = await formsApi.update('form-1', { title: 'Updated Title' });

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms/form-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title' }),
        credentials: 'include',
      });
      expect(result.title).toBe('Updated Title');
    });

    it('throws on unauthorized update', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Not authorized', 403));

      await expect(formsApi.update('form-1', { title: 'X' })).rejects.toThrow('Not authorized');
    });
  });

  describe('delete', () => {
    it('deletes a form with correct request', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200, statusText: 'OK' }));

      await formsApi.delete('form-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms/form-1`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    });

    it('throws on delete failure', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Form not found', 404));

      await expect(formsApi.delete('nonexistent')).rejects.toThrow('Form not found');
    });
  });

  describe('publish', () => {
    it('publishes a form', async () => {
      const published = { ...sampleForm, isPublished: true };
      mockFetch.mockResolvedValueOnce(mockApiResponse(published));

      const result = await formsApi.publish('form-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms/publish/form-1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result.isPublished).toBe(true);
    });
  });

  describe('unpublish', () => {
    it('unpublishes a form', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse(sampleForm));

      const result = await formsApi.unpublish('form-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/forms/unpublish/form-1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result.isPublished).toBe(false);
    });
  });

  describe('error handling', () => {
    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Network request failed'));

      await expect(formsApi.getAll()).rejects.toThrow('Network request failed');
    });

    it('handles malformed JSON error response', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response('not json', { status: 500, statusText: 'Internal Server Error' }),
      );

      await expect(formsApi.getAll()).rejects.toThrow('Request failed: Internal Server Error');
    });
  });
});

// ─── Fields API ──────────────────────────────────────────────

describe('fieldsApi integration', () => {
  describe('getById', () => {
    it('fetches fields for a form', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([sampleField]));

      const result = await fieldsApi.getById('form-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/fields/form-1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result).toEqual([sampleField]);
    });

    it('returns empty array when form has no fields', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([]));

      const result = await fieldsApi.getById('form-1');
      expect(result).toEqual([]);
    });
  });

  describe('getPublicById', () => {
    it('fetches public fields without auth credentials', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([sampleField]));

      const result = await fieldsApi.getPublicById('form-1');

      // Public endpoint should NOT include credentials
      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/fields/public/form-1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual([sampleField]);
    });
  });

  describe('create', () => {
    it('creates a field with correct payload', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse(sampleField));

      const result = await fieldsApi.create('form-1', {
        fieldName: 'name',
        label: 'Full Name',
        fieldValueType: 'string',
        fieldType: 'text',
      });

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/fields/form-1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldName: 'name',
          label: 'Full Name',
          fieldValueType: 'string',
          fieldType: 'text',
        }),
        credentials: 'include',
      });
      expect(result).toEqual(sampleField);
    });

    it('creates a field with validation rules', async () => {
      const fieldWithValidation = {
        ...sampleField,
        validation: { required: true, minLength: 2, maxLength: 100 },
      };
      mockFetch.mockResolvedValueOnce(mockApiResponse(fieldWithValidation));

      const result = await fieldsApi.create('form-1', {
        fieldName: 'name',
        label: 'Full Name',
        fieldValueType: 'string',
        fieldType: 'text',
        validation: { required: true, minLength: 2, maxLength: 100 },
      });

      expect(result.validation).toEqual({ required: true, minLength: 2, maxLength: 100 });
    });

    it('throws on duplicate field name', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Field name already exists', 400));

      await expect(
        fieldsApi.create('form-1', {
          fieldName: 'name',
          label: 'Full Name',
          fieldValueType: 'string',
          fieldType: 'text',
        }),
      ).rejects.toThrow('Field name already exists');
    });
  });

  describe('update', () => {
    it('updates a field with partial data', async () => {
      const updated = { ...sampleField, label: 'Updated Label' };
      mockFetch.mockResolvedValueOnce(mockApiResponse(updated));

      const result = await fieldsApi.update('field-1', { label: 'Updated Label' });

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/fields/field-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: 'Updated Label' }),
        credentials: 'include',
      });
      expect(result.label).toBe('Updated Label');
    });

    it('updates field with options for select type', async () => {
      const updatedField = { ...sampleField, fieldType: 'select', options: ['A', 'B', 'C'] };
      mockFetch.mockResolvedValueOnce(mockApiResponse(updatedField));

      const result = await fieldsApi.update('field-1', {
        fieldType: 'select',
        options: ['A', 'B', 'C'],
      });

      expect(result.options).toEqual(['A', 'B', 'C']);
    });
  });

  describe('delete', () => {
    it('deletes a field with correct request', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200, statusText: 'OK' }));

      await fieldsApi.delete('field-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/fields/field-1`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    });

    it('throws when field not found', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Field not found', 404));

      await expect(fieldsApi.delete('nonexistent')).rejects.toThrow('Field not found');
    });
  });
});
