export interface OrderHeaders {
    options: {
        orderExternalId?: number;
        user?: { name: string };
        orderDate?: any;
    };
    offset?: number;
    limit?: number;
    size?: number;
}

export interface Product {
    product_id: number;
    value: string;
}

export interface OrderProducts {
    order_id: number;
    date: string;
    total: string;
    products: Product[]
}

export interface Order {
    user_id: number;
    name: string;
    orders: OrderProducts[];
}