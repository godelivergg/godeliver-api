import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';
import { ImportModule } from '../app/import/import.module';
import { OrderModule } from '../app/order/order.module';
import { ProductModule } from '../app/product/product.module';
import { UserModule } from '../app/user/user.module';
import { LoggerModule } from '../helpers/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportService } from '../app/import/import.service';
import * as path from 'path';
import { UserService } from '../app/user/user.service';
import { ProductService } from '../app/product/product.service';
import { OrderService } from '../app/order/order.service';

import * as mocks from "./mock.test"
import * as mocksImport from "../app/import/test/mock.test"
import * as mocksUser from "../app/user/test/mock.test"
import * as mocksProduct from "../app/product/test/mock.test"
import * as mocksOrder from "../app/order/test/mock.test"
import { ImportTypeEnum } from '../types/importType.enum';

describe('AppService', () => {
    let service: AppService;
    let importService: ImportService;
    let userService: UserService;
    let productService: ProductService;
    let orderService: OrderService;

    const testFilePath = path.join(__dirname, '../../public/tests/teste.txt');

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                LoggerModule,
                UserModule,
                ProductModule,
                ImportModule,
                OrderModule,
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [
                        '../app/import/entity/import.entity.ts',
                        '../app/user/entity/user.entity.ts',
                        '../app/product/entity/product.entity.ts',
                        '../app/order/entities/order.entity.ts',
                        '../app/order/entities/order_products.entity.ts',
                    ],
                    synchronize: true,
                }),
            ],
            providers: [AppService]
        }).compile();

        service = module.get<AppService>(AppService);
        importService = module.get<ImportService>(ImportService);
        userService = module.get<UserService>(UserService);
        productService = module.get<ProductService>(ProductService);
        orderService = module.get<OrderService>(OrderService);
    })


    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('processUploadedFileInBackground', () => {
        it('should process an uploaded file for orders', async () => {
            jest.spyOn(importService, 'createDefault').mockResolvedValue(mocksImport.importEntityList[0]);
            jest.spyOn(importService, 'finishImport').mockResolvedValue(mocksImport.importEntityList[0]);

            jest.spyOn(service, 'parserOrder').mockResolvedValue(mocks.orderParsed);
            jest.spyOn(service, 'createOrder').mockResolvedValue();

            await service.processUploadedFileInBackground(testFilePath, ImportTypeEnum.ORDER);

            expect(importService.createDefault).toHaveBeenCalled();
            expect(service.parserOrder).toHaveBeenCalled();
            expect(service.createOrder).toHaveBeenCalled();
            expect(importService.finishImport).toHaveBeenCalled();
        });

        it('should process an uploaded file for orders even when type is not provider', async () => {
            jest.spyOn(importService, 'createDefault').mockResolvedValue(mocksImport.importEntityList[0]);
            jest.spyOn(importService, 'finishImport').mockResolvedValue(mocksImport.importEntityList[0]);

            jest.spyOn(service, 'parserOrder').mockResolvedValue(mocks.orderParsed);
            jest.spyOn(service, 'createOrder').mockResolvedValue();

            await service.processUploadedFileInBackground(testFilePath, undefined);

            expect(importService.createDefault).toHaveBeenCalled();
            expect(service.parserOrder).toHaveBeenCalled();
            expect(service.createOrder).toHaveBeenCalled();
            expect(importService.finishImport).toHaveBeenCalled();
        });
    });

    describe('parserOrder', () => {
        it('should parser a order line from txt file', async () => {

            const parserd = await service.parserOrder(
                '0000000001                                        teste00000000010000000001       22.5520240129'
            );

            expect(parserd).toEqual(mocks.orderParsedString);
        });
    });

    describe('createOrder', () => {
        it('should create all entities for order line parsed', async () => {
            jest.spyOn(userService, 'createOrUpdate').mockResolvedValue(mocksUser.userEntityList[0]);
            jest.spyOn(productService, 'createOrUpdate').mockResolvedValue(mocksProduct.productEntityList[0]);

            jest.spyOn(orderService, 'createOrUpdateOrder').mockResolvedValue(mocksOrder.orderEntityList[0]);
            jest.spyOn(orderService, 'createOrUpdateOrderProducts').mockResolvedValue(mocksOrder.orderProductsEntityList[0]);

            await service.createOrder(mocks.orderParsed);

            expect(userService.createOrUpdate).toHaveBeenCalled();
            expect(productService.createOrUpdate).toHaveBeenCalled();
            expect(orderService.createOrUpdateOrder).toHaveBeenCalled();
            expect(orderService.createOrUpdateOrderProducts).toHaveBeenCalled();
        });
    });
})