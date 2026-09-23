import { Module } from '@nestjs/common';
import { SqlJoinsController } from './sql-joins.controller';
import { SqlJoinsService } from './sql-joins.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SqlJoinsController],
  providers: [SqlJoinsService],
  exports: [SqlJoinsService],
})
export class SqlJoinsModule {}
