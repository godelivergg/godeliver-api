import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as mockUser from "./mock.test"
import { LoggerInterface } from '../../../helpers/logger/logger.interface';
import { LoggerModule } from '../../../helpers/logger/logger.module';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;
  let logger: LoggerInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser.userEntityList[0]),
            upsert: jest.fn().mockResolvedValue(mockUser.newUserEntity),
          },
        },
        {
          provide: 'LoggerInterface',
          useValue: {
            createLog: jest.fn(),
            sendLog: jest.fn(),
            logMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    logger = module.get<LoggerInterface>('LoggerInterface');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('test should return a user entity successfuly', async () => {
      const result = await service.findOne({ where: { id: '1' } });

      expect(result).toEqual(mockUser.userEntityList[0]);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      // expect(logger.logMessage).toHaveBeenCalledTimes(0)
    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      expect(
        service.findOne({ where: { id: '1' } }),

      ).rejects.toThrowError();
    });
  });

  describe('createOrUpdate', () => {
    it('test should create a new user entity successfuly', async () => {
      const result = await service.createOrUpdate(mockUser.createBody);

      expect(result).toEqual(mockUser.userEntityList[0]);
      // expect(logger.logMessage).toHaveBeenCalledWith('Usuário inserido com sucesso: fake-name');
    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(userRepository, 'upsert').mockRejectedValueOnce(new Error());

      expect(
        service.createOrUpdate(mockUser.createBody)
      ).rejects.toThrowError();
    });
  });
});
