import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { LoggerModule } from '../../helpers/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    LoggerModule
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
