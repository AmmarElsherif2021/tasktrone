/**
 * Framework-agnostic errors thrown by services. The HTTP layer maps these to
 * status codes (NotFoundError -> 404, ValidationError -> 400) via the global
 * error mapping middleware.
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
