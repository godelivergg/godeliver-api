import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderProductsEntity } from '../entities/order_products.entity';
import { LoggerModule } from '../../../helpers/logger/logger.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as mocks from "./mock.test"

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<OrderEntity>;
  let orderProductsRepository: Repository<OrderProductsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(mocks.orderEntityList),
          },
        },
        {
          provide: getRepositoryToken(OrderProductsEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(mocks.orderProductsEntityList),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
    orderProductsRepository = module.get<Repository<OrderProductsEntity>>(
      getRepositoryToken(OrderProductsEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('test should return a order entity with associations successfuly', async () => {
      const result = await service.findAll({ orderExternalId: 1, offset: 0, limit: 10 });

      expect(result).toEqual(mocks.ordersByUser);
      expect(orderRepository.find).toHaveBeenCalledTimes(1);
      expect(orderProductsRepository.find).toHaveBeenCalledTimes(2);
    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(orderProductsRepository, 'find').mockRejectedValueOnce(new Error());

      expect(orderRepository.find).toHaveBeenCalledTimes(0);
      expect(
        service.findAll({ orderExternalId: 1, offset: 0, limit: 10 }),
      ).rejects.toThrowError();
    });
  });

});
