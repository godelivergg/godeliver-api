import { Module } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { LoggerModule } from 'src/helpers/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    LoggerModule
  ],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule { }
