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

import { POST } from './route';

describe('Keys API Endpoint', () => {
  it('POST: debe fallar si el body es invalido (schema validation)', async () => {
    const req = new NextRequest('http://localhost/api/keys', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });

    const response = await POST(req, { params: {} } as unknown);
    expect(response.status).toBe(400);
  });
});