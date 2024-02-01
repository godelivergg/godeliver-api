import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from "../app.controller";
import { AppService } from "../app.service";
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { ImportModule } from '../app/import/import.module';
import { OrderModule } from '../app/order/order.module';
import { ProductModule } from '../app/product/product.module';
import { UserModule } from '../app/user/user.module';
import { LoggerModule } from '../helpers/logger/logger.module';
import { ImportService } from '../app/import/import.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as mocks from "./mock.test"
import * as mocksImport from "../app/import/test/mock.test"

describe('AppController', () => {
    let controller: AppController;
    let service: AppService;
    let importService: ImportService;

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
                    ],
                    synchronize: true,
                }),
            ],
            controllers: [AppController],
            providers: [
                AppService,
                {
                    provide: AppService,
                    useValue: {
                        processUploadedFileInBackground: jest.fn().mockResolvedValue(Promise<void>),
                    },
                },
            ]
        }).overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: jest.fn().mockReturnValue(true),
            }).compile();

        controller = module.get<AppController>(AppController);
        service = module.get<AppService>(AppService);
        importService = module.get<ImportService>(ImportService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('should process file in background', () => {
        it('should process a file orders and return success', async () => {
            jest.spyOn(importService, 'findAll').mockResolvedValue([]);

            const importList = await controller.uploadFile(
                mocks.filePathMock as any,
                mocks.fileRequestMock as any
            );

            expect(importList).toEqual({
                "status": 200,
                "message": 'Arquivo recebido e processamento iniciado em segundo plano.'
            });
            expect(importService.findAll).toHaveBeenCalledTimes(1);
            expect(service.processUploadedFileInBackground).toHaveBeenCalledTimes(1);
        });

        it('should return bad request if no file provider', async () => {
            jest.spyOn(importService, 'findAll').mockResolvedValue([]);

            const importList = await controller.uploadFile(
                {} as any,
                mocks.fileRequestMock as any
            );

            expect(importList).toEqual({
                "status": 400,
                "message": 'Nenhum arquivo enviado.'
            });
            expect(importService.findAll).toHaveBeenCalledTimes(0);
            expect(service.processUploadedFileInBackground).toHaveBeenCalledTimes(0);
        });

        it('should return conflict if any import is in progress', async () => {
            jest.spyOn(importService, 'findAll').mockResolvedValue([mocksImport.importEntityList[0]]);

            const importList = await controller.uploadFile(
                mocks.filePathMock as any,
                mocks.fileRequestMock as any
            );

            expect(importList).toEqual({
                "status": 409,
                "message": 'Já existe uma importação em andamento.'
            });
            expect(importService.findAll).toHaveBeenCalledTimes(1);
            expect(service.processUploadedFileInBackground).toHaveBeenCalledTimes(0);
        });
    });
})