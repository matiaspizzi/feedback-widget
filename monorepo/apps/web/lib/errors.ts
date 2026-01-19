
export const PRISMA_UNIQUE_KEY_ERROR = 'P2002';
export const PRISMA_NOT_FOUND_ERROR = 'P2025';

export class DomainError extends Error {
  constructor(
    public message: string,
    public status: number = 400,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class UniqueConstraintError extends DomainError {
  constructor(entity: string, field: string) {
    super(`${entity} with this ${field} already exists.`);
    this.status = 409;
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string) {
    super(`${entity} not found.`);
    this.status = 404;
  }
}

export class InvalidInputError extends DomainError {
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.status = 401;
  }
}

export class DatabaseError extends DomainError {
  constructor(message: string = "Database error") {
    super(message);
    this.status = 500;
  }
}

export class BadRequestError extends DomainError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(message, 400, details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}