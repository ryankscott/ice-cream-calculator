export class ApplicationError extends Error {
  readonly status: number
  readonly details?: Record<string, unknown>

  constructor(
    message: string,
    options: { status?: number; details?: Record<string, unknown> } = {},
  ) {
    super(message)
    this.name = this.constructor.name
    this.status = options.status ?? 500
    this.details = options.details
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, details?: Record<string, unknown>) {
    super(`${resource} not found`, { status: 404, details })
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, { status: 400, details })
  }
}

