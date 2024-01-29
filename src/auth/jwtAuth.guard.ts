import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import * as JwtService from '@nestjs/jwt';
import { LoggerInterface } from 'src/helpers/logger/logger.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService.JwtService,
    @Inject('LoggerInterface') private readonly logger: LoggerInterface
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (process.env.NODE_ENV === 'local') {
      return true;
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded;

      this.logger.logMessage(`Token autenticado com sucesso! Usuário: ${decoded.email}`)
      return true;
    } catch (error) {
      this.logger.logMessage(`Erro ao autenticar! Detalhes: ${error}`)
    }

    return false;
  }
}
