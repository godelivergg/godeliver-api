import { Module } from '@nestjs/common';
import { ImportService } from '../import/import.service';
import { ImportController } from '../import/import.controller';
import { ImportEntity } from './entity/import.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../helpers/logger/logger.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImportEntity]),
    LoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY
    }),
  ],
  providers: [ImportService],
  controllers: [ImportController],
  exports: [ImportService]
})
export class ImportModule { }
