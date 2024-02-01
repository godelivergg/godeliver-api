import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as readline from 'readline';
import { ImportService } from './app/import/import.service';
import { UserService } from './app/user/user.service';
import { ProductService } from './app/product/product.service';
import { OrderService } from './app/order/order.service';
import { LoggerInterface } from './helpers/logger/logger.interface';
import * as types from "./types/orderFile.types"
import { ImportTypeEnum } from './types/importType.enum';

@Injectable()
export class AppService {

    constructor(
        @Inject(ImportService) private readonly importService: ImportService,
        @Inject(UserService) private readonly userService: UserService,
        @Inject(ProductService) private readonly productService: ProductService,
        @Inject(OrderService) private readonly orderService: OrderService,
        @Inject('LoggerInterface') private readonly logger: LoggerInterface
    ) { }


    async processUploadedFileInBackground(filePath: string, type: ImportTypeEnum | undefined): Promise<void> {
        let parserFunction = 'parserOrder'
        let handleFunction = 'createOrder'

        const importItem = await this.importService.createDefault()

        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        switch (type) {
            case ImportTypeEnum.ORDER:
                parserFunction = 'parserOrder'
                handleFunction = 'createOrder'
                break;
            default:
                break;
        }

        for await (const line of rl) {
            const linesParser = await this[parserFunction](line);
            await this[handleFunction](linesParser);
        }

        const finishImport = await this.importService.finishImport(importItem.id)
        this.logger.logMessage(`Leitura do arquivo concluída. Importe para consulta de erros: ${finishImport.id}`)

    }

    async parserOrder(line): Promise<types.OrderParser> {

        const userExternalId = parseInt(line.slice(1, 11), 10).toString();
        const name = line.slice(11, 55).trim();
        const orderExternalId = parseInt(line.slice(55, 65), 10).toString();
        const productExternalId = parseInt(line.slice(65, 75), 10).toString();
        const productValue = parseFloat(line.slice(75, 87));
        const orderDate = line.slice(87, 95);

        return {
            userExternalId,
            name,
            orderExternalId,
            productExternalId,
            productValue,
            orderDate
        };
    }

    async createOrder(order: types.OrderParser) {

        const user = await this.userService.createOrUpdate({
            name: order.name,
            userExternalId: order.userExternalId
        })

        const product = await this.productService.createOrUpdate({
            productExternalId: order.productExternalId
        })

        const orderBase = await this.orderService.createOrUpdateOrder({
            orderDate: order.orderDate,
            orderExternalId: order.orderExternalId,
            user: user
        })

        await this.orderService.createOrUpdateOrderProducts({
            order: orderBase,
            product: product,
            productValue: order.productValue
        })
    }

}