import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './helpers/logger/logger.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { ProductModule } from './app/product/product.module';
import { ImportModule } from './app/import/import.module';
import { OrderModule } from './app/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
      ({
        type: process.env.TYPEORM_CONNECTION,
        host: configService.get('POSTGRES_HOST', ''),
        port: Number(configService.get('POSTGRES_PORT', 5432)),
        username: configService.get('POSTGRES_USER', ''),
        password: configService.get('POSTGRES_PASSWORD', ''),
        database: configService.get('POSTGRES_DATABASE', ''),
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
        synchronize: true,
      } as TypeOrmModuleOptions),
    }),
    LoggerModule,
    UserModule,
    ProductModule,
    ImportModule,
    OrderModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
