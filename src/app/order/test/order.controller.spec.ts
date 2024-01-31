import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { LoggerModule } from '../../../helpers/logger/logger.module';
import { JwtAuthGuard } from '../../../auth/jwtAuth.guard';
import { OrderService } from '../order.service';
import * as mocks from "./mock.test"

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: OrderService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mocks.ordersByUser),
            buildOptionsFromHeaders: jest.fn().mockResolvedValue(mocks.headerParams)
          },
        },
      ]
    }).overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('user index', () => {

    it('test should return user list entity successfuly', async () => {
      const orders = await controller.index(mocks.ordersRequestMock as any);

      expect(orders).toEqual({
        "status": 200,
        "pagination": {
          "offset": 0,
          "limit": 10,
          "size": 1
        },
        "records": mocks.ordersByUser
      });
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('test should throw an exception when internal error server', () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.index(mocks.ordersRequestMock as any)).rejects.toThrowError();
    });
  })

});
