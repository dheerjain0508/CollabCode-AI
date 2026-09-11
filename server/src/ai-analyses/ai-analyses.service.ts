import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AiAnalysis,
  AiAnalysisDocument,
} from './schemas/ai-analysis.schema';

@Injectable()
export class AiAnalysesService {
  constructor(
    @InjectModel(AiAnalysis.name)
    private readonly aiAnalysisModel: Model<AiAnalysisDocument>,
  ) {}

  // CREATE
  async create(data: Partial<AiAnalysis>) {
    const analysis = new this.aiAnalysisModel(data);

    return analysis.save();
  }

  // READ ALL
  async findAll() {
    return this.aiAnalysisModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  // READ ONE
  async findOne(id: string) {
    const analysis = await this.aiAnalysisModel
      .findById(id)
      .exec();

    if (!analysis) {
      throw new NotFoundException(
        'AI analysis not found',
      );
    }

    return analysis;
  }

  // UPDATE
  async update(
    id: string,
    data: Partial<AiAnalysis>,
  ) {
    const analysis =
      await this.aiAnalysisModel
        .findByIdAndUpdate(
          id,
          data,
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();

    if (!analysis) {
      throw new NotFoundException(
        'AI analysis not found',
      );
    }

    return analysis;
  }

  // DELETE
  async remove(id: string) {
    const analysis =
      await this.aiAnalysisModel
        .findByIdAndDelete(id)
        .exec();

    if (!analysis) {
      throw new NotFoundException(
        'AI analysis not found',
      );
    }

    return {
      message: 'AI analysis deleted successfully',
    };
  }
}