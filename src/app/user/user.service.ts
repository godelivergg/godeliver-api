import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import {
    MessagesHelper,
    UserMessagesHelper,
} from '../../helpers/messages.helper';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerInterface } from '../../helpers/logger/logger.interface';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @Inject('LoggerInterface') private readonly logger: LoggerInterface
    ) { }

    async findOne(conditions: FindManyOptions<UserEntity>): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOne({
                where: conditions.where,
            });

            return user;
        } catch (error) {

            this.logger.logMessage(`${UserMessagesHelper.ERROR_GET_USER} ${conditions.where}`)
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: MessagesHelper.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createOrUpdate(data: UserDto) {

        try {
            const userUpsert = await this.userRepository.upsert(data, ['userExternalId']);
            this.logger.logMessage(`${UserMessagesHelper.SUCCESS_USER} ${data.name}`)

            const userUpsertId = userUpsert.identifiers[0].id
            const user: UserEntity = await this.findOne({ where: { id: userUpsertId } });

            return user
        }
        catch (error) {

            this.logger.logMessage(`${UserMessagesHelper.ERROR_USER} ${data.name}`)
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
