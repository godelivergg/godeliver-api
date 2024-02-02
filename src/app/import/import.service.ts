import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ImportEntity } from './entity/import.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerInterface } from '../../helpers/logger/logger.interface';
import { ImportMessagesHelper, MessagesHelper } from "../../helpers/messages.helper"

@Injectable()
export class ImportService {

    constructor(
        @InjectRepository(ImportEntity)
        private readonly importRepository: Repository<ImportEntity>,
        @Inject('LoggerInterface') private readonly logger: LoggerInterface
    ) { }

    async findAll(options: FindOptionsWhere<ImportEntity>): Promise<ImportEntity[]> {
        try {
            const importFiltered = await this.importRepository.find({
                where: options,
                order: {
                    createdAt: 'DESC',
                },
                skip: 0,
                take: 15,
            });

            return importFiltered;

        } catch (error) {

            this.logger.logMessage(`${ImportMessagesHelper.ERROR_GET_IMPORT}`)
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: MessagesHelper.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createDefault(): Promise<ImportEntity> {
        const newImport = this.importRepository.create();

        return await this.importRepository
            .save(newImport)
            .then(() => {
                this.logger.logMessage(`${ImportMessagesHelper.CREATE_IMPORT} ${newImport.id}`)
                return newImport;
            })
            .catch(() => {
                this.logger.logMessage(`${ImportMessagesHelper.FINISH_IMPORT} ${newImport.id}`)
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: MessagesHelper.INTERNAL_SERVER_ERROR,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            });
    }

    async finishImport(importId: string): Promise<ImportEntity> {

        const importItem = await this.importRepository.findOne({
            where: { id: importId },
        });

        try {
            this.importRepository.merge(importItem, { finished: true });
            this.logger.logMessage(`${ImportMessagesHelper.FINISH_IMPORT} ${importItem.id}`)

            return await this.importRepository.save(importItem);
        } catch (error) {
            this.logger.logMessage(`${ImportMessagesHelper.FINISH_IMPORT_ERROR} ${importId}`)
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: MessagesHelper.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
