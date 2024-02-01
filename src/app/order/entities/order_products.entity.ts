import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm"
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "../../product/entity/product.entity";

@Entity({ name: 'order_products' })
@Index(["order", "product"], { unique: true })
export class OrderProductsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OrderEntity, (order) => order)
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, (product) => product)
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @Column({ name: 'product_value', type: "decimal", precision: 12, scale: 2, default: 0 })
    productValue: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    constructor(order_products?: Partial<OrderProductsEntity>) {
        this.id = order_products?.id;
        this.order = order_products?.order;
        this.product = order_products?.product;
        this.productValue = order_products?.productValue;
        this.createdAt = order_products?.createdAt;
        this.updatedAt = order_products?.updatedAt;
    }
}