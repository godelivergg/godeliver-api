import { ProductDto } from "../dto/product.dto";
import { ProductEntity } from "../entity/product.entity";

export const productEntityList: ProductEntity[] = [
    new ProductEntity({
        id: '1',
        productExternalId: 1,
    }),
    new ProductEntity({
        id: '2',
        productExternalId: 2,
    }),
];

export const newProductEntity: ProductEntity = new ProductEntity({
    id: '1',
    productExternalId: 1,
});

export const createBody: ProductDto = {
    productExternalId: 1,
};