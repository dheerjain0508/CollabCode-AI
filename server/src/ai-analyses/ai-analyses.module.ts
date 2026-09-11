import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAnalysesController } from './ai-analyses.controller';
import { AiAnalysesService } from './ai-analyses.service';
import {
  AiAnalysis,
  AiAnalysisSchema,
} from './schemas/ai-analysis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AiAnalysis.name,
        schema: AiAnalysisSchema,
      },
    ]),
  ],
  controllers: [AiAnalysesController],
  providers: [AiAnalysesService],
})
export class AiAnalysesModule {}