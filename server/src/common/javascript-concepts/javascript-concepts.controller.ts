import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { demonstrateEventLoop } from './event-loop';
import { demonstrateHoisting } from './hoisting';
import { demonstrateAsyncPatterns } from './promises-vs-callbacks';

@Controller('javascript-concepts')
export class JavascriptConceptsController {
  @AllowAnonymous()
  @Get('event-loop')
  @HttpCode(HttpStatus.OK)
  getEventLoopExample() {
    return demonstrateEventLoop();
  }

  @AllowAnonymous()
  @Get('hoisting')
  @HttpCode(HttpStatus.OK)
  getHoistingExample() {
    return demonstrateHoisting();
  }

  @AllowAnonymous()
  @Get('promises-vs-callbacks')
  @HttpCode(HttpStatus.OK)
  getPromisesVsCallbacksExample() {
    return demonstrateAsyncPatterns();
  }

  @AllowAnonymous()
  @Get('http-status-codes')
  @HttpCode(HttpStatus.OK)
  getHttpStatusCodesSummary() {
    return {
      title: 'HTTP status codes used correctly',
      codes: {
        '200': 'OK - Successful GET/PATCH request processing',
        '201': 'Created - Successful POST resource creation',
        '204': 'No Content - Successful DELETE request without payload',
        '400': 'Bad Request - Validation or invalid client payload',
        '401': 'Unauthorized - Authentication required or session expired',
        '403': 'Forbidden - Lacks authorization for resource access',
        '404': 'Not Found - Resource requested does not exist',
        '409': 'Conflict - Resource unique constraint collision',
        '422': 'Unprocessable Entity - Domain logic validation failed',
        '500': 'Internal Server Error - Unhandled operational error',
        '503': 'Service Unavailable - Database or API offline',
      },
    };
  }
}