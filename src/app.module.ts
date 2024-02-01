import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './helpers/logger/logger.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { ProductModule } from './app/product/product.module';
import { ImportModule } from './app/import/import.module';
import { OrderModule } from './app/order/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
      ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', ''),
        port: Number(configService.get('POSTGRES_PORT', 5432)),
        username: configService.get('POSTGRES_USER', ''),
        password: configService.get('POSTGRES_PASSWORD', ''),
        database: configService.get('POSTGRES_DATABASE', ''),
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
        synchronize: true,
      } as TypeOrmModuleOptions),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: '../public',
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    }),
    LoggerModule,
    UserModule,
    ProductModule,
    ImportModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
