import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import type { MockHandler } from '@tests/types';

interface FeedbackDeps {
  feedbackService: {
    create: ReturnType<typeof vi.fn>;
  };
}

const mockFeedbackService = { create: vi.fn() };

vi.mock('@lib/deps', () => ({
  getFeedbackDeps: () => ({
    feedbackService: mockFeedbackService,
  }),
}));

vi.mock('@lib/api-utils', () => ({
  withApiKey: (handler: MockHandler<FeedbackDeps>) =>
    async (req: NextRequest, context: unknown) => {
      return handler(
        req,
        { deps: { feedbackService: mockFeedbackService } },
        context
      );
    },
}));

import { POST } from './route';

describe('Feedback API Endpoint', () => {
  it('POST: debe crear un feedback exitosamente', async () => {
    const validPayload = {
      projectId: 'proj_1',
      userId: '00000000-0000-0000-0000-000000000000',
      rating: 5,
      comment: 'Excelente widget',
      timestamp: new Date().toISOString(),
      context: { url: '/home', userAgent: 'Mozilla/5.0' }
    };

    mockFeedbackService.create.mockResolvedValue({ id: 'fb_999' });

    const req = new NextRequest('http://localhost/api/feedback', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const response = await POST(req, { params: {} } as unknown);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.id).toBe('fb_999');
    expect(mockFeedbackService.create).toHaveBeenCalledWith(expect.objectContaining({
      rating: 5,
      comment: 'Excelente widget'
    }));
  });

  it('POST: debe retornar 400 si el rating está fuera de rango (ej: 10)', async () => {
    const invalidPayload = {
      projectId: 'proj_1',
      rating: 10,
      comment: 'Muy alto'
    };

    const req = new NextRequest('http://localhost/api/feedback', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
    });

    const response = await POST(req, { params: {} } as unknown);

    console.log(response)

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('POST: debe retornar 400 si faltan campos obligatorios (ej: projectId)', async () => {
    const incompletePayload = {
      rating: 5,
      comment: 'Falta el proyecto'
    };

    const req = new NextRequest('http://localhost/api/feedback', {
      method: 'POST',
      body: JSON.stringify(incompletePayload),
    });

    const response = await POST(req, { params: {} } as unknown);

    expect(response.status).toBe(400);
  });

  it('POST: debe manejar un JSON malformado', async () => {
    const req = new NextRequest('http://localhost/api/feedback', {
      method: 'POST',
      body: '{ json_invalido: ',
    });

    const response = await POST(req, { params: {} } as unknown);

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('POST: debe retornar 500 si el servicio de base de datos falla', async () => {
    const validPayload = { projectId: 'proj_1', rating: 5, comment: 'Ok' };

    mockFeedbackService.create.mockRejectedValue(new Error('DB Error'));

    const req = new NextRequest('http://localhost/api/feedback', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const response = await POST(req, { params: {} } as unknown);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});