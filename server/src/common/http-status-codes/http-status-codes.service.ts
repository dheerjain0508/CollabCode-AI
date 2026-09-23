import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

/**
 * HttpStatusCodesService
 * Service demonstrating correct usage and throwing of standard HTTP status codes:
 * 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized,
 * 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity,
 * 500 Internal Server Error, 503 Service Unavailable.
 */
@Injectable()
export class HttpStatusCodesService {
  get200OkSuccess() {
    return {
      statusCode: 200,
      status: 'OK',
      message: 'HTTP 200 OK - Standard successful HTTP response.',
    };
  }

  get201CreatedSuccess() {
    return {
      statusCode: 201,
      status: 'Created',
      message: 'HTTP 201 Created - Resource successfully created.',
    };
  }

  get204NoContentSuccess() {
    return null; // 204 No Content has empty body
  }

  trigger400BadRequest() {
    throw new BadRequestException(
      'HTTP 400 Bad Request: Invalid or missing input parameters in request.',
    );
  }

  trigger401Unauthorized() {
    throw new UnauthorizedException(
      'HTTP 401 Unauthorized: Valid authentication credentials are required.',
    );
  }

  trigger403Forbidden() {
    throw new ForbiddenException(
      'HTTP 403 Forbidden: Authenticated user lacks permission for this resource.',
    );
  }

  trigger404NotFound() {
    throw new NotFoundException(
      'HTTP 404 Not Found: The requested resource could not be found.',
    );
  }

  trigger409Conflict() {
    throw new ConflictException(
      'HTTP 409 Conflict: Unique constraint violation or duplicate resource.',
    );
  }

  trigger422UnprocessableEntity() {
    throw new UnprocessableEntityException(
      'HTTP 422 Unprocessable Entity: Business validation failed on payload.',
    );
  }

  trigger500InternalServerError() {
    throw new InternalServerErrorException(
      'HTTP 500 Internal Server Error: An unhandled operational server error occurred.',
    );
  }

  trigger503ServiceUnavailable() {
    throw new ServiceUnavailableException(
      'HTTP 503 Service Unavailable: Database or upstream service temporarily offline.',
    );
  }
}
