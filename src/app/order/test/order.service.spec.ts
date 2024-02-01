import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { OrderProductsEntity } from '../entities/order_products.entity';
import { LoggerModule } from '../../../helpers/logger/logger.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as mocks from "./mock.test"

beforeEach(() => {
  jest.clearAllMocks();
});

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
            findOne: jest.fn().mockResolvedValue(mocks.orderEntityList[0]),
            upsert: jest.fn().mockResolvedValue(mocks.returnUpsertOrder),
          },
        },
        {
          provide: getRepositoryToken(OrderProductsEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(mocks.orderProductsEntityList),
            findOne: jest.fn().mockResolvedValue(mocks.orderProductsEntityList[0]),
            upsert: jest.fn().mockResolvedValue(mocks.returnUpsertOrder),
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
    it('test should return a order entity with associations successfully', async () => {
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

  describe('createOrUpdateOrder', () => {
    it('test should create a order entity successfully', async () => {
      const result = await service.createOrUpdateOrder(mocks.orderCreate);

      expect(result).toEqual(mocks.orderEntityList[0]);
      expect(orderRepository.upsert).toHaveBeenCalledTimes(1);
      expect(orderRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('test should throw an exception when internal error server', async () => {
      jest.spyOn(orderRepository, 'findOne').mockRejectedValue(new Error());

      expect(orderRepository.upsert).toHaveBeenCalledTimes(0);
      expect(orderRepository.findOne).toHaveBeenCalledTimes(0);
      expect(
        () => service.createOrUpdateOrder(mocks.orderCreate)
      ).rejects.toThrow();
    });
  });

  describe('createOrUpdateOrderProducts', () => {
    it('test should create a order with associations entity successfully', async () => {
      const result = await service.createOrUpdateOrderProducts(mocks.orderProductsCreate);

      expect(result).toEqual(mocks.orderProductsEntityList[0]);
      expect(orderProductsRepository.upsert).toHaveBeenCalledTimes(1);
      expect(orderProductsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('test should throw an exception when internal error server in create order proucts', async () => {
      jest.spyOn(orderProductsRepository, 'findOne').mockRejectedValueOnce(new Error());

      expect(orderProductsRepository.upsert).toHaveBeenCalledTimes(0);
      expect(orderProductsRepository.findOne).toHaveBeenCalledTimes(0);
      expect(
        () => service.createOrUpdateOrderProducts(mocks.orderProductsCreate)
      ).rejects.toThrow();
    });
  });

  describe('buildOptionsFromHeaders', () => {
    it('test should mount options from header with both dates', async () => {
      const result = await service.buildOptionsFromHeaders(
        mocks.ordersRequestAllHeadersMock
      );

      expect(result).toEqual(mocks.ordersRequestAllHeadersParamsMock);
    });

    it('test should mount options from header with initial date', async () => {

      mocks.ordersRequestAllHeadersMock.date_final = undefined;
      mocks.ordersRequestAllHeadersParamsMock.options.orderDate = MoreThanOrEqual('20240129')

      const result = await service.buildOptionsFromHeaders(
        mocks.ordersRequestAllHeadersMock
      );

      expect(result).toEqual(mocks.ordersRequestAllHeadersParamsMock);
    });

    it('test should mount options from header with final date', async () => {

      mocks.ordersRequestAllHeadersMock.date_final = '2024-01-29';
      mocks.ordersRequestAllHeadersMock.date_initial = undefined;
      mocks.ordersRequestAllHeadersParamsMock.options.orderDate = LessThanOrEqual('20240129')

      const result = await service.buildOptionsFromHeaders(
        mocks.ordersRequestAllHeadersMock
      );

      console.log('abacate', result)

      expect(result).toEqual(mocks.ordersRequestAllHeadersParamsMock);
    });

  });

});
