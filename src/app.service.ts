import { Injectable, Inject } from '@nestjs/common';
import { LoggerInterface } from './helpers/logger/logger.interface';

@Injectable()
export class AppService {

  constructor(@Inject('LoggerInterface') private readonly logger: LoggerInterface) { }

  getHello(): string {
    this.logger.logMessage('Hello World!')
    return 'Hello World!';
  }
}
