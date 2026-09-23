import { Module } from '@nestjs/common';
import { HttpStatusCodesController } from './http-status-codes.controller';
import { HttpStatusCodesService } from './http-status-codes.service';

@Module({
  controllers: [HttpStatusCodesController],
  providers: [HttpStatusCodesService],
  exports: [HttpStatusCodesService],
})
export class HttpStatusCodesModule {}
