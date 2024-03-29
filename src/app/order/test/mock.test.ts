import { Between } from "typeorm";
import { productEntityList } from "../../product/test/mock.test";
import { userEntityList } from "../../user/test/mock.test";
import { OrderDto } from "../dto/order.dto";
import { OrderProductsDto } from "../dto/orderProducts.dto";
import { OrderEntity } from "../entities/order.entity";
import { OrderProductsEntity } from "../entities/order_products.entity";
import * as types from "../types/order.types"

export const orderEntityList: OrderEntity[] = [
    new OrderEntity({
        id: '1',
        orderExternalId: 1,
        orderDate: 20240129,
        user: userEntityList[0]
    }),
    new OrderEntity({
        id: '2',
        orderExternalId: 2,
        orderDate: 20240129,
        user: userEntityList[0]
    }),
];

export const orderProductsEntityList: OrderProductsEntity[] = [
    new OrderProductsEntity({
        id: '1',
        order: orderEntityList[0],
        productValue: 25.30,
        product: productEntityList[0]
    }),
    new OrderProductsEntity({
        id: '2',
        order: orderEntityList[1],
        productValue: 80.30,
        product: productEntityList[1]
    }),
];

export const ordersByUser: types.Order[] = [
    {
        user_id: userEntityList[0].userExternalId,
        name: userEntityList[0].name,
        orders: [
            {
                order_id: orderProductsEntityList[0].order.orderExternalId,
                date: '2024-01-29',
                total: '105.60',
                products: [
                    {
                        product_id: productEntityList[0].productExternalId,
                        value: String(orderProductsEntityList[0].productValue)
                    },
                    {
                        product_id: productEntityList[1].productExternalId,
                        value: String(orderProductsEntityList[1].productValue)
                    }
                ]
            },
            {
                order_id: orderProductsEntityList[1].order.orderExternalId,
                date: '2024-01-29',
                total: '105.60',
                products: [
                    {
                        product_id: productEntityList[0].productExternalId,
                        value: String(orderProductsEntityList[0].productValue)
                    },
                    {
                        product_id: productEntityList[1].productExternalId,
                        value: String(orderProductsEntityList[1].productValue)
                    }
                ]
            },

        ]
    }
]

export const ordersRequestMock = {
    order_id: 1,
    offset: 0,
    limit: 10,
    user_name: 'teste'
};

export const headerParams = {
    offset: 0,
    limit: 10,
    options: {
        orderExternalId: 1,
        user: { name: 'teste' }
    }
};

export const returnUpsertOrder = {
    identifiers: [
        {
            id: 1
        }
    ]
}

export const orderCreate: OrderDto = {
    orderDate: 20230130,
    orderExternalId: 1,
    user: userEntityList[0]
}

export const orderProductsCreate: OrderProductsDto = {
    order: orderEntityList[0],
    product: productEntityList[0],
    productValue: 22.50
}

export const ordersRequestAllHeadersMock = {
    date_initial: '2024-01-29',
    date_final: '2024-01-29',
    order_id: 1,
    offset: 0,
    limit: 10,
    user_name: 'teste'
};


export const ordersRequestAllHeadersParamsMock = {
    offset: 0,
    limit: 10,
    options: {
        orderExternalId: 1,
        user: { name: 'teste' },
        orderDate: Between('20240129', '20240129')
    }
};