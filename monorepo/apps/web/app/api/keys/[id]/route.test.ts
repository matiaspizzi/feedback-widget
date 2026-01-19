import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { DELETE } from './route';
import { NotFoundError, UnauthorizedError } from '@lib/errors';
import * as apiUtils from "@lib/api-utils";

const vi_mockApiKeyService = {
  delete: vi.fn()
};

vi.mock('@lib/deps', () => ({
  getApiKeyDeps: () => ({ apiKeyService: vi_mockApiKeyService }),
}));

vi.mock('@lib/api-utils', () => ({
  validateUserOrKey: vi.fn(),
}));

vi.mock("@lib/api-error-handler", async (importOriginal) => {
  return await importOriginal<typeof import("@lib/api-error-handler")>();
});

describe('Keys [id] DELETE Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const userId = 'user_123';
  const keyId = 'k1';

  it('debe retornar 204 al eliminar exitosamente', async () => {
    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue(userId);
    vi_mockApiKeyService.delete.mockResolvedValue(undefined);

    const req = new NextRequest(`http://localhost/api/keys/${keyId}`, { method: 'DELETE' });
    const response = await DELETE(req, { params: { id: keyId } });

    expect(response.status).toBe(204);
    expect(vi_mockApiKeyService.delete).toHaveBeenCalledWith(keyId, userId);
  });

  it('debe retornar 404 si el servicio lanza NotFoundError', async () => {
    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue(userId);
    vi_mockApiKeyService.delete.mockRejectedValue(new NotFoundError('API Key'));

    const req = new NextRequest('http://localhost/api/keys/invalid', { method: 'DELETE' });
    const response = await DELETE(req, { params: { id: 'invalid' } });

    const json = await response.json() as { success: boolean; error: string };

    expect(response.status).toBe(404);
    expect(json.success).toBe(false);
    expect(json.error).toContain('not found');
  });

  it('debe retornar 401 si el servicio lanza UnauthorizedError', async () => {
    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue(userId);
    vi_mockApiKeyService.delete.mockRejectedValue(new UnauthorizedError('Ownership mismatch'));

    const req = new NextRequest(`http://localhost/api/keys/${keyId}`, { method: 'DELETE' });
    const response = await DELETE(req, { params: { id: keyId } });

    const json = await response.json() as { success: boolean; error: string };

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error).toBe('Ownership mismatch');
  });
});