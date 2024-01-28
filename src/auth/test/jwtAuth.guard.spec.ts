import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../jwtAuth.guard';

describe('JwtGuard', () => {
  let jwtService: JwtService;
  let jwtGuard: JwtAuthGuard;

  beforeEach(() => {
    jwtService = new JwtService();
    jwtGuard = new JwtAuthGuard(jwtService);
  });

  it('should be defined', () => {
    expect(new JwtAuthGuard(jwtService)).toBeDefined();
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
  });
});
