import { IsNotEmpty } from 'class-validator';

export class ProductDto {

    /**
     * product id from legado system
     * @example 22
     */
    @IsNotEmpty()
    productExternalId: number;

}
