import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GCPLoggerService, LocalLoggerService } from './logger.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  providers: [
    {
      provide: 'LoggerInterface',
      useClass: process.env.NODE_ENV === 'local' ? LocalLoggerService : GCPLoggerService,
    }
  ],
  exports: ['LoggerInterface'],
})
export class LoggerModule { }
