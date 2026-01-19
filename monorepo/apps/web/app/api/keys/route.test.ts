import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import type { MockHandler } from '@tests/types';

const mockApiKeyService = {
  getAllByUserId: vi.fn(),
  create: vi.fn(),
};

interface ApiKeyDeps {
  apiKeyService: typeof mockApiKeyService;
}

vi.mock('@lib/deps', () => ({
  getApiKeyDeps: () => ({
    apiKeyService: mockApiKeyService,
  }),
}));

vi.mock('@lib/api-utils', () => ({
  withAuth: (handler: MockHandler<ApiKeyDeps>) =>
    async (req: NextRequest, context: unknown) => {
      return handler(
        req,
        {
          userId: 'user_123',
          deps: { apiKeyService: mockApiKeyService }
        },
        context
      );
    },
}));

import { GET, POST } from './route';

describe('Keys API Endpoint', () => {
  it('GET: debe retornar las api keys del usuario', async () => {
    const mockKeys = [{ id: '1', name: 'Test Key' }];
    mockApiKeyService.getAllByUserId.mockResolvedValue(mockKeys);

    const req = new NextRequest('http://localhost/api/keys');

    const response = await GET(req, { params: {} } as unknown);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockKeys);
    expect(mockApiKeyService.getAllByUserId).toHaveBeenCalledWith('user_123');
  });

  it('POST: debe fallar si el body es invalido (schema validation)', async () => {
    const req = new NextRequest('http://localhost/api/keys', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });

    const response = await POST(req, { params: {} } as unknown);
    expect(response.status).toBe(400);
  });
});