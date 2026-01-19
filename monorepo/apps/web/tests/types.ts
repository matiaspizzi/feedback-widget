import { NextRequest, NextResponse } from 'next/server';

export interface MockOptions<T> {
  deps: T;
  userId?: string;
}

export type MockHandler<T> = (
  req: NextRequest,
  options: MockOptions<T>,
  context: unknown
) => Promise<NextResponse>;