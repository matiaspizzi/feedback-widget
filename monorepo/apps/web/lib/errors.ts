
export const PRISMA_UNIQUE_KEY_ERROR = 'P2002';
export const PRISMA_NOT_FOUND_ERROR = 'P2025';

export class DomainError extends Error {
  constructor(public message: string, public code?: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class UniqueConstraintError extends DomainError {
  constructor(entity: string, field: string) {
    super(`${entity} with this ${field} already exists.`);
    this.code = "UNIQUE_CONFLICT";
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string) {
    super(`${entity} not found.`);
    this.code = "NOT_FOUND";
  }
}

export class InvalidInputError extends DomainError {
  constructor(message: string) {
    super(message);
    this.code = "INVALID_INPUT";
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.code = "UNAUTHORIZED";
  }
}

export class DatabaseError extends DomainError {
  constructor(message: string = "Database error") {
    super(message);
    this.code = "DATABASE_ERROR";
  }
}

export class BadRequestError extends DomainError {
  constructor(message: string) {
    super(message);
    this.code = "BAD_REQUEST";
  }
}

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}