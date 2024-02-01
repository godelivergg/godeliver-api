import { IsNotEmpty } from 'class-validator';
import { OrderEntity } from '../entities/order.entity';
import { ProductDto } from 'src/app/product/dto/product.dto';

export class OrderProductsDto {
    /**
     * order created before
     * @example 117b820b-02ed-4aee-be11-0db7b2c01b51
     */
    @IsNotEmpty()
    order: OrderEntity;

    /**
     * product created before
     * @example 117b820b-02ed-4aee-be11-0db7b2c01b51
     */
    @IsNotEmpty()
    product: ProductDto;

    /**
    * product value in this order
    * @example 22.50
    */
    @IsNotEmpty()
    productValue: number;

}
