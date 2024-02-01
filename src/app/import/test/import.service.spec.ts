import { Test, TestingModule } from '@nestjs/testing';
import { ImportService } from '../import.service';
import { Repository } from 'typeorm';
import { ImportEntity } from '../entity/import.entity';
import { LoggerModule } from '../../../helpers/logger/logger.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';
import * as mocks from "./mock.test"

describe('ImportService', () => {
  let service: ImportService;
  let importRepository: Repository<ImportEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ImportService,
        {
          provide: getRepositoryToken(ImportEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(mocks.importEntityList),
            create: jest.fn().mockResolvedValue(mocks.importEntityList[0]),
            findOne: jest.fn().mockResolvedValue(mocks.importEntityList[0]),
            merge: jest.fn().mockResolvedValue(mocks.importEntityList[0]),
            save: jest.fn().mockResolvedValue(mocks.importEntityList[0]),
          },
        },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
    importRepository = module.get<Repository<ImportEntity>>(
      getRepositoryToken(ImportEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('test should return imports successfully', async () => {
      const result = await service.findAll({
        id: '1',
        finished: true
      });

      expect(result).toEqual(mocks.importEntityList);
      expect(importRepository.find).toHaveBeenCalledTimes(1);
    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(importRepository, 'find').mockRejectedValueOnce(new Error());

      expect(
        service.findAll({
          id: '1',
          finished: true
        }),
      ).rejects.toThrowError();
    });
  });

  describe('createDefault', () => {
    it('test should create a new import entity successfully', async () => {
      const result = await service.createDefault();

      expect(result).toEqual(mocks.importEntityList[0]);
    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(importRepository, 'save').mockRejectedValueOnce(new Error());

      expect(
        service.createDefault()
      ).rejects.toThrowError();
    });
  });

  describe('finishImport', () => {
    it('test should finish a import successfully', async () => {
      const result = await service.finishImport('1');

      expect(result).toEqual(mocks.importEntityList[0]);
    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(importRepository, 'save').mockRejectedValueOnce(new Error());

      expect(
        service.finishImport('1')
      ).rejects.toThrowError();
    });
  });

});
