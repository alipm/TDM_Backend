class CustomError extends Error {
  constructor(message, statusCode, details = null, query = null, stack = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.query = query;
    this.stack = stack;
  }
}

class DatabaseError extends CustomError {
  constructor(message, details) {
    super(message, 500, details);
  }
}

class ValidationError extends CustomError {
  constructor(message, details) {
    super(message, 400, details);
  }
}

class NotFoundError extends CustomError {
  constructor(message, details) {
    super(message, 404, details);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message, details) {
    super(message, 401, details);
  }
}

export { CustomError, DatabaseError, ValidationError, NotFoundError, UnauthorizedError };
