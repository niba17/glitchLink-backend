export class CustomError extends Error {
  public statusCode: number;
  public meta?: any;

  constructor(message: string, statusCode: number = 500, meta?: any) {
    super(message);
    this.statusCode = statusCode;
    this.meta = meta;

    // Untuk mendukung instanceof CustomError
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends CustomError {
  constructor(errors: { path: string; message: string }[]) {
    super("Validation failed", 400, { errors });
  }
}

export class CredentialError extends CustomError {
  constructor(
    message: string = "Credential",
    paths: string[] = [] // contoh: ["email", "password"]
  ) {
    const errors = paths.map((path) => ({ path, message: "" }));
    super(message, 401, { errors });
  }
}

export class ConflictError extends CustomError {
  constructor(
    message = "Conflict error",
    meta?: { path?: string; message?: string }[] // sesuai kebutuhanmu
  ) {
    super(message, 409, meta);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(entity: string = "Resource") {
    super(`${entity} not found`, 404);
  }
}

export class ExpiredError extends CustomError {
  constructor(entity: string = "Resource") {
    super(`${entity} expired`, 410);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
  }
}

export class TokenExpiredError extends UnauthorizedError {
  constructor(message: string = "Access token expired") {
    super(message);
  }
}

export class InvalidTokenError extends UnauthorizedError {
  constructor(message: string = "Invalid or malformed token") {
    super(message);
  }
}

export class InvalidInputError extends BadRequestError {
  constructor(message: string = "Invalid input provided") {
    super(message);
  }
}
