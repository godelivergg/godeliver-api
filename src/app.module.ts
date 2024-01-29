import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './helpers/logger/logger.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
      ({
        type: process.env.TYPEORM_CONNECTION,
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: Number(configService.get('POSTGRES_PORT', 5432)),
        username: configService.get('POSTGRES_USER', ''),
        password: configService.get('POSTGRES_PASSWORD', ''),
        database: configService.get('POSTGRES_DATABASE', ''),
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
        synchronize: true,
      } as TypeOrmModuleOptions),
    }),
    LoggerModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
