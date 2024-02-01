import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from '../import.controller';
import { ImportService } from '../import.service';
import { LoggerModule } from '../../../helpers/logger/logger.module';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';
import * as mocks from "./mock.test"

describe('ImportController', () => {
  let controller: ImportController;
  let service: ImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [ImportController],
      providers: [
        ImportService,
        {
          provide: ImportService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mocks.importEntityList),
          },
        },
      ]
    }).overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      }).compile();

    controller = module.get<ImportController>(ImportController);
    service = module.get<ImportService>(ImportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('user index', () => {

    it('test should return user list entity successfully', async () => {
      const importList = await controller.index(mocks.importRequestMock as any);

      expect(importList).toEqual({
        "status": 200,
        "records": mocks.importEntityList
      });
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('test should throw an exception when internal error server', () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.index(mocks.importRequestMock as any)).rejects.toThrowError();
    });
  })
})