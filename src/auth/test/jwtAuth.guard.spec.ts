import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../jwtAuth.guard';
import { LoggerInterface } from '../../helpers/logger/logger.interface';

describe('JwtGuard', () => {
  let jwtService: JwtService;
  let jwtGuard: JwtAuthGuard;
  let logger: LoggerInterface;

  beforeEach(() => {
    jwtService = new JwtService();
    logger = {
      createLog: jest.fn(),
      sendLog: jest.fn(),
      logMessage: jest.fn(),
    };
    jwtGuard = new JwtAuthGuard(jwtService, logger);
  });

  it('should be defined', () => {
    expect(new JwtAuthGuard(jwtService, logger)).toBeDefined();
  });

  it('should use canActivate and return true', async () => {

    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockResolvedValue({});

    const mockRequest = {
      headers: {
        authorization: 'Bearer fake_token',
      },
    };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    };

    const result = await jwtGuard.canActivate(mockExecutionContext as any);

    expect(result).toBeTruthy();
    expect(logger.logMessage).toHaveBeenCalledWith(
      'Token autenticado com sucesso! Usuário: undefined'
    );
  });

  it('should use canActivate and return false if token is not provided', async () => {

    const mockRequest = {
      headers: {},
    };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    };

    const result = await jwtGuard.canActivate(mockExecutionContext as any);

    expect(result).toBeFalsy();
    expect(logger.logMessage).toHaveBeenCalledWith(
      'Erro ao autenticar! Detalhes: JsonWebTokenError: jwt must be provided'
    );
  });

  it('should use canActivate and return false if token is invalid', async () => {

    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));

    const mockRequest = {
      headers: {
        authorization: 'Bearer invalid_token',
      },
    };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    };

    const result = await jwtGuard.canActivate(mockExecutionContext as any);

    expect(result).toBeFalsy();
    expect(logger.logMessage).toHaveBeenCalledWith(
      'Erro ao autenticar! Detalhes: Error: Invalid token'
    );
  });
});
