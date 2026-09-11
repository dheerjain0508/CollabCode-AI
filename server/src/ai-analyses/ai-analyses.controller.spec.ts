jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => {},
}));

jest.mock('@nestjs/mongoose', () => ({
  InjectModel: () => () => {},
  Prop: () => () => {},
  Schema: () => () => {},
  SchemaFactory: {
    createForClass: () => ({}),
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AiAnalysesController } from './ai-analyses.controller';
import { AiAnalysesService } from './ai-analyses.service';

describe('AiAnalysesController', () => {
  let controller: AiAnalysesController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [AiAnalysesController],
        providers: [
          {
            provide: AiAnalysesService,
            useValue: mockService,
          },
        ],
      }).compile();

    controller =
      module.get<AiAnalysesController>(
        AiAnalysesController,
      );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an AI analysis', async () => {
    const data = {
      userId: 'test-user',
      projectId: 'test-project',
      jobTitle: 'Frontend Developer',
      score: 85,
      summary: 'Strong frontend profile.',
      strengths: ['React'],
      missingSkills: ['Docker'],
      metadata: {
        source: 'AI Fit Analyzer',
      },
    };

    mockService.create.mockResolvedValue(data);

    const result = await controller.create(data);

    expect(result).toEqual(data);
    expect(mockService.create).toHaveBeenCalledWith(data);
  });

  it('should return all AI analyses', async () => {
    const analyses = [
      {
        userId: 'test-user',
        projectId: 'test-project',
        score: 85,
      },
    ];

    mockService.findAll.mockResolvedValue(analyses);

    const result = await controller.findAll();

    expect(result).toEqual(analyses);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return one AI analysis', async () => {
    const analysis = {
      _id: '123',
      score: 85,
    };

    mockService.findOne.mockResolvedValue(analysis);

    const result = await controller.findOne('123');

    expect(result).toEqual(analysis);
    expect(mockService.findOne).toHaveBeenCalledWith('123');
  });

  it('should update an AI analysis', async () => {
    const updateData = {
      score: 90,
    };

    const updated = {
      _id: '123',
      score: 90,
    };

    mockService.update.mockResolvedValue(updated);

    const result = await controller.update(
      '123',
      updateData,
    );

    expect(result).toEqual(updated);
    expect(mockService.update).toHaveBeenCalledWith(
      '123',
      updateData,
    );
  });

  it('should delete an AI analysis', async () => {
    const response = {
      message: 'AI analysis deleted successfully',
    };

    mockService.remove.mockResolvedValue(response);

    const result = await controller.remove('123');

    expect(result).toEqual(response);
    expect(mockService.remove).toHaveBeenCalledWith('123');
  });
});