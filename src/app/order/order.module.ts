import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../helpers/logger/logger.module';
import { OrderProductsEntity } from './entities/order_products.entity';
import { JwtModule } from '@nestjs/jwt';
import { OrderEntity } from './entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderProductsEntity
    ]),
    LoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY
    }),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule { }
