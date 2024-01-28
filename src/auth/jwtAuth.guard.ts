import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as JwtService from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService.JwtService) { }

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

      return true;
    } catch (error) {
      console.log(error)
    }

    return false;
  }
}
