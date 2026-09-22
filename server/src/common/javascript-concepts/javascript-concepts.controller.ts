import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { demonstrateEventLoop } from './event-loop';
import { demonstrateHoisting } from './hoisting';
import { demonstrateAsyncPatterns } from './promises-vs-callbacks';

@Controller('javascript-concepts')
export class JavascriptConceptsController {
  @AllowAnonymous()
  @Get('event-loop')
  getEventLoopExample() {
    return demonstrateEventLoop();
  }

  @AllowAnonymous()
  @Get('hoisting')
  getHoistingExample() {
    return demonstrateHoisting();
  }

  @AllowAnonymous()
  @Get('promises-vs-callbacks')
  getPromisesVsCallbacksExample() {
    return demonstrateAsyncPatterns();
  }
}