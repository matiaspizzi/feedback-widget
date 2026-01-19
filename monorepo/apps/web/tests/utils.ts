import { NextRequest } from 'next/server';

export const createMockContext = (params: Record<string, string> = {}) => ({
  params,
});

export const createMockRequest = (url: string, method = 'GET', body?: unknown) => {
  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
};