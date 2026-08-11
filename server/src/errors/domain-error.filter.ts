import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { NotFoundError, ValidationError } from './domain-errors'

/**
 * Maps the plain domain errors services throw (NotFoundError, ValidationError) to HTTP status
 * codes and Nest's standard error JSON shape. Scoped to just these two types so Nest's own
 * HttpExceptions (e.g. from ValidationPipe) and unexpected errors keep going through Nest's
 * default exception filter instead of being reimplemented here.
 */
@Catch(NotFoundError, ValidationError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError | ValidationError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()

    const statusCode = exception instanceof NotFoundError ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST
    const error = exception instanceof NotFoundError ? 'Not Found' : 'Bad Request'

    response.status(statusCode).json({
      statusCode,
      error,
      message: exception.message,
    })
  }
}
