import { describe, expect, it } from 'vitest';
import { responsesApi } from '../api/responses';
import { mockApiError, mockApiResponse, mockFetch } from './setup';
import type { FormResponse, FormResponseForOwner, UserResponse } from '../api/responses';

const BASE_URL = 'http://localhost:8000';

const sampleResponse: FormResponse = {
  id: 'resp-1',
  formId: 'form-1',
  respondentId: 'user-2',
  answers: { 'field-1': 'John Doe', 'field-2': 25 },
  submittedAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};

const sampleOwnerResponse: FormResponseForOwner = {
  id: 'resp-1',
  formId: 'form-1',
  formTitle: 'Test Form',
  answers: { 'Full Name': 'John Doe', 'Age': 25 },
  rawAnswers: { 'field-1': 'John Doe', 'field-2': 25 },
};

const sampleUserResponse: UserResponse = {
  id: 'resp-1',
  formId: 'form-1',
  formTitle: 'Test Form',
  formDescription: 'A test form',
  answers: { 'Full Name': 'John Doe' },
  isSubmitted: true,
  submittedAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};

describe('responsesApi integration', () => {
  describe('submit', () => {
    it('submits a response with correct payload', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse(sampleResponse));

      const result = await responsesApi.submit('form-1', {
        answers: { 'field-1': 'John Doe', 'field-2': 25 },
        isSubmitted: true,
      });

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/responses/submit/form-1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: { 'field-1': 'John Doe', 'field-2': 25 },
          isSubmitted: true,
        }),
        credentials: 'include',
      });
      expect(result).toEqual(sampleResponse);
    });

    it('submits without isSubmitted flag', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse(sampleResponse));

      await responsesApi.submit('form-1', {
        answers: { 'field-1': 'Jane' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/responses/submit/form-1`,
        expect.objectContaining({
          body: JSON.stringify({ answers: { 'field-1': 'Jane' } }),
        }),
      );
    });

    it('throws on form not found', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Form not found', 404));

      await expect(
        responsesApi.submit('nonexistent', { answers: {} }),
      ).rejects.toThrow('Form not found');
    });

    it('throws on unauthorized submission', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Unauthorized', 401));

      await expect(
        responsesApi.submit('form-1', { answers: {} }),
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('saveDraft', () => {
    it('saves a draft response with correct endpoint', async () => {
      const draftResponse = { ...sampleResponse, id: 'draft-1' };
      mockFetch.mockResolvedValueOnce(mockApiResponse(draftResponse));

      const result = await responsesApi.saveDraft('form-1', {
        answers: { 'field-1': 'partial answer' },
      });

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/responses/draft/form-1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: { 'field-1': 'partial answer' } }),
        credentials: 'include',
      });
      expect(result).toEqual(draftResponse);
    });

    it('saves draft with empty answers', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse(sampleResponse));

      await responsesApi.saveDraft('form-1', { answers: {} });

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/responses/draft/form-1`,
        expect.objectContaining({
          body: JSON.stringify({ answers: {} }),
        }),
      );
    });
  });

  describe('resume', () => {
    it('resumes a draft with correct endpoint and method', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse({ count: 1 }));

      const result = await responsesApi.resume('resp-1', {
        answers: { 'field-1': 'updated answer' },
        isSubmitted: true,
      });

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/responses/resume/resp-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: { 'field-1': 'updated answer' },
          isSubmitted: true,
        }),
        credentials: 'include',
      });
      expect(result).toEqual({ count: 1 });
    });

    it('throws when response not found', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Response not found', 404));

      await expect(
        responsesApi.resume('nonexistent', { answers: {} }),
      ).rejects.toThrow('Response not found');
    });
  });

  describe('getForForm', () => {
    it('fetches responses for a form (owner view)', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([sampleOwnerResponse]));

      const result = await responsesApi.getForForm('form-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/responses/form-1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result).toEqual([sampleOwnerResponse]);
      expect(result[0].formTitle).toBe('Test Form');
    });

    it('returns empty array when no responses exist', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([]));

      const result = await responsesApi.getForForm('form-1');
      expect(result).toEqual([]);
    });

    it('throws on non-owner access', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Not authorized', 403));

      await expect(responsesApi.getForForm('form-1')).rejects.toThrow('Not authorized');
    });
  });

  describe('getUserResponse', () => {
    it('fetches user submitted response for a form', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([sampleOwnerResponse]));

      const result = await responsesApi.getUserResponse('form-1');

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/responses/user/form-1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result).toHaveLength(1);
    });

    it('returns empty array when user has not responded', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([]));

      const result = await responsesApi.getUserResponse('form-1');
      expect(result).toEqual([]);
    });
  });

  describe('getMyResponses', () => {
    it('fetches all responses for current user', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([sampleUserResponse]));

      const result = await responsesApi.getMyResponses();

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/responses/my`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      expect(result).toEqual([sampleUserResponse]);
      expect(result[0].isSubmitted).toBe(true);
    });

    it('returns empty array when user has no responses', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse([]));

      const result = await responsesApi.getMyResponses();
      expect(result).toEqual([]);
    });

    it('throws on unauthorized', async () => {
      mockFetch.mockResolvedValueOnce(mockApiError('Unauthorized', 401));

      await expect(responsesApi.getMyResponses()).rejects.toThrow('Unauthorized');
    });
  });

  describe('error handling', () => {
    it('handles network errors across all methods', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(responsesApi.getMyResponses()).rejects.toThrow('Failed to fetch');
    });

    it('handles server errors with malformed JSON', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response('Internal Server Error', { status: 500, statusText: 'Internal Server Error' }),
      );

      await expect(responsesApi.getForForm('form-1')).rejects.toThrow(
        'Request failed: Internal Server Error',
      );
    });

    it('all endpoints include credentials for auth cookies', async () => {
      // Verify each endpoint sends credentials
      const endpoints = [
        () => responsesApi.submit('f', { answers: {} }),
        () => responsesApi.saveDraft('f', { answers: {} }),
        () => responsesApi.resume('r', { answers: {} }),
        () => responsesApi.getForForm('f'),
        () => responsesApi.getUserResponse('f'),
        () => responsesApi.getMyResponses(),
      ];

      for (const endpoint of endpoints) {
        mockFetch.mockResolvedValueOnce(mockApiResponse({}));
        await endpoint();
      }

      // All 6 calls should include credentials
      for (let i = 0; i < 6; i++) {
        expect(mockFetch.mock.calls[i][1]).toHaveProperty('credentials', 'include');
      }
    });
  });
});
