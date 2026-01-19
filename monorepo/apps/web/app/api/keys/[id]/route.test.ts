import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import type { MockHandler } from '@tests/types';

interface ApiKeyDeps {
  apiKeyService: {
    delete: ReturnType<typeof vi.fn>;
  };
}

const mockApiKeyService = { delete: vi.fn() };

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
        { userId: 'user_123', deps: { apiKeyService: mockApiKeyService } },
        context
      );
    },
}));

import { DELETE } from './route';

describe('Keys [id] DELETE Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe eliminar una API Key exitosamente', async () => {
    mockApiKeyService.delete.mockResolvedValue(undefined);

    const req = new NextRequest('http://localhost/api/keys/key_123', { method: 'DELETE' });

    const response = await DELETE(req, { params: { id: 'key_123' } } as unknown);

    expect(response.status).toBe(204);
  });
});