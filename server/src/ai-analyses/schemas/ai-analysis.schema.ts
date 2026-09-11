import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AiAnalysisDocument = HydratedDocument<AiAnalysis>;

@Schema({ timestamps: true })
export class AiAnalysis {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], default: [] })
  strengths: string[];

  @Prop({ type: [String], default: [] })
  missingSkills: string[];

  @Prop({
    type: Object,
    default: {},
  })
  metadata: Record<string, unknown>;
}

export const AiAnalysisSchema =
  SchemaFactory.createForClass(AiAnalysis);

AiAnalysisSchema.index({ userId: 1 });
AiAnalysisSchema.index({ projectId: 1 });