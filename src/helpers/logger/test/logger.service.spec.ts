import { Test, TestingModule } from '@nestjs/testing';
import { GCPLoggerService, LocalLoggerService } from '../logger.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerInterface } from '../logger.interface';

describe('LoggerService', () => {
  let gcpService: GCPLoggerService;
  let localService: LocalLoggerService;
  let logger: LoggerInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GCPLoggerService,
        LocalLoggerService
      ],
    }).compile();

    logger = {
      createLog: jest.fn(),
      sendLog: jest.fn(),
      logMessage: jest.fn(),
    };

    gcpService = module.get<GCPLoggerService>(GCPLoggerService);
    localService = module.get<LocalLoggerService>(LocalLoggerService);
  });

  it('should be defined', () => {
    expect(gcpService).toBeDefined();
    expect(localService).toBeDefined();
  });

  it('should call gcp logger service when its not env local', () => {
    const spyCreateLog = jest.spyOn(gcpService, 'createLog');
    const spySendLog = jest.spyOn(gcpService, 'sendLog');

    gcpService.logMessage('Fake message');

    expect(spyCreateLog).toHaveBeenCalledWith('Fake message');
    expect(spySendLog).toHaveBeenCalled();
  });

  it('should call local logger service when env is local', () => {
    const spyCreateLog = jest.spyOn(localService, 'createLog');
    const spySendLog = jest.spyOn(localService, 'sendLog');

    process.env.NODE_ENV = 'local';

    localService.logMessage('Fake message');

    expect(spyCreateLog).toHaveBeenCalledWith('Fake message');
    expect(spySendLog).toHaveBeenCalled();
    process.env.NODE_ENV = 'test';
  });

});
