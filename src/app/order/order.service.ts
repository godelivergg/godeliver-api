import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { OrderMessagesHelper, MessagesHelper } from "../../helpers/messages.helper"
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerInterface } from 'src/helpers/logger/logger.interface';
import { OrderProductsEntity } from './entities/order_products.entity';
import { OrderEntity } from './entities/order.entity';
import * as utils from "../../helpers/utils.date"
import * as types from "./types/order.types"

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(OrderProductsEntity)
    private readonly orderProductsRepository: Repository<OrderProductsEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject('LoggerInterface') private readonly logger: LoggerInterface
  ) { }

  create() {
    return 'This action adds a new order in import task';
  }

  async findAll(options: FindOptionsWhere<any>): Promise<types.Order[]> {
    const ordersGroupedByUser: types.Order | {} = {};

    try {

      const orders: OrderEntity[] = await this.orderRepository.find({
        where: options.options,
        relations: {
          user: true,
        },
        skip: options.offset,
        take: options.limit,
      });

      for (const order of orders) {
        let totalValueProducts: number = 0;
        let orderProducts: types.Product[] = [];

        const userId = order.user.id;

        const products: OrderProductsEntity[] = await this.orderProductsRepository.find({
          where: { order: { id: order.id } },
          relations: {
            product: true,
          },
        });

        await Promise.all(
          products.map(async (product) => {
            totalValueProducts = Number(totalValueProducts) + Number(product.productValue);
            orderProducts.push({
              product_id: product.product.productExternalId,
              value: String(product.productValue),
            });
          })
        );

        const orderWithProducts: types.OrderProducts = {
          order_id: order.orderExternalId,
          date: utils.formatDateToJson(order.orderDate),
          total: String(totalValueProducts),
          products: orderProducts,
        };

        if (!ordersGroupedByUser[userId]) {
          ordersGroupedByUser[userId] = {
            user_id: order.user.userExternalId,
            name: order.user.name,
            orders: [orderWithProducts],
          };
        } else {
          ordersGroupedByUser[userId].orders.push(orderWithProducts);
        }
      }

      return Object.values(ordersGroupedByUser);
    } catch (error) {

      this.logger.logMessage(`${OrderMessagesHelper.ERROR_GET_ORDER}`)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: MessagesHelper.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async buildOptionsFromHeaders(headers: any): Promise<types.OrderHeaders> {
    const dateInitialHeader = utils.formatDateToBD(headers['date_initial']);
    const dateFinalHeader = utils.formatDateToBD(headers['date_final']);

    let headerParams: types.OrderHeaders = {
      options: {
        orderExternalId: headers['order_id'],
        user: { name: headers['user_name'] }
      },
      offset: headers['offset'] ?? 0,
      limit: headers['limit'] ?? 10
    };

    if (utils.isValidDate(dateInitialHeader) && utils.isValidDate(dateFinalHeader)) {
      headerParams.options.orderDate = Between(dateInitialHeader, dateFinalHeader);

      return headerParams;
    }
    else if (utils.isValidDate(dateFinalHeader)) {
      headerParams.options.orderDate = LessThanOrEqual(dateFinalHeader);
    }
    else if (utils.isValidDate(dateInitialHeader)) {
      headerParams.options.orderDate = MoreThanOrEqual(dateInitialHeader);
    }

    return headerParams;
  }
}
