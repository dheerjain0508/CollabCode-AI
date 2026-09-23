import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Response } from 'express';
import { HttpStatusCodesService } from './http-status-codes.service';

/**
 * HttpStatusCodesController
 * Exposes REST API endpoints under /http-status-codes/ explicitly demonstrating
 * HTTP status codes used correctly (200, 201, 204, 400, 401, 403, 404, 409, 422, 500, 503).
 */
@AllowAnonymous()
@Controller('http-status-codes')
export class HttpStatusCodesController {
  constructor(
    private readonly httpStatusCodesService: HttpStatusCodesService,
  ) {}

  @Get('200')
  @HttpCode(HttpStatus.OK)
  get200Ok() {
    return this.httpStatusCodesService.get200OkSuccess();
  }

  @Post('201')
  @HttpCode(HttpStatus.CREATED)
  get201Created() {
    return this.httpStatusCodesService.get201CreatedSuccess();
  }

  @Delete('204')
  @HttpCode(HttpStatus.NO_CONTENT)
  get204NoContent() {
    return this.httpStatusCodesService.get204NoContentSuccess();
  }

  @Get('400')
  @HttpCode(HttpStatus.BAD_REQUEST)
  get400BadRequest() {
    return this.httpStatusCodesService.trigger400BadRequest();
  }

  @Get('401')
  @HttpCode(HttpStatus.UNAUTHORIZED)
  get401Unauthorized() {
    return this.httpStatusCodesService.trigger401Unauthorized();
  }

  @Get('403')
  @HttpCode(HttpStatus.FORBIDDEN)
  get403Forbidden() {
    return this.httpStatusCodesService.trigger403Forbidden();
  }

  @Get('404')
  @HttpCode(HttpStatus.NOT_FOUND)
  get404NotFound() {
    return this.httpStatusCodesService.trigger404NotFound();
  }

  @Get('409')
  @HttpCode(HttpStatus.CONFLICT)
  get409Conflict() {
    return this.httpStatusCodesService.trigger409Conflict();
  }

  @Get('422')
  @HttpCode(HttpStatus.UNPROCESSABLE_ENTITY)
  get422UnprocessableEntity() {
    return this.httpStatusCodesService.trigger422UnprocessableEntity();
  }

  @Get('500')
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  get500InternalServerError() {
    return this.httpStatusCodesService.trigger500InternalServerError();
  }

  @Get('503')
  @HttpCode(HttpStatus.SERVICE_UNAVAILABLE)
  get503ServiceUnavailable() {
    return this.httpStatusCodesService.trigger503ServiceUnavailable();
  }

  @Get('express-demo')
  getExpressStatusDemo(@Res() res: any) {
    res.status(HttpStatus.OK).json({
      message: 'Demonstrates Express res.status(200) status response.',
      statusCode: 200,
    });
  }
}
