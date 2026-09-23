import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HttpExceptionFilter
 * Catches all HttpExceptions thrown across the NestJS backend application and formats
 * standard HTTP responses using correct HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 500, 503).
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any = exception.getResponse();

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error:
        typeof exceptionResponse === 'object' && exceptionResponse.error
          ? exceptionResponse.error
          : exception.name,
      message:
        typeof exceptionResponse === 'object' && exceptionResponse.message
          ? exceptionResponse.message
          : exception.message,
    };

    // Explicitly set the HTTP status code on the Express response object
    response.status(status).json(responseBody);
  }
}
