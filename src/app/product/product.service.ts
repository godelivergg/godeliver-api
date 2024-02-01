import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { LoggerInterface } from '../../helpers/logger/logger.interface';
import { ProductDto } from './dto/product.dto';
import { ProductMessagesHelper, MessagesHelper } from "../../helpers/messages.helper"

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @Inject('LoggerInterface') private readonly logger: LoggerInterface
    ) { }


    async findOne(conditions: FindManyOptions<ProductEntity>): Promise<ProductEntity> {
        try {
            const user = await this.productRepository.findOne({
                where: conditions.where,
            });

            return user;
        } catch (error) {

            this.logger.logMessage(`${ProductMessagesHelper.ERROR_GET_PRODUCT} ${conditions.where}`)
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: MessagesHelper.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createOrUpdate(data: ProductDto) {

        try {
            const productUpsert = await this.productRepository.upsert(data, ['productExternalId']);
            this.logger.logMessage(`${ProductMessagesHelper.SUCCESS_PRODUCT} ${data.productExternalId}`)

            const productUpsertId = productUpsert.identifiers[0].id
            const product: ProductEntity = await this.findOne({ where: { id: productUpsertId } });

            return product
        }
        catch (error) {

            this.logger.logMessage(`${ProductMessagesHelper.ERROR_PRODUCT} ${data.productExternalId}`)
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: MessagesHelper.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        };
    }


}
