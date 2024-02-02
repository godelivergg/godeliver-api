import { IsNotEmpty } from 'class-validator';
import { UserEntity } from '../../user/entity/user.entity';

export class OrderDto {
    /**
     * number date
     * @example 20211121
     */
    @IsNotEmpty()
    orderDate: number;

    /**
     * user id from legado system
     * @example 22
     */
    @IsNotEmpty()
    orderExternalId: number;

    /**
    * user created before
    * @example 117b820b-02ed-4aee-be11-0db7b2c01b51
    */
    @IsNotEmpty()
    user: UserEntity;

}

export class OrderHeaders {

    user_name: string;
    date_initial: string;
    date_final: string;
    limit: number;
    offset: number;

}